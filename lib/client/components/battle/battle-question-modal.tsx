'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, Zap } from 'lucide-react'
import { Press_Start_2P } from 'next/font/google'
import type { BattleQuestion, QuestionDifficulty } from '@/lib/core/types/battle.type'
import { Button } from '@/lib/client/components/ui/button'
import { Card } from '@/lib/client/components/ui/card'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

interface BattleQuestionModalProps {
  question: BattleQuestion
  onAnswer: (answer: number) => void
  isOpen: boolean
}

const DIFFICULTY_COLORS: Record<QuestionDifficulty, string> = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-orange-500',
  expert: 'bg-red-500',
}

const DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  easy: 'Fácil (-20% dano)',
  medium: 'Médio (dano normal)',
  hard: 'Difícil (+30% dano)',
  expert: 'Expert (+60% dano)',
}

const DIFFICULTY_MULTIPLIERS_DISPLAY: Record<QuestionDifficulty, string> = {
  easy: '0.8x',
  medium: '1.0x',
  hard: '1.3x',
  expert: '1.6x',
}

export function BattleQuestionModal({
  question,
  onAnswer,
  isOpen,
}: BattleQuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    if (!isOpen) return

    setSelectedAnswer(null)
    setTimeLeft(30)

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Auto-responde incorreto se o tempo acabar
          handleAnswer(-1)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, question.id])

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answer)
    
    // Aguarda um pouco para mostrar a seleção antes de enviar
    setTimeout(() => {
      onAnswer(answer)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-3xl"
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-yellow-400 shadow-2xl p-6">
            {/* Header */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h2 className={`text-white text-lg ${pixelFont.className}`}>
                    Pergunta de Batalha!
                  </h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`} />
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-400'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Dificuldade */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${DIFFICULTY_COLORS[question.difficulty]}`}>
                  {question.difficulty.toUpperCase()}
                </span>
                <span className="text-gray-300 text-sm">
                  {DIFFICULTY_LABELS[question.difficulty]}
                </span>
                <span className="text-yellow-400 text-sm font-bold">
                  Multiplicador: {DIFFICULTY_MULTIPLIERS_DISPLAY[question.difficulty]}
                </span>
              </div>

              {/* Categoria */}
              <div className="text-gray-400 text-sm">
                Categoria: <span className="text-cyan-400 font-semibold">{question.category}</span>
              </div>
            </div>

            {/* Pergunta */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border-2 border-slate-700">
              <p className="text-white text-base leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Opções */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.correctAnswer
                const showResult = selectedAnswer !== null

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                    whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`
                      w-full p-4 rounded-lg border-2 text-left transition-all
                      ${!showResult && 'hover:border-yellow-400 hover:bg-slate-700/50'}
                      ${isSelected && !showResult && 'border-yellow-400 bg-slate-700/50'}
                      ${showResult && isSelected && isCorrect && 'border-green-500 bg-green-500/20'}
                      ${showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500/20'}
                      ${showResult && !isSelected && 'opacity-50'}
                      ${!isSelected && !showResult && 'border-slate-600 bg-slate-800/30'}
                      disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold border-2
                        ${showResult && isSelected && isCorrect && 'bg-green-500 border-green-400 text-white'}
                        ${showResult && isSelected && !isCorrect && 'bg-red-500 border-red-400 text-white'}
                        ${!showResult && isSelected && 'bg-yellow-400 border-yellow-300 text-slate-900'}
                        ${!showResult && !isSelected && 'bg-slate-700 border-slate-600 text-white'}
                        ${showResult && !isSelected && 'bg-slate-700 border-slate-600 text-white'}
                      `}>
                        {showResult && isSelected && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                        {!showResult && String.fromCharCode(65 + index)}
                        {showResult && !isSelected && String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-white flex-1">{option}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Explicação (se houver e resposta selecionada) */}
            {selectedAnswer !== null && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-blue-900/30 border-2 border-blue-500/50 rounded-lg"
              >
                <p className="text-blue-200 text-sm">
                  <strong className="text-blue-300">💡 Explicação:</strong> {question.explanation}
                </p>
              </motion.div>
            )}

            {/* Info */}
            <div className="mt-6 p-3 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
              <p className="text-yellow-200 text-xs text-center">
                ⚡ Acerte para aumentar o dano! Erre e seu ataque será enfraquecido!
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
