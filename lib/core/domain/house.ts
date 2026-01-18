export type HouseId = 'fogo' | 'planta' | 'agua';

export interface House {
  id: HouseId;
  name: string;
  icon: string;
  founder: string;
  mascot: string;
  head: string;
  ghost: string;
  commonRoom: string;
  description: string;
  specialty: string;
  traits: string[];
  colors: string[];
  tailwindGradient: string;
}

export const housesData: Record<HouseId, Omit<House, 'id'>> = {
  fogo: {
    name: 'Treinador de Fogo',
    icon: '🔥',
    founder: 'Charmander',
    mascot: 'Charmander',
    head: 'Mestre Blaine',
    ghost: 'Espírito do Dragão Flamejante',
    commonRoom: 'Caverna do Fogo',
    description: 'Time dos treinadores corajosos, ousados e apaixonados por IA. Especialistas em Machine Learning e Deep Learning.',
    specialty: 'IA & Machine Learning',
    traits: ['Coragem', 'Paixão', 'Inovação', 'Agressividade'],
    colors: ['#FF6B35', '#FFA500'],
    tailwindGradient: 'from-orange-500 to-red-600',
  },
  planta: {
    name: 'Treinador de Planta',
    icon: '🌱',
    founder: 'Bulbasaur',
    mascot: 'Bulbasaur',
    head: 'Mestre Erika',
    ghost: 'Espírito da Natureza Sábia',
    commonRoom: 'Jardim da Sabedoria',
    description: 'Time dos treinadores inteligentes, equilibrados e analíticos. Especialistas em desenvolvimento web e análise de dados.',
    specialty: 'Web Development & Data Science',
    traits: ['Inteligência', 'Equilíbrio', 'Sabedoria', 'Análise'],
    colors: ['#4CAF50', '#66BB6A'],
    tailwindGradient: 'from-green-500 to-green-700',
  },

  agua: {
    name: 'Treinador de Água',
    icon: '💧',
    founder: 'Squirtle',
    mascot: 'Squirtle',
    head: 'Mestre Misty',
    ghost: 'Espírito das Águas Profundas',
    commonRoom: 'Fortaleza Aquática',
    description: 'Time dos treinadores estratégicos, defensivos e engenhosos. Especialistas em segurança e proteção de dados.',
    specialty: 'Segurança & Proteção de Dados',
    traits: ['Estratégia', 'Defesa', 'Astúcia', 'Proteção'],
    colors: ['#2196F3', '#1976D2'],
    tailwindGradient: 'from-blue-500 to-blue-700',
  },
};
