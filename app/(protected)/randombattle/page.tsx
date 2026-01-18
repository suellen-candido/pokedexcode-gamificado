'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Press_Start_2P } from 'next/font/google'
import { useAuthState } from '@/lib/client/contexts/auth-context'
import { BattleMusic } from '@/lib/client/components/battle/battle-music'

const pixelFont = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function ShowdownPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthState()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading) return
    
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }
  }, [mounted, isLoading, isAuthenticated, user, router])

  const startRandomBattle = () => {
    console.log('Iniciando Random Battle...');
    console.log('Navegando para: /randombattle/battle?mode=random');
    // Redireciona para a página de batalha com modo aleatório
    router.push('/randombattle/battle?mode=random')
  }

  if (!mounted || isLoading) {
    return (
      <main className="min-h-screen bg-gray-200 flex flex-col">
        <div className="w-full relative h-20">
          <Image 
            src="/images/header-background.png"
            alt="Header"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div 
          className="flex-1 flex items-center justify-center"
          style={{
            backgroundImage: 'url(/images/fundo.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }}
        >
          <div className="relative w-20 h-20 animate-spin" style={{ animationDuration: '1.5s' }}>
            <div className="w-full h-full rounded-full border-4 border-accent bg-gradient-to-b from-primary to-white flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-primary"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white"></div>
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-black transform -translate-y-1/2 z-10"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-7 h-7 rounded-full border-3 border-black bg-white flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-200 flex flex-col">
      {/* Música de Fundo */}
      <BattleMusic 
        musicUrl="/music/pokemon-intro.mp3" 
        autoPlay={false}
      />
      
      {/* Header */}}
      <div className="w-full relative h-20">
        <Image 
          src="/images/header-background.png"
          alt="Header"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-between px-8">
          <Image 
            src="/icons/pokedexcodelogo.png"
            alt="PokéDex CODE"
            width={180}
            height={60}
            className="object-contain relative z-10"
          />
          
          <button
            onClick={() => router.push('/great-hall')}
            className={`py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg border border-white/30 ${pixelFont.className}`}
          >
            Voltar ao Lobby
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div 
        className="flex-1 flex px-4 py-8"
        style={{
          backgroundImage: 'url(/images/fundo.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }}
      >
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Card Principal */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border-2 border-white">
            {/* Título Principal */}
            <div className="text-center mb-8">
              <h1 className={`text-4xl font-bold text-gray-900 mb-3 ${pixelFont.className}`}>
                Random Battle
              </h1>
              <p className={`text-base text-gray-800 ${pixelFont.className}`}>
                Receba um time aleatorio e batalhe!
              </p>
            </div>

            {/* Card de Modo */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <h2 className={`text-2xl font-bold text-white ${pixelFont.className}`}>
                  Batalha Aleatoria
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                    <div>
                      <h3 className={`font-bold text-gray-900 text-sm mb-1 ${pixelFont.className}`}>Time Aleatorio</h3>
                      <p className={`text-gray-700 text-xs ${pixelFont.className}`}>
                        Receba 6 Pokemon aleatorios
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex-shrink-0 mt-1"></div>
                    <div>
                      <h3 className={`font-bold text-gray-900 text-sm mb-1 ${pixelFont.className}`}>Combate Rapido</h3>
                      <p className={`text-gray-700 text-xs ${pixelFont.className}`}>
                        Entre direto na acao
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white border-2 border-gray-400 rounded-full flex-shrink-0 mt-1"></div>
                    <div>
                      <h3 className={`font-bold text-gray-900 text-sm mb-1 ${pixelFont.className}`}>Teste suas Habilidades</h3>
                      <p className={`text-gray-700 text-xs ${pixelFont.className}`}>
                        Venca com qualquer time
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startRandomBattle}
                  className={`w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg border-2 border-white mt-6 ${pixelFont.className}`}
                >
                  Comecar Batalha
                </button>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 border-white/50">
              <h3 className={`text-base font-bold text-gray-900 mb-3 ${pixelFont.className}`}>
                Como Funciona
              </h3>
              <ul className="space-y-2">
                <li className={`flex items-start gap-2 text-gray-800 text-xs ${pixelFont.className}`}>
                  <span className="text-primary font-bold">•</span>
                  <span>Cada jogador recebe 6 Pokemon aleatorios</span>
                </li>
                <li className={`flex items-start gap-2 text-gray-800 text-xs ${pixelFont.className}`}>
                  <span className="text-primary font-bold">•</span>
                  <span>Todos os Pokemon vem com 4 movimentos</span>
                </li>
                <li className={`flex items-start gap-2 text-gray-800 text-xs ${pixelFont.className}`}>
                  <span className="text-primary font-bold">•</span>
                  <span>A batalha funciona por turnos</span>
                </li>
                <li className={`flex items-start gap-2 text-gray-800 text-xs ${pixelFont.className}`}>
                  <span className="text-primary font-bold">•</span>
                  <span>Venca derrotando todos os Pokemon adversarios!</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="w-full relative h-24">
        <Image 
          src="/images/footer-background.png"
          alt="Footer"
          fill
          className="object-cover"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-end px-8 pb-2">
          <p className="text-white text-sm font-medium relative z-10">Equipe PokeDex CODE</p>
        </div>
      </div>

    </main>
  )
}
