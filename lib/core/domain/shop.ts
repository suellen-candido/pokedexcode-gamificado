export type ShopCurrency = 'pokeballs' | 'pokedollars' | 'berries';
export type ShopCategory = 'pokeballs' | 'potions' | 'items' | 'accessories' | 'evolution';
export type ShopRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: ShopCurrency;
  category: ShopCategory;
  rarity: ShopRarity;
  icon: string;
  effects: string[];
}

export const shopItemsData: ShopItem[] = [
  {
    id: '1',
    name: 'Pokéball Ultra Premium',
    description:
      'Pokéball aprimorada para capturar Pokémons raros com maior taxa de sucesso',
    price: 150,
    currency: 'pokedollars',
    category: 'pokeballs',
    rarity: 'epic',
    icon: '🔴',
    effects: [
      'Taxa de captura 50% maior',
      'Reduz chance de fuga',
    ],
  },
  {
    id: '2',
    name: 'Roupa do Treinador Personalizada',
    description: 'Uniforme exclusivo com as cores do seu time Pokémon',
    price: 8,
    currency: 'pokedollars',
    category: 'items',
    rarity: 'rare',
    icon: '👕',
    effects: ['Avatar personalizado', '+10% XP em atividades do time'],
  },
  {
    id: '3',
    name: 'Dex Messenger Premium',
    description: 'Notificações prioritárias de feedback no seu Pokédex digital',
    price: 100,
    currency: 'pokedollars',
    category: 'items',
    rarity: 'uncommon',
    icon: '📱',
    effects: ['Notificações prioritárias', 'Feedback mais rápido'],
  },
  {
    id: '4',
    name: 'Poção Temporal',
    description: 'Refaça um desafio mantendo a melhor pontuação',
    price: 150,
    currency: 'pokedollars',
    category: 'potions',
    rarity: 'legendary',
    icon: '⚗️',
    effects: ['Refazer desafio sem perder progresso', 'Manter melhor pontuação'],
  },
  {
    id: '5',
    name: 'Estratégia de Treinador Premium',
    description: 'Veja estratégias de outros treinadores após completar desafios',
    price: 120,
    currency: 'pokedollars',
    category: 'items',
    rarity: 'rare',
    icon: '📋',
    effects: [
      'Ver estratégias após completar',
      'Comparar diferentes abordagens',
    ],
  },
  {
    id: '6',
    name: 'Caderno de Código Inteligente',
    description: 'Organize seus snippets de código favoritos com inteligência artificial',
    price: 50,
    currency: 'pokedollars',
    category: 'accessories',
    rarity: 'common',
    icon: '📔',
    effects: ['Biblioteca pessoal de snippets', 'Organização por tags inteligentes'],
  },
  {
    id: '7',
    name: 'Poção da Sorte Dourada',
    description: 'Ganhe XP dobrado por 1 hora de treinamento',
    price: 200,
    currency: 'pokedollars',
    category: 'potions',
    rarity: 'epic',
    icon: '✨',
    effects: ['XP x2 por 1 hora', 'Efeito visual dourado'],
  },
  {
    id: '8',
    name: 'Dex Premium - Conteúdo Avançado',
    description: 'Acesso a tutoriais exclusivos e conteúdo avançado do Pokédex',
    price: 250,
    currency: 'pokedollars',
    category: 'items',
    rarity: 'legendary',
    icon: '📖',
    effects: [
      'Tutoriais exclusivos',
      'Conteúdo avançado de programação',
      'Certificados especiais',
    ],
  },
];

export const getShopRarityColor = (rarity: ShopRarity): string => {
  switch (rarity) {
    case 'common': return 'bg-gray-500';
    case 'uncommon': return 'bg-green-500';
    case 'rare': return 'bg-blue-500';
    case 'epic': return 'bg-purple-500';
    case 'legendary': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

export const getShopRarityText = (rarity: ShopRarity): string => {
  switch (rarity) {
    case 'common': return 'Comum';
    case 'uncommon': return 'Incomum';
    case 'rare': return 'Raro';
    case 'epic': return 'Épico';
    case 'legendary': return 'Lendário';
    default: return 'Comum';
  }
};

export const getShopCurrencyIcon = (currency: ShopCurrency): string => {
  switch (currency) {
    case 'galleons': return '🥇';
    case 'sickles': return '🥈';
    case 'knuts': return '🥉';
    default: return '🪙';
  }
};

export const getShopCurrencyName = (currency: ShopCurrency): string => {
  switch (currency) {
    case 'pokeballs': return 'Pokébolas';
    case 'pokedollars': return 'Pokédólares';
    case 'berries': return 'Bagas';
    default: return 'Moedas';
  }
};

export const shopCategories: ShopCategory[] = ['pokeballs', 'potions', 'items', 'accessories', 'evolution'];
