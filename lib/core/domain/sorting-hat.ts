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
        house: 'gryffindor',
        icon: '🔥',
        text: 'IA & Machine Learning - Corajoso e agressivo como Charmander',
      },
      {
        house: 'slytherin',
        icon: '💧',
        text: 'Segurança & Proteção de Dados - Defensivo como Squirtle',
      },
      {
        house: 'ravenclaw',
        icon: '🌱',
        text: 'Web Dev Full Stack - Equilibrado como Bulbasaur',
      },
      {
        house: 'hufflepuff',
        icon: '🐳',
        text: 'DevOps & Infraestrutura - Confiável e prático',
      },
    ],
  },
  {
    question: 'Qual problema você gostaria de resolver?',
    options: [
      {
        house: 'gryffindor',
        icon: '🤖',
        text: 'Criar modelos de IA que entendem linguagem natural',
      },
      {
        house: 'slytherin',
        icon: '🔐',
        text: 'Proteger dados sensíveis com criptografia avançada',
      },
      {
        house: 'ravenclaw',
        icon: '🌐',
        text: 'Construir plataformas web modernas com Django/FastAPI',
      },
      {
        house: 'hufflepuff',
        icon: '⚙️',
        text: 'Automatizar processos e melhorar a infraestrutura',
      },
    ],
  },
  {
    question: 'Quando aprende Python, você prefere:',
    options: [
      {
        house: 'gryffindor',
        icon: '⚡',
        text: 'TensorFlow, PyTorch - Direto para IA com coragem de Charmander',
      },
      {
        house: 'slytherin',
        icon: '🛡️',
        text: 'Cryptography, Sqlalchemy - Segurança meticulosa como Squirtle',
      },
      {
        house: 'ravenclaw',
        icon: '🔗',
        text: 'FastAPI, Django - Análise completa da web como Bulbasaur',
      },
      {
        house: 'hufflepuff',
        icon: '📦',
        text: 'Docker, Kubernetes, AWS - Infraestrutura sólida',
      },
    ],
  },
  {
    question: 'Qual tipo de projeto te motiva mais?',
    options: [
      {
        house: 'gryffindor',
        icon: '🚀',
        text: 'Chatbots com IA - Inovador e agressivo como Charmander',
      },
      {
        house: 'slytherin',
        icon: '🔒',
        text: 'Sistema de autenticação robusto - Protetor como Squirtle',
      },
      {
        house: 'ravenclaw',
        icon: '📊',
        text: 'Dashboard web com análise de dados - Estratégico como Bulbasaur',
      },
      {
        house: 'hufflepuff',
        icon: '🧰',
        text: 'Ferramentas CLI que ajudam outros devs - Prático e útil',
      },
    ],
  },
  {
    question: 'Como você lida com desafios técnicos?',
    options: [
      {
        house: 'gryffindor',
        icon: '⚡',
        text: 'Enfrenta de frente - Testa, falha, aprende rápido como fogo',
      },
      {
        house: 'slytherin',
        icon: '🧩',
        text: 'Analisa cuidadosamente antes de agir - Estratégico e cauteloso',
      },
      {
        house: 'ravenclaw',
        icon: '📚',
        text: 'Pesquisa documentação, padrões e melhores práticas',
      },
      {
        house: 'hufflepuff',
        icon: '👥',
        text: 'Colabora com a equipe e compartilha conhecimento',
      },
    ],
  },
  {
    question: 'Qual característica te define mais?',
    options: [
      {
        house: 'gryffindor',
        icon: '🔥',
        text: 'Apaixonado, corajoso e sempre agressivo nas metas',
      },
      {
        house: 'slytherin',
        icon: '💧',
        text: 'Cauteloso, protetor e estratégico em cada decisão',
      },
      {
        house: 'ravenclaw',
        icon: '🌱',
        text: 'Inteligente, equilibrado e adaptável como um Bulbasaur',
      },
      {
        house: 'hufflepuff',
        icon: '🤝',
        text: 'Leal, confiável e sempre pronto para ajudar',
      },
    ],
  },
];

export const calculateWinningHouse = (answers: HouseId[]): HouseId => {
  const houseScores: Record<string, number> = {
    gryffindor: 0,
    hufflepuff: 0,
    ravenclaw: 0,
    slytherin: 0,
  };

  answers.forEach((answer) => {
    houseScores[answer]++;
  });

  const [winningHouse] = Object.entries(houseScores).sort(
    ([, a], [, b]) => b - a,
  );

  return winningHouse[0] as HouseId;
};
