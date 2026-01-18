import type { BattleQuestion, QuestionDifficulty } from '../types/battle.type'
import questionsData from '@/data/content/battle-questions.json'

const questions: BattleQuestion[] = questionsData.questions as BattleQuestion[]

/**
 * Seleciona uma pergunta aleatória baseada na dificuldade
 */
export function getRandomQuestion(difficulty?: QuestionDifficulty): BattleQuestion {
  const filteredQuestions = difficulty
    ? questions.filter((q) => q.difficulty === difficulty)
    : questions

  if (filteredQuestions.length === 0) {
    // Fallback para qualquer pergunta se não encontrar da dificuldade
    return questions[Math.floor(Math.random() * questions.length)]
  }

  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
}

/**
 * Seleciona perguntas aleatórias de diferentes dificuldades
 */
export function getBalancedQuestions(count: number = 3): BattleQuestion[] {
  const difficulties: QuestionDifficulty[] = ['easy', 'medium', 'hard', 'expert']
  const selectedQuestions: BattleQuestion[] = []
  const usedIds = new Set<string>()

  // Tenta pegar uma de cada dificuldade primeiro
  for (let i = 0; i < count && i < difficulties.length; i++) {
    const question = getRandomQuestion(difficulties[i])
    if (!usedIds.has(question.id)) {
      selectedQuestions.push(question)
      usedIds.add(question.id)
    }
  }

  // Completa com perguntas aleatórias se necessário
  while (selectedQuestions.length < count) {
    const question = getRandomQuestion()
    if (!usedIds.has(question.id)) {
      selectedQuestions.push(question)
      usedIds.add(question.id)
    }
  }

  return selectedQuestions
}

/**
 * Verifica se a resposta está correta
 */
export function checkAnswer(question: BattleQuestion, answer: number): boolean {
  return question.correctAnswer === answer
}

/**
 * Pega uma pergunta por ID
 */
export function getQuestionById(id: string): BattleQuestion | undefined {
  return questions.find((q) => q.id === id)
}

/**
 * Retorna todas as perguntas disponíveis
 */
export function getAllQuestions(): BattleQuestion[] {
  return [...questions]
}

/**
 * Retorna perguntas por categoria
 */
export function getQuestionsByCategory(category: string): BattleQuestion[] {
  return questions.filter((q) => q.category === category)
}

/**
 * Retorna perguntas por dificuldade
 */
export function getQuestionsByDifficulty(difficulty: QuestionDifficulty): BattleQuestion[] {
  return questions.filter((q) => q.difficulty === difficulty)
}
