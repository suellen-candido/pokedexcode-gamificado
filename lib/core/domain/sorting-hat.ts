import type { HouseId } from './house';

export interface SortingQuestionOption {
  text: string;
  icon: string;
  house: HouseId;
}

export interface SortingQuestion {
  question: string;
  options: SortingQuestionOption[];
}

export const sortingQuestions: SortingQuestion[] = [
  {
    question: 'Qual área do desenvolvimento Python mais te chama atenção?',
    options: [
      {
        house: 'fogo',
        icon: '🔥',
        text: 'IA & Machine Learning - Corajoso e agressivo como Charmander',
      },
      {
        house: 'agua',
        icon: '💧',
        text: 'Segurança & Proteção de Dados - Defensivo como Squirtle',
      },
      {
        house: 'planta',
        icon: '🌱',
        text: 'Web Dev Full Stack - Equilibrado como Bulbasaur',
      },
    ],
  },
  {
    question: 'Qual problema você gostaria de resolver?',
    options: [
      {
        house: 'fogo',
        icon: '🤖',
        text: 'Criar modelos de IA que entendem linguagem natural',
      },
      {
        house: 'agua',
        icon: '🔐',
        text: 'Proteger dados sensíveis com criptografia avançada',
      },
      {
        house: 'planta',
        icon: '🌐',
        text: 'Construir plataformas web modernas com Django/FastAPI',
      },
    ],
  },
  {
    question: 'Quando aprende Python, você prefere:',
    options: [
      {
        house: 'fogo',
        icon: '⚡',
        text: 'TensorFlow, PyTorch - Direto para IA com coragem de Charmander',
      },
      {
        house: 'agua',
        icon: '🛡️',
        text: 'Cryptography, Sqlalchemy - Segurança meticulosa como Squirtle',
      },
      {
        house: 'planta',
        icon: '🔗',
        text: 'FastAPI, Django - Análise completa da web como Bulbasaur',
      },
    ],
  },
  {
    question: 'Qual tipo de projeto te motiva mais?',
    options: [
      {
        house: 'fogo',
        icon: '🚀',
        text: 'Chatbots com IA - Inovador e agressivo como Charmander',
      },
      {
        house: 'agua',
        icon: '🔒',
        text: 'Sistema de autenticação robusto - Protetor como Squirtle',
      },
      {
        house: 'planta',
        icon: '📊',
        text: 'Dashboard web com análise de dados - Estratégico como Bulbasaur',
      },
    ],
  },
  {
    question: 'Como você lida com desafios técnicos?',
    options: [
      {
        house: 'fogo',
        icon: '⚡',
        text: 'Enfrenta de frente - Testa, falha, aprende rápido como fogo',
      },
      {
        house: 'agua',
        icon: '🧩',
        text: 'Analisa cuidadosamente antes de agir - Estratégico e cauteloso',
      },
      {
        house: 'planta',
        icon: '📚',
        text: 'Pesquisa documentação, padrões e melhores práticas',
      },
    ],
  },
  {
    question: 'Qual característica te define mais?',
    options: [
      {
        house: 'fogo',
        icon: '🔥',
        text: 'Apaixonado, corajoso e sempre agressivo nas metas',
      },
      {
        house: 'agua',
        icon: '💧',
        text: 'Cauteloso, protetor e estratégico em cada decisão',
      },
      {
        house: 'planta',
        icon: '🌱',
        text: 'Inteligente, equilibrado e adaptável como um Bulbasaur',
      },
    ],
  },
];

export const calculateWinningHouse = (answers: HouseId[]): HouseId => {
  const houseScores: Record<string, number> = {
    fogo: 0,
    agua: 0,
    planta: 0,
  };

  answers.forEach((answer) => {
    houseScores[answer]++;
  });

  const [winningHouse] = Object.entries(houseScores).sort(
    ([, a], [, b]) => b - a,
  );

  return winningHouse[0] as HouseId;
};
