// Tipos de Pokémon
export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

// Categoria de movimento
export type MoveCategory = 'physical' | 'special' | 'status'

// Status conditions
export type StatusCondition = 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | 'none'

// Interface para movimentos
export interface PokemonMove {
  id: string
  name: string
  type: PokemonType
  category: MoveCategory
  power: number
  accuracy: number
  pp: number
  maxPp: number
  priority: number
  description?: string
}

// Stats de um Pokémon
export interface PokemonStats {
  hp: number
  maxHp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

// Interface para um Pokémon em batalha
export interface BattlePokemon {
  id: string
  name: string
  species: string
  level: number
  types: PokemonType[]
  stats: PokemonStats
  moves: PokemonMove[]
  currentHp: number
  status: StatusCondition
  isAlive: boolean
  spriteUrl: string
  shiny?: boolean
}

// Time de batalha
export interface BattleTeam {
  trainerId: string
  trainerName: string
  pokemon: BattlePokemon[]
  activePokemonIndex: number
}

// Ação de batalha
export type BattleActionType = 'move' | 'switch' | 'forfeit'

export interface BattleAction {
  type: BattleActionType
  trainerId: string
  moveIndex?: number
  switchToIndex?: number
}

// Resultado de um turno
export interface TurnResult {
  success: boolean
  message: string
  damage?: number
  isCritical?: boolean
  effectiveness?: number
  oldHp?: number
  newHp?: number
  statusApplied?: StatusCondition
  fainted?: boolean
  question?: BattleQuestion
  questionResult?: QuestionResult
  difficultyMultiplier?: number
}

// Log de batalha
export interface BattleLogEntry {
  timestamp: number
  message: string
  type: 'info' | 'damage' | 'status' | 'switch' | 'faint' | 'win'
}

// Estado da batalha
export type BattleStatus = 'waiting' | 'active' | 'finished'

export interface BattleState {
  id: string
  status: BattleStatus
  turn: number
  team1: BattleTeam
  team2: BattleTeam
  currentTurnActions: Map<string, BattleAction>
  log: BattleLogEntry[]
  winnerId?: string
  createdAt: Date
  updatedAt: Date
  currentQuestion?: BattleQuestion
  waitingForAnswer?: boolean
  questionStartTime?: number
}

// Request/Response types
export interface CreateBattleRequest {
  mode: 'random' | 'custom'
  team1?: BattlePokemon[]
  team2?: BattlePokemon[]
}

export interface CreateBattleResponse {
  battleId: string
  battle: BattleState
}

export interface ExecuteTurnRequest {
  battleId: string
  trainerId: string
  action: BattleAction
}

export interface ExecuteTurnResponse {
  battle: BattleState
  turnResults: TurnResult[]
}

// Sistema de perguntas
export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface BattleQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: QuestionDifficulty
  category: string
  explanation?: string
}

export interface QuestionResult {
  correct: boolean
  damageMultiplier: number
  question: BattleQuestion
  selectedAnswer: number
  timeToAnswer?: number
}

// Modificadores de dano por dificuldade
export const DIFFICULTY_MULTIPLIERS: Record<QuestionDifficulty, number> = {
  easy: 0.8,      // -20% de dano
  medium: 1.0,    // dano normal
  hard: 1.3,      // +30% de dano
  expert: 1.6,    // +60% de dano
}

// Request com pergunta
export interface ExecuteTurnWithQuestionRequest extends ExecuteTurnRequest {
  questionAnswer?: number
  questionId?: string
}
