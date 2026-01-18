import type { PokemonType } from '../types/battle.type'

// Tabela de efetividade de tipos
const typeChart: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
}

/**
 * Calcula a efetividade de um tipo de ataque contra tipos de defesa
 */
export function getTypeEffectiveness(attackType: PokemonType, defenderTypes: PokemonType[]): number {
  let effectiveness = 1
  
  for (const defenderType of defenderTypes) {
    const multiplier = typeChart[attackType]?.[defenderType] ?? 1
    effectiveness *= multiplier
  }
  
  return effectiveness
}

/**
 * Calcula o dano de um ataque
 */
export function calculateDamage(
  attackerLevel: number,
  attackerStat: number,
  defenderStat: number,
  movePower: number,
  typeEffectiveness: number,
  isCritical: boolean = false,
  isStab: boolean = false,
  difficultyMultiplier: number = 1.0
): number {
  // Fórmula simplificada de dano Pokémon
  const level = (2 * attackerLevel) / 5 + 2
  const power = movePower
  const attack = attackerStat
  const defense = defenderStat
  
  // Cálculo base
  let damage = ((level * power * (attack / defense)) / 50) + 2
  
  // STAB (Same Type Attack Bonus)
  if (isStab) {
    damage *= 1.5
  }
  
  // Critical hit
  if (isCritical) {
    damage *= 1.5
  }
  
  // Type effectiveness
  damage *= typeEffectiveness
  
  // Multiplicador de dificuldade da pergunta
  damage *= difficultyMultiplier
  
  // Variação aleatória (0.85 - 1.0)
  const randomFactor = 0.85 + Math.random() * 0.15
  damage *= randomFactor
  
  return Math.floor(Math.max(1, damage))
}

/**
 * Verifica se um ataque é crítico
 */
export function isCriticalHit(): boolean {
  // 6.25% de chance (1/16)
  return Math.random() < 0.0625
}

/**
 * Verifica se um movimento acerta
 */
export function doesMoveHit(accuracy: number): boolean {
  return Math.random() * 100 < accuracy
}

/**
 * Retorna a mensagem de efetividade
 */
export function getEffectivenessMessage(effectiveness: number): string {
  if (effectiveness === 0) return "Não teve efeito..."
  if (effectiveness < 1) return "Não foi muito eficaz..."
  if (effectiveness > 1) return "Foi super eficaz!"
  return ""
}
