'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { BattlePokemon } from '@/lib/core/types/battle.type'
import { cn } from '@/lib/core/utils/utils'

interface PokemonSpriteProps {
  pokemon: BattlePokemon
  isOpponent?: boolean
  isActive?: boolean
}

export function PokemonSprite({ pokemon, isOpponent = false, isActive = true }: PokemonSpriteProps) {
  const hpPercentage = (pokemon.currentHp / pokemon.stats.maxHp) * 100
  
  const getHpColor = () => {
    if (hpPercentage > 50) return 'bg-green-500'
    if (hpPercentage > 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!isActive) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: isOpponent ? -50 : 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative",
        isOpponent ? "self-end" : "self-start"
      )}
    >
      {/* Sprite do Pokémon */}
      <div className={cn(
        "relative w-40 h-40 md:w-48 md:h-48",
        isOpponent && "transform scale-x-[-1]"
      )}>
        <Image
          src={pokemon.spriteUrl}
          alt={pokemon.name}
          fill
          className="object-contain drop-shadow-2xl pixelated"
          priority
        />
        {pokemon.shiny && (
          <div className="absolute top-0 right-0 text-2xl animate-pulse">✨</div>
        )}
      </div>

      {/* Info do Pokémon */}
      <div className={cn(
        "absolute -bottom-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border-2 border-gray-800 min-w-[200px]",
        isOpponent ? "right-0" : "left-0"
      )}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-gray-900">{pokemon.name}</span>
          <span className="text-xs text-gray-600">Lv{pokemon.level}</span>
        </div>
        
        {/* Barra de HP */}
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden border border-gray-400">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={cn("h-full", getHpColor())}
          />
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs font-medium text-gray-700">
            HP: {pokemon.currentHp}/{pokemon.stats.maxHp}
          </span>
          {pokemon.status !== 'none' && (
            <span className="text-xs px-2 py-0.5 bg-purple-500 text-white rounded uppercase">
              {pokemon.status}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
