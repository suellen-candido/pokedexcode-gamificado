'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Flame, Droplet } from 'lucide-react'
import type { PokemonMove, PokemonType } from '@/lib/core/types/battle.type'
import { Button } from '@/lib/client/components/ui/button'
import { cn } from '@/lib/core/utils/utils'

interface MoveButtonProps {
  move: PokemonMove
  onSelect: () => void
  disabled?: boolean
}

const typeIcons: Record<PokemonType, any> = {
  normal: Sparkles,
  fire: Flame,
  water: Droplet,
  electric: Zap,
  grass: Sparkles,
  ice: Sparkles,
  fighting: Sparkles,
  poison: Sparkles,
  ground: Sparkles,
  flying: Sparkles,
  psychic: Sparkles,
  bug: Sparkles,
  rock: Sparkles,
  ghost: Sparkles,
  dragon: Sparkles,
  dark: Sparkles,
  steel: Sparkles,
  fairy: Sparkles,
}

const typeColors: Record<PokemonType, string> = {
  normal: 'bg-gray-400 hover:bg-gray-500',
  fire: 'bg-orange-500 hover:bg-orange-600',
  water: 'bg-blue-500 hover:bg-blue-600',
  electric: 'bg-yellow-400 hover:bg-yellow-500',
  grass: 'bg-green-500 hover:bg-green-600',
  ice: 'bg-cyan-400 hover:bg-cyan-500',
  fighting: 'bg-red-600 hover:bg-red-700',
  poison: 'bg-purple-500 hover:bg-purple-600',
  ground: 'bg-yellow-700 hover:bg-yellow-800',
  flying: 'bg-indigo-400 hover:bg-indigo-500',
  psychic: 'bg-pink-500 hover:bg-pink-600',
  bug: 'bg-lime-500 hover:bg-lime-600',
  rock: 'bg-yellow-800 hover:bg-yellow-900',
  ghost: 'bg-purple-700 hover:bg-purple-800',
  dragon: 'bg-indigo-600 hover:bg-indigo-700',
  dark: 'bg-gray-800 hover:bg-gray-900',
  steel: 'bg-gray-500 hover:bg-gray-600',
  fairy: 'bg-pink-400 hover:bg-pink-500',
}

export function MoveButton({ move, onSelect, disabled }: MoveButtonProps) {
  const Icon = typeIcons[move.type]
  const ppPercentage = (move.pp / move.maxPp) * 100
  const isLowPP = ppPercentage < 30

  return (
    <Button
      onClick={onSelect}
      disabled={disabled || move.pp <= 0}
      className={cn(
        'relative overflow-hidden text-white font-bold text-sm md:text-base py-6 px-4 transition-all',
        typeColors[move.type],
        disabled && 'opacity-50 cursor-not-allowed',
        move.pp <= 0 && 'grayscale'
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
          <span>{move.name}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className={cn(
            "text-xs font-medium",
            isLowPP && "text-red-200"
          )}>
            PP: {move.pp}/{move.maxPp}
          </span>
          <span className="text-xs opacity-80">
            PWR: {move.power}
          </span>
        </div>
      </div>
      
      {/* Barra de PP */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${ppPercentage}%` }}
          className={cn(
            "h-full",
            isLowPP ? 'bg-red-400' : 'bg-white/50'
          )}
        />
      </div>
    </Button>
  )
}

interface MoveSelectorProps {
  moves: PokemonMove[]
  onMoveSelect: (index: number) => void
  disabled?: boolean
}

export function MoveSelector({ moves, onMoveSelect, disabled }: MoveSelectorProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="grid grid-cols-2 gap-2 md:gap-3 w-full max-w-2xl"
      >
        {moves.map((move, index) => (
          <MoveButton
            key={move.id}
            move={move}
            onSelect={() => onMoveSelect(index)}
            disabled={disabled}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
