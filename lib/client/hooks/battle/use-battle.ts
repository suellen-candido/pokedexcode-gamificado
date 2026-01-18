'use client'

import { useState, useEffect } from 'react'
import type { BattleState, BattleAction, BattleQuestion } from '@/lib/core/types/battle.type'

export function useBattle(trainerId: string) {
  const [battle, setBattle] = useState<BattleState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<BattleQuestion | null>(null)
  const [waitingForAnswer, setWaitingForAnswer] = useState(false)
  const [pendingMoveIndex, setPendingMoveIndex] = useState<number | null>(null)

  // Criar nova batalha
  const createBattle = async (mode: 'random' | 'custom' = 'random') => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/battle/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, trainerId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar batalha')
      }
      
      setBattle(data.battle)
      setBattleLog([])
      return data.battle
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Executar turno
  const executeTurn = async (action: BattleAction, questionAnswer?: number, questionId?: string) => {
    if (!battle) {
      throw new Error('Nenhuma batalha ativa')
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/battle/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          battleId: battle.id, 
          action,
          questionAnswer,
          questionId,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar turno')
      }

      // Se precisa de resposta, mostra a pergunta
      if (data.needsAnswer && data.question) {
        setCurrentQuestion(data.question)
        setWaitingForAnswer(true)
        setBattle(data.battle)
        setLoading(false)
        return { needsAnswer: true, question: data.question }
      }
      
      // Limpa a pergunta se houve
      setCurrentQuestion(null)
      setWaitingForAnswer(false)
      setPendingMoveIndex(null)
      
      setBattle(data.battle)
      
      // Adiciona mensagens ao log
      if (data.turnResults && data.turnResults.length > 0) {
        const messages = data.turnResults
          .filter((r: any) => r.message)
          .map((r: any) => r.message)
        setBattleLog(prev => [...prev, ...messages])
      }
      
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
      throw err
    } finally {
      if (!waitingForAnswer) {
        setLoading(false)
      }
    }
  }

  // Usa movimento
  const useMove = async (moveIndex: number) => {
    const action: BattleAction = {
      type: 'move',
      trainerId,
      moveIndex,
    }
    
    // Guarda o índice do movimento pendente
    setPendingMoveIndex(moveIndex)
    
    return executeTurn(action)
  }

  // Responde a pergunta
  const answerQuestion = async (answer: number) => {
    if (!currentQuestion || !pendingMoveIndex === null) {
      throw new Error('Nenhuma pergunta ativa')
    }

    const action: BattleAction = {
      type: 'move',
      trainerId,
      moveIndex: pendingMoveIndex || 0,
    }

    return executeTurn(action, answer, currentQuestion.id)
  }

  // Troca Pokémon
  const switchPokemon = async (switchToIndex: number) => {
    const action: BattleAction = {
      type: 'switch',
      trainerId,
      switchToIndex,
    }
    return executeTurn(action)
  }

  // Desiste da batalha
  const forfeit = async () => {
    const action: BattleAction = {
      type: 'forfeit',
      trainerId,
    }
    return executeTurn(action)
  }

  return {
    battle,
    loading,
    error,
    battleLog,
    currentQuestion,
    waitingForAnswer,
    createBattle,
    useMove,
    answerQuestion,
    switchPokemon,
    forfeit,
  }
}
