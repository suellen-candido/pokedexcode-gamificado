import { NextResponse } from 'next/server'
import type {
  BattleState,
  BattleAction,
  TurnResult,
  QuestionResult,
} from '@/lib/core/types/battle.type'
import { DIFFICULTY_MULTIPLIERS } from '@/lib/core/types/battle.type'
import {
  calculateDamage,
  getTypeEffectiveness,
  isCriticalHit,
  doesMoveHit,
  getEffectivenessMessage,
} from '@/lib/core/utils/battle-damage'
import { getBattle, saveBattle } from '@/lib/core/services/battle-storage'
import { getRandomQuestion, checkAnswer, getQuestionById } from '@/lib/core/utils/battle-questions'

/**
 * Executa um turno completo (jogador + CPU)
 */
function executeTurn(
  battle: BattleState,
  playerAction: BattleAction,
  questionAnswer?: number,
  questionId?: string
): TurnResult[] {
  const results: TurnResult[] = []
  
  // Se há uma pergunta pendente e o jogador está atacando
  let difficultyMultiplier = 1.0
  let questionResult: QuestionResult | undefined

  if (
    playerAction.type === 'move' &&
    battle.currentQuestion &&
    battle.waitingForAnswer &&
    questionAnswer !== undefined
  ) {
    // Verifica a resposta
    const isCorrect = checkAnswer(battle.currentQuestion, questionAnswer)
    
    // Define o multiplicador baseado na dificuldade e se acertou
    if (isCorrect) {
      difficultyMultiplier = DIFFICULTY_MULTIPLIERS[battle.currentQuestion.difficulty]
    } else {
      // Resposta errada = metade do dano base (penalidade)
      difficultyMultiplier = 0.5
    }

    const timeToAnswer = battle.questionStartTime 
      ? Date.now() - battle.questionStartTime 
      : undefined

    questionResult = {
      correct: isCorrect,
      damageMultiplier: difficultyMultiplier,
      question: battle.currentQuestion,
      selectedAnswer: questionAnswer,
      timeToAnswer,
    }

    // Limpa a pergunta
    battle.currentQuestion = undefined
    battle.waitingForAnswer = false
    battle.questionStartTime = undefined

    // Log da resposta
    battle.log.push({
      timestamp: Date.now(),
      message: isCorrect
        ? `Resposta correta! Dano ${difficultyMultiplier > 1 ? 'aumentado' : 'normal'}! (${battle.team1.pokemon[battle.team1.activePokemonIndex].name})`
        : 'Resposta errada! Dano reduzido pela metade!',
      type: 'info',
    })
  }
  
  // 1. Ação do jogador
  const playerResults = executeAction(battle, playerAction, difficultyMultiplier)
  
  // Adiciona o resultado da pergunta ao primeiro resultado
  if (questionResult && playerResults.length > 0) {
    playerResults[0].questionResult = questionResult
    playerResults[0].difficultyMultiplier = difficultyMultiplier
  }
  
  results.push(...playerResults)
  
  // Verifica se a batalha acabou
  if (battle.status === 'finished') {
    return results
  }
  
  // 2. Ação da CPU (se a batalha continuar)
  const cpuAction = getCpuAction(battle)
  const cpuResults = executeAction(battle, cpuAction, 1.0) // CPU não responde perguntas
  results.push(...cpuResults)
  
  // Incrementa turno
  battle.turn++
  battle.updatedAt = new Date()
  
  return results
}

/**
 * Executa uma ação de um treinador
 */
