'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Trophy, Flag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Press_Start_2P } from 'next/font/google'
import { useAuthState } from '@/lib/client/contexts/auth-context'
import { useBattle } from '@/lib/client/hooks/battle/use-battle'
import { PokemonSprite } from '@/lib/client/components/battle/pokemon-sprite'
import { MoveSelector } from '@/lib/client/components/battle/move-selector'
import { BattleLog } from '@/lib/client/components/battle/battle-log'
import { BattleMusic } from '@/lib/client/components/battle/battle-music'
import { BattleQuestionModal } from '@/lib/client/components/battle/battle-question-modal'
import { Button } from '@/lib/client/components/ui/button'
import { LoadingScreen } from '@/lib/client/components/loading-screen'

const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function BattlePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isLoading: authLoading } = useAuthState()
  const [mounted, setMounted] = useState(false)
  const [battleStarted, setBattleStarted] = useState(false)
  const mode = searchParams.get('mode')

  const { battle, loading, error, createBattle, useMove, currentQuestion, waitingForAnswer, answerQuestion } = useBattle(user?.id || '')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || authLoading) return
    
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    // Auto-inicia a batalha
    if (!battleStarted && !battle && !loading) {
      setBattleStarted(true)
      createBattle(mode === 'random' ? 'random' : 'custom').catch(console.error)
    }
  }, [mounted, authLoading, isAuthenticated, user, battleStarted, battle, loading, mode, router, createBattle])

  const handleMoveSelect = async (moveIndex: number) => {
    try {
      const result = await useMove(moveIndex)
      // Se precisa responder pergunta, o modal já vai aparecer
      if (result?.needsAnswer) {
        console.log('Aguardando resposta da pergunta...')
      }
    } catch (err) {
      console.error('Erro ao usar movimento:', err)
    }
  }

  const handleAnswerQuestion = async (answer: number) => {
    try {
      await answerQuestion(answer)
    } catch (err) {
      console.error('Erro ao responder pergunta:', err)
    }
  }

  if (!mounted || authLoading || !battle) {
    return <LoadingScreen message="Preparando batalha..." />
  }

  if (!user) {
    return null
  }

  const playerPokemon = battle.team1.pokemon[battle.team1.activePokemonIndex]
  const opponentPokemon = battle.team2.pokemon[battle.team2.activePokemonIndex]
  const isFinished = battle.status === 'finished'
  const playerWon = isFinished && battle.winnerId === user.id

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-green-400 relative overflow-hidden">
      {/* Música de Batalha */}
      <BattleMusic 
        musicUrl="/music/pokemon-battle.mp3"
        autoPlay={false}
      />
      
      {/* Fundo de grama */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-green-600" />
      
      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm">
        <Button
          onClick={() => router.push('/randombattle')}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className={`text-white text-sm ${pixelFont.className}`}>
          Turno {battle.turn}
        </div>

        <div className="flex gap-2">
          {battle.team1.pokemon.map((p, i) => (
            <div
              key={p.id}
              className={`w-6 h-6 rounded-full ${
                p.isAlive ? 'bg-green-500' : 'bg-red-500'
              } ${i === battle.team1.activePokemonIndex ? 'ring-2 ring-white' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Campo de Batalha */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-200px)] p-4 md:p-8">
        
        {/* Pokémon Oponente */}
        <div className="w-full flex justify-end mb-8 md:mb-12">
          <PokemonSprite 
            pokemon={opponentPokemon} 
            isOpponent 
            isActive={opponentPokemon.isAlive}
          />
        </div>

        {/* Indicadores dos times */}
        <div className="flex gap-2 mb-auto">
          {battle.team2.pokemon.map((p, i) => (
            <div
              key={p.id}
              className={`w-3 h-3 rounded-full ${
                p.isAlive ? 'bg-red-500' : 'bg-gray-500'
              } ${i === battle.team2.activePokemonIndex ? 'ring-2 ring-white' : ''}`}
            />
          ))}
        </div>

        {/* Pokémon Jogador */}
        <div className="w-full flex justify-start mt-auto mb-4 md:mb-8">
          <PokemonSprite 
            pokemon={playerPokemon} 
            isActive={playerPokemon.isAlive}
          />
        </div>
      </div>

      {/* Interface de Ações */}
      <div className="relative z-20 bg-white/95 backdrop-blur-sm border-t-4 border-gray-800 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* Log de Batalha */}
          <BattleLog log={battle.log} />

          {/* Tela de Vitória/Derrota */}
          <AnimatePresence>
            {isFinished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
              >
                <div className="bg-white rounded-2xl p-8 max-w-md text-center space-y-6">
                  {playerWon ? (
                    <>
                      <Trophy className="w-20 h-20 mx-auto text-yellow-500" />
                      <h2 className={`text-3xl font-bold text-green-600 ${pixelFont.className}`}>
                        Vitória!
                      </h2>
                      <p className="text-gray-700">
                        Você venceu a batalha!
                      </p>
                    </>
                  ) : (
                    <>
                      <Flag className="w-20 h-20 mx-auto text-red-500" />
                      <h2 className={`text-3xl font-bold text-red-600 ${pixelFont.className}`}>
                        Derrota!
                      </h2>
                      <p className="text-gray-700">
                        Você foi derrotado...
                      </p>
                    </>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => createBattle('random')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Nova Batalha
                    </Button>
                    <Button
                      onClick={() => router.push('/great-hall')}
                      variant="outline"
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Seletor de Movimentos */}
          {!isFinished && (
            <div className="flex flex-col items-center gap-4">
              <MoveSelector
                moves={playerPokemon.moves}
                onMoveSelect={handleMoveSelect}
                disabled={loading || !playerPokemon.isAlive || waitingForAnswer}
              />
              
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pergunta */}
      {currentQuestion && waitingForAnswer && (
        <BattleQuestionModal
          question={currentQuestion}
          onAnswer={handleAnswerQuestion}
          isOpen={waitingForAnswer}
        />
      )}
    </main>
  )
}
