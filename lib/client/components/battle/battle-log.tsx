'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { BattleLogEntry } from '@/lib/core/types/battle.type'

interface BattleLogProps {
  log: BattleLogEntry[]
}

export function BattleLog({ log }: BattleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [log])

  const getLogColor = (type: BattleLogEntry['type']) => {
    switch (type) {
      case 'damage': return 'text-red-600'
      case 'status': return 'text-purple-600'
      case 'switch': return 'text-blue-600'
      case 'faint': return 'text-gray-600 font-bold'
      case 'win': return 'text-green-600 font-bold text-lg'
      default: return 'text-gray-800'
    }
  }

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm rounded-lg border-4 border-gray-800 p-4 h-48 overflow-hidden">
      <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">
        Log de Batalha
      </h3>
      
      <div 
        ref={scrollRef}
        className="h-32 overflow-y-auto pr-2 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {log.map((entry, index) => (
            <motion.div
              key={`${entry.timestamp}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-sm py-1 ${getLogColor(entry.type)}`}
            >
              {entry.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
