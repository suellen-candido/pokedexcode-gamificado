import { NextResponse } from 'next/server'
import type {
  BattleState,
} from '@/lib/core/types/battle.type'
import { generateRandomTeam } from '@/lib/core/utils/battle-generator'
import { saveBattle, getBattle } from '@/lib/core/services/battle-storage'

/**
 * Cria uma nova batalha
 */
function createBattle(mode: 'random' | 'custom', trainerId: string): BattleState {
  const battleId = `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const team1Pokemon = generateRandomTeam(50)
  const team2Pokemon = generateRandomTeam(50)
  
  const battle: BattleState = {
    id: battleId,
    status: 'active',
    turn: 1,
    team1: {
      trainerId: trainerId,
      trainerName: 'Você',
      pokemon: team1Pokemon,
      activePokemonIndex: 0,
    },
    team2: {
      trainerId: 'cpu',
      trainerName: 'Oponente',
      pokemon: team2Pokemon,
      activePokemonIndex: 0,
    },
    currentTurnActions: new Map(),
    log: [
      {
        timestamp: Date.now(),
        message: `Batalha iniciada! ${team1Pokemon[0].name} vs ${team2Pokemon[0].name}!`,
        type: 'info',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  saveBattle(battle)
  return battle
}

/**
 * Executa um turno de batalha
 */
function executeTurn(battle: BattleState, action: BattleAction): TurnResult[] {
  const results: TurnResult[] = []
  const isPlayer = action.trainerId === battle.team1.trainerId
  const attackerTeam = isPlayer ? battle.team1 : battle.team2
  const defenderTeam = isPlayer ? battle.team2 : battle.team1
  
  const attacker = attackerTeam.pokemon[attackerTeam.activePokemonIndex]
  const defender = defenderTeam.pokemon[defenderTeam.activePokemonIndex]
  
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
        message: `Trocou para ${newPokemon.name}!`,
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
        message: `${move.name} errou!`,
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
      isStab
    )
    
    const oldHp = defender.currentHp
    defender.currentHp = Math.max(0, defender.currentHp - damage)
    
    // Log de ataque
    let message = `${attacker.name} usou ${move.name}!`
    if (critical) message += ' Acerto crítico!'
    if (effectiveness !== 1) message += ` ${getEffectivenessMessage(effectiveness)}`
    
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
      
      // Troca automática para o próximo Pokémon vivo
      const nextAlive = defenderTeam.pokemon.findIndex((p, i) => i > defenderTeam.activePokemonIndex && p.isAlive)
      if (nextAlive !== -1) {
        defenderTeam.activePokemonIndex = nextAlive
        battle.log.push({
          timestamp: Date.now(),
          message: `${defenderTeam.trainerName} mandou ${defenderTeam.pokemon[nextAlive].name}!`,
          type: 'switch',
        })
      } else {
        // Batalha terminou
        battle.status = 'finished'
        battle.winnerId = attackerTeam.trainerId
        battle.log.push({
          timestamp: Date.now(),
          message: `${attackerTeam.trainerName} venceu a batalha!`,
          type: 'win',
        })
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

// POST /api/battle/create
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mode, trainerId } = body
    
    if (!trainerId) {
      return NextResponse.json(
        { error: 'trainerId é obrigatório' },
        { status: 400 }
      )
    }
    
    const battle = createBattle(mode || 'random', trainerId)
    
    return NextResponse.json({
      success: true,
      battleId: battle.id,
      battle: {
        ...battle,
        currentTurnActions: Array.from(battle.currentTurnActions.entries()),
      },
    })
  } catch (error) {
    console.error('Erro ao criar batalha:', error)
    return NextResponse.json(
      { error: 'Erro ao criar batalha' },
      { status: 500 }
    )
  }
}

// GET /api/battle/create?battleId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const battleId = searchParams.get('battleId')
    
    if (!battleId) {
      return NextResponse.json(
        { error: 'battleId é obrigatório' },
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
    
    return NextResponse.json({
      success: true,
      battle: {
        ...battle,
        currentTurnActions: Array.from(battle.currentTurnActions.entries()),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar batalha:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar batalha' },
      { status: 500 }
    )
  }
}
