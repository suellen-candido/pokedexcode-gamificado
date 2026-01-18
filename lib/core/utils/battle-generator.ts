import type { BattlePokemon, PokemonMove, PokemonType } from '../types/battle.type'

// Pool de Pokémon disponíveis (Gen 1-2 populares)
const pokemonPool = [
  { id: '25', name: 'Pikachu', types: ['electric' as PokemonType] },
  { id: '6', name: 'Charizard', types: ['fire' as PokemonType, 'flying' as PokemonType] },
  { id: '9', name: 'Blastoise', types: ['water' as PokemonType] },
  { id: '3', name: 'Venusaur', types: ['grass' as PokemonType, 'poison' as PokemonType] },
  { id: '94', name: 'Gengar', types: ['ghost' as PokemonType, 'poison' as PokemonType] },
  { id: '65', name: 'Alakazam', types: ['psychic' as PokemonType] },
  { id: '143', name: 'Snorlax', types: ['normal' as PokemonType] },
  { id: '131', name: 'Lapras', types: ['water' as PokemonType, 'ice' as PokemonType] },
  { id: '149', name: 'Dragonite', types: ['dragon' as PokemonType, 'flying' as PokemonType] },
  { id: '248', name: 'Tyranitar', types: ['rock' as PokemonType, 'dark' as PokemonType] },
  { id: '68', name: 'Machamp', types: ['fighting' as PokemonType] },
  { id: '130', name: 'Gyarados', types: ['water' as PokemonType, 'flying' as PokemonType] },
  { id: '38', name: 'Ninetales', types: ['fire' as PokemonType] },
  { id: '91', name: 'Cloyster', types: ['water' as PokemonType, 'ice' as PokemonType] },
  { id: '103', name: 'Exeggutor', types: ['grass' as PokemonType, 'psychic' as PokemonType] },
  { id: '142', name: 'Aerodactyl', types: ['rock' as PokemonType, 'flying' as PokemonType] },
  { id: '12', name: 'Butterfree', types: ['bug' as PokemonType, 'flying' as PokemonType] },
  { id: '34', name: 'Nidoking', types: ['poison' as PokemonType, 'ground' as PokemonType] },
  { id: '71', name: 'Victreebel', types: ['grass' as PokemonType, 'poison' as PokemonType] },
  { id: '80', name: 'Slowbro', types: ['water' as PokemonType, 'psychic' as PokemonType] },
]

