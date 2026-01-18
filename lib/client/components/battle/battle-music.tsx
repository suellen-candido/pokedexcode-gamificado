'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/lib/client/components/ui/button'

interface BattleMusicProps {
  musicUrl: string
  autoPlay?: boolean
  showControls?: boolean
}

export function BattleMusic({ 
  musicUrl, 
  autoPlay = true,
  showControls = true 
}: BattleMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (autoPlay && !audioRef.current) {
      audioRef.current = new Audio(musicUrl)
      audioRef.current.loop = true
      audioRef.current.volume = volume
      
      // Tenta tocar automaticamente
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.log('Autoplay bloqueado:', error)
            // Não mostra alerta, apenas deixa o usuário clicar manualmente
          })
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [autoPlay, musicUrl, volume])

  const toggleMusic = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl)
      audioRef.current.loop = true
      audioRef.current.volume = volume
      
      // Adiciona listener de erro
      audioRef.current.onerror = (e) => {
        console.error('Erro ao carregar áudio:', e)
        setIsPlaying(false)
      }
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // Tenta carregar o áudio primeiro
        audioRef.current.load()
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error)
      setIsPlaying(false)
    }
  }

  if (!showControls) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 rounded-lg border-2 border-gray-800 bg-white/90 backdrop-blur-sm p-2 shadow-xl">
        <Button
          className="transition-all duration-300 hover:bg-accent/20"
          onClick={toggleMusic}
          size="sm"
          variant="ghost"
        >
          {isPlaying ? (
            <Volume2 className="h-5 w-5 text-blue-600" />
          ) : (
            <VolumeX className="h-5 w-5 text-gray-400" />
          )}
        </Button>
        <input
          className="h-2 w-20 cursor-pointer appearance-none rounded-lg bg-gray-300 accent-blue-600"
          max="1"
          min="0"
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          step="0.05"
          type="range"
          value={volume}
        />
      </div>
    </div>
  )
}