function executeAction(
  battle: BattleState,
  action: BattleAction,
  difficultyMultiplier: number = 1.0
): TurnResult[] {
  const results: TurnResult[] = []
  const isPlayer = action.trainerId === battle.team1.trainerId
  const attackerTeam = isPlayer ? battle.team1 : battle.team2
  const defenderTeam = isPlayer ? battle.team2 : battle.team1
  
  const attacker = attackerTeam.pokemon[attackerTeam.activePokemonIndex]
  const defender = defenderTeam.pokemon[defenderTeam.activePokemonIndex]
  
  // Verifica se o atacante está vivo
  if (!attacker.isAlive) {
    return results
  }
  
  // Troca de Pokémon
  if (action.type === 'switch' && action.switchToIndex !== undefined) {
    const newPokemon = attackerTeam.pokemon[action.switchToIndex]
    if (newPokemon.isAlive) {
      attackerTeam.activePokemonIndex = action.switchToIndex
      battle.log.push({
        timestamp: Date.now(),
        message: `${attackerTeam.trainerName} trocou para ${newPokemon.name}!`,
        type: 'switch',
      })
      results.push({
        success: true,
        message: `${attackerTeam.trainerName} trocou para ${newPokemon.name}!`,
      })
    }
    return results
  }
  
  // Ataque
  if (action.type === 'move' && action.moveIndex !== undefined) {
    const move = attacker.moves[action.moveIndex]
    
    if (!move || move.pp <= 0) {
      results.push({
        success: false,
        message: `${move?.name || 'Movimento'} não tem PP!`,
      })
      return results
    }
    
    // Diminui PP
    move.pp--
    
    // Verifica acerto
    if (!doesMoveHit(move.accuracy)) {
      battle.log.push({
        timestamp: Date.now(),
        message: `${attacker.name} usou ${move.name}, mas errou!`,
        type: 'info',
      })
      results.push({
        success: false,
        message: `${attacker.name} errou o ataque!`,
      })
      return results
    }
    
    // Calcula dano
    const effectiveness = getTypeEffectiveness(move.type, defender.types)
    const critical = isCriticalHit()
    const isStab = attacker.types.includes(move.type)
    
    const attackStat = move.category === 'physical' ? attacker.stats.attack : attacker.stats.specialAttack
    const defenseStat = move.category === 'physical' ? defender.stats.defense : defender.stats.specialDefense
    
    const damage = calculateDamage(
      attacker.level,
      attackStat,
      defenseStat,
      move.power,
      effectiveness,
      critical,
      isStab,
      difficultyMultiplier
    )
    
    const oldHp = defender.currentHp
    defender.currentHp = Math.max(0, defender.currentHp - damage)
    
    // Log de ataque
    let message = `${attacker.name} usou ${move.name}! Causou ${damage} de dano.`
    if (critical) message += ' Acerto crítico!'
    const effectMsg = getEffectivenessMessage(effectiveness)
    if (effectMsg) message += ` ${effectMsg}`
    
    battle.log.push({
      timestamp: Date.now(),
      message,
      type: 'damage',
    })
    
    results.push({
      success: true,
      message,
      damage,
      isCritical: critical,
      effectiveness,
      oldHp,
      newHp: defender.currentHp,
    })
    
    // Verifica se desmaiou
    if (defender.currentHp <= 0) {
      defender.isAlive = false
      battle.log.push({
        timestamp: Date.now(),
        message: `${defender.name} desmaiou!`,
        type: 'faint',
      })
      results.push({
        success: true,
        message: `${defender.name} desmaiou!`,
        fainted: true,
      })
      
      // Verifica se há Pokémon vivos
      const hasAlivePokemon = defenderTeam.pokemon.some(p => p.isAlive)
      
      if (!hasAlivePokemon) {
        // Batalha terminou
        battle.status = 'finished'
        battle.winnerId = attackerTeam.trainerId
        battle.log.push({
          timestamp: Date.now(),
          message: `${attackerTeam.trainerName} venceu a batalha!`,
          type: 'win',
        })
      } else {
        // Troca automática para o próximo Pokémon vivo
        const nextAlive = defenderTeam.pokemon.findIndex(p => p.isAlive)
        if (nextAlive !== -1) {
          defenderTeam.activePokemonIndex = nextAlive
          battle.log.push({
            timestamp: Date.now(),
            message: `${defenderTeam.trainerName} mandou ${defenderTeam.pokemon[nextAlive].name}!`,
            type: 'switch',
          })
        }
      }
    }
  }
  
  return results
}

/**
 * CPU escolhe uma ação
 */
function getCpuAction(battle: BattleState): BattleAction {
  const cpuTeam = battle.team2
  const cpuPokemon = cpuTeam.pokemon[cpuTeam.activePokemonIndex]
  
  // Se o Pokémon atual morreu, troca
  if (!cpuPokemon.isAlive) {
    const nextAlive = cpuTeam.pokemon.findIndex(p => p.isAlive)
    if (nextAlive !== -1) {
      return {
        type: 'switch',
        trainerId: 'cpu',
        switchToIndex: nextAlive,
      }
    }
  }
  
  // Estratégia simples: escolhe um movimento aleatório com PP
  const availableMoves = cpuPokemon.moves
    .map((move, index) => ({ move, index }))
    .filter(({ move }) => move.pp > 0)
  
  if (availableMoves.length === 0) {
    return {
      type: 'move',
      trainerId: 'cpu',
      moveIndex: 0,
    }
  }
  
  const chosen = availableMoves[Math.floor(Math.random() * availableMoves.length)]
  
  return {
    type: 'move',
    trainerId: 'cpu',
    moveIndex: chosen.index,
  }
}

// POST /api/battle/turn
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { battleId, action, questionAnswer, questionId } = body
    
    if (!battleId || !action) {
      return NextResponse.json(
        { error: 'battleId e action são obrigatórios' },
        { status: 400 }
      )
    }
    
    const battle = getBattle(battleId)
    
    if (!battle) {
      return NextResponse.json(
        { error: 'Batalha não encontrada' },
        { status: 404 }
      )
    }
    
    if (battle.status !== 'active') {
      return NextResponse.json(
        { error: 'Batalha não está ativa' },
        { status: 400 }
      )
    }

    // Se o jogador está atacando e não há pergunta pendente, cria uma
    if (action.type === 'move' && !battle.waitingForAnswer && questionAnswer === undefined) {
      const question = getRandomQuestion()
      battle.currentQuestion = question
      battle.waitingForAnswer = true
      battle.questionStartTime = Date.now()
      
      saveBattle(battle)
      
      return NextResponse.json({
        success: true,
        needsAnswer: true,
        question,
        battle: {
          ...battle,
          currentTurnActions: Array.from(battle.currentTurnActions.entries()),
        },
      })
    }
    
    const results = executeTurn(battle, action, questionAnswer, questionId)
    
    // Salva a batalha atualizada
    saveBattle(battle)
    
    return NextResponse.json({
      success: true,
      battle: {
        ...battle,
        currentTurnActions: Array.from(battle.currentTurnActions.entries()),
      },
      turnResults: results,
    })
  } catch (error) {
    console.error('Erro ao executar turno:', error)
    return NextResponse.json(
      { error: 'Erro ao executar turno' },
      { status: 500 }
    )
  }
}