// Pool de movimentos por tipo
const movesPool: Record<PokemonType, PokemonMove[]> = {
  normal: [
    { id: 'tackle', name: 'Tackle', type: 'normal', category: 'physical', power: 40, accuracy: 100, pp: 35, maxPp: 35, priority: 0 },
    { id: 'hyper-beam', name: 'Hyper Beam', type: 'normal', category: 'special', power: 150, accuracy: 90, pp: 5, maxPp: 5, priority: 0 },
  ],
  fire: [
    { id: 'flamethrower', name: 'Flamethrower', type: 'fire', category: 'special', power: 90, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
    { id: 'fire-blast', name: 'Fire Blast', type: 'fire', category: 'special', power: 110, accuracy: 85, pp: 5, maxPp: 5, priority: 0 },
  ],
  water: [
    { id: 'surf', name: 'Surf', type: 'water', category: 'special', power: 90, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
    { id: 'hydro-pump', name: 'Hydro Pump', type: 'water', category: 'special', power: 110, accuracy: 80, pp: 5, maxPp: 5, priority: 0 },
  ],
  electric: [
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'electric', category: 'special', power: 90, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
    { id: 'thunder', name: 'Thunder', type: 'electric', category: 'special', power: 110, accuracy: 70, pp: 10, maxPp: 10, priority: 0 },
  ],
  grass: [
    { id: 'solar-beam', name: 'Solar Beam', type: 'grass', category: 'special', power: 120, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
    { id: 'giga-drain', name: 'Giga Drain', type: 'grass', category: 'special', power: 75, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
  ],
  ice: [
    { id: 'ice-beam', name: 'Ice Beam', type: 'ice', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
    { id: 'blizzard', name: 'Blizzard', type: 'ice', category: 'special', power: 110, accuracy: 70, pp: 5, maxPp: 5, priority: 0 },
  ],
  fighting: [
    { id: 'close-combat', name: 'Close Combat', type: 'fighting', category: 'physical', power: 120, accuracy: 100, pp: 5, maxPp: 5, priority: 0 },
    { id: 'brick-break', name: 'Brick Break', type: 'fighting', category: 'physical', power: 75, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
  ],
  poison: [
    { id: 'sludge-bomb', name: 'Sludge Bomb', type: 'poison', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
    { id: 'poison-jab', name: 'Poison Jab', type: 'poison', category: 'physical', power: 80, accuracy: 100, pp: 20, maxPp: 20, priority: 0 },
  ],
  ground: [
    { id: 'earthquake', name: 'Earthquake', type: 'ground', category: 'physical', power: 100, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
    { id: 'earth-power', name: 'Earth Power', type: 'ground', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
  ],
  flying: [
    { id: 'air-slash', name: 'Air Slash', type: 'flying', category: 'special', power: 75, accuracy: 95, pp: 15, maxPp: 15, priority: 0 },
    { id: 'brave-bird', name: 'Brave Bird', type: 'flying', category: 'physical', power: 120, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
  ],
  psychic: [
    { id: 'psychic', name: 'Psychic', type: 'psychic', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
    { id: 'psyshock', name: 'Psyshock', type: 'psychic', category: 'special', power: 80, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
  ],
  bug: [
    { id: 'bug-buzz', name: 'Bug Buzz', type: 'bug', category: 'special', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
    { id: 'x-scissor', name: 'X-Scissor', type: 'bug', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
  ],
  rock: [
    { id: 'stone-edge', name: 'Stone Edge', type: 'rock', category: 'physical', power: 100, accuracy: 80, pp: 5, maxPp: 5, priority: 0 },
    { id: 'rock-slide', name: 'Rock Slide', type: 'rock', category: 'physical', power: 75, accuracy: 90, pp: 10, maxPp: 10, priority: 0 },
  ],
  ghost: [
    { id: 'shadow-ball', name: 'Shadow Ball', type: 'ghost', category: 'special', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
    { id: 'phantom-force', name: 'Phantom Force', type: 'ghost', category: 'physical', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
  ],
  dragon: [
    { id: 'dragon-claw', name: 'Dragon Claw', type: 'dragon', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
    { id: 'draco-meteor', name: 'Draco Meteor', type: 'dragon', category: 'special', power: 130, accuracy: 90, pp: 5, maxPp: 5, priority: 0 },
  ],
  dark: [
    { id: 'dark-pulse', name: 'Dark Pulse', type: 'dark', category: 'special', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
    { id: 'crunch', name: 'Crunch', type: 'dark', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
  ],
  steel: [
    { id: 'flash-cannon', name: 'Flash Cannon', type: 'steel', category: 'special', power: 80, accuracy: 100, pp: 10, maxPp: 10, priority: 0 },
    { id: 'iron-head', name: 'Iron Head', type: 'steel', category: 'physical', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
  ],
  fairy: [
    { id: 'moonblast', name: 'Moonblast', type: 'fairy', category: 'special', power: 95, accuracy: 100, pp: 15, maxPp: 15, priority: 0 },
    { id: 'play-rough', name: 'Play Rough', type: 'fairy', category: 'physical', power: 90, accuracy: 90, pp: 10, maxPp: 10, priority: 0 },
  ],
}

/**
 * Gera stats aleatórios para um Pokémon no nível especificado
 */
function generateStats(level: number): { hp: number; attack: number; defense: number; specialAttack: number; specialDefense: number; speed: number } {
  const baseHp = 200 + Math.floor(Math.random() * 100)
  const baseAttack = 80 + Math.floor(Math.random() * 70)
  const baseDefense = 70 + Math.floor(Math.random() * 60)
  const baseSpAtk = 80 + Math.floor(Math.random() * 70)
  const baseSpDef = 70 + Math.floor(Math.random() * 60)
  const baseSpeed = 60 + Math.floor(Math.random() * 80)
  
  return {
    hp: Math.floor((baseHp * level) / 50),
    attack: Math.floor((baseAttack * level) / 50),
    defense: Math.floor((baseDefense * level) / 50),
    specialAttack: Math.floor((baseSpAtk * level) / 50),
    specialDefense: Math.floor((baseSpDef * level) / 50),
    speed: Math.floor((baseSpeed * level) / 50),
  }
}

/**
 * Seleciona movimentos aleatórios baseados nos tipos do Pokémon
 */
function selectMoves(types: PokemonType[]): PokemonMove[] {
  const moves: PokemonMove[] = []
  
  // Adiciona 2 movimentos do tipo principal
  const primaryTypeMoves = movesPool[types[0]] || []
  for (let i = 0; i < Math.min(2, primaryTypeMoves.length); i++) {
    moves.push({ ...primaryTypeMoves[i] })
  }
  
  // Adiciona 1 movimento do tipo secundário (se houver)
  if (types[1]) {
    const secondaryTypeMoves = movesPool[types[1]] || []
    if (secondaryTypeMoves.length > 0) {
      moves.push({ ...secondaryTypeMoves[0] })
    }
  }
  
  // Completa com movimentos normais até ter 4
  while (moves.length < 4) {
    const normalMoves = movesPool.normal
    moves.push({ ...normalMoves[moves.length % normalMoves.length] })
  }
  
  return moves.slice(0, 4)
}

/**
 * Gera um Pokémon aleatório
 */
export function generateRandomPokemon(level: number = 50): BattlePokemon {
  const template = pokemonPool[Math.floor(Math.random() * pokemonPool.length)]
  const stats = generateStats(level)
  const moves = selectMoves(template.types)
  
  return {
    id: `${template.id}-${Date.now()}-${Math.random()}`,
    name: template.name,
    species: template.name,
    level,
    types: template.types,
    stats: {
      ...stats,
      maxHp: stats.hp,
    },
    moves,
    currentHp: stats.hp,
    status: 'none',
    isAlive: true,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${template.id}.png`,
    shiny: Math.random() < 0.01, // 1% chance de shiny
  }
}

/**
 * Gera um time aleatório de 6 Pokémon
 */
export function generateRandomTeam(level: number = 50): BattlePokemon[] {
  const team: BattlePokemon[] = []
  const usedSpecies = new Set<string>()
  
  while (team.length < 6) {
    const pokemon = generateRandomPokemon(level)
    
    // Evita Pokémon duplicados
    if (!usedSpecies.has(pokemon.species)) {
      team.push(pokemon)
      usedSpecies.add(pokemon.species)
    }
  }
  
  return team
}
