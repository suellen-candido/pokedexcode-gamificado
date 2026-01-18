'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/lib/client/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/client/components/ui/card';
import { Badge } from '@/lib/client/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/lib/client/components/ui/tabs';
import { Coins, Star, ShoppingBag, Heart, Shield, Zap, Sparkles } from 'lucide-react';
import {
  useAuthState,
  useAuthActions,
} from '@/lib/client/contexts/auth-context';
import { useClassStore } from '@/lib/client/store/class-store';
import { LoadingScreen } from '@/lib/client/components/loading-screen';
import { AuthenticatedLayout } from '@/lib/client/components/layout/AuthenticatedLayout';
import { Header } from '@/lib/client/components/great-hall/header';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'potions' | 'equipment' | 'consumables';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect: string;
  icon: string;
}

const shopItems: ShopItem[] = [
  // Poções
  {
    id: 'health-potion-small',
    name: 'Poção de Vida Pequena',
    description: 'Restaura 50 HP',
    price: 50,
    category: 'potions',
    rarity: 'common',
    effect: '+50 HP',
    icon: '🧪',
  },
  {
    id: 'health-potion-medium',
    name: 'Poção de Vida Média',
    description: 'Restaura 100 HP',
    price: 100,
    category: 'potions',
    rarity: 'rare',
    effect: '+100 HP',
    icon: '🧪',
  },
  {
    id: 'health-potion-large',
    name: 'Poção de Vida Grande',
    description: 'Restaura 200 HP',
    price: 200,
    category: 'potions',
    rarity: 'epic',
    effect: '+200 HP',
    icon: '🧪',
  },
  {
    id: 'antidote-potion',
    name: 'Antídoto',
    description: 'Cura envenenamento',
    price: 75,
    category: 'potions',
    rarity: 'rare',
    effect: 'Remove Veneno',
    icon: '💉',
  },
  {
    id: 'energy-potion',
    name: 'Poção de Energia',
    description: 'Restaura 100% de energia',
    price: 150,
    category: 'potions',
    rarity: 'epic',
    effect: '+100% Energia',
    icon: '⚡',
  },
  {
    id: 'elixir-vitality',
    name: 'Elixir da Vitalidade',
    description: 'Restaura HP e cura todos os status negativos',
    price: 500,
    category: 'potions',
    rarity: 'legendary',
    effect: 'HP Completo + Remove Status',
    icon: '✨',
  },
  
  // Equipamentos
  {
    id: 'wooden-shield',
    name: 'Escudo de Madeira',
    description: 'Aumenta defesa em 10',
    price: 200,
    category: 'equipment',
    rarity: 'common',
    effect: '+10 Defesa',
    icon: '🛡️',
  },
  {
    id: 'iron-shield',
    name: 'Escudo de Ferro',
    description: 'Aumenta defesa em 25',
    price: 400,
    category: 'equipment',
    rarity: 'rare',
    effect: '+25 Defesa',
    icon: '🛡️',
  },
  {
    id: 'magic-amulet',
    name: 'Amuleto Mágico',
    description: 'Aumenta HP máximo em 50',
    price: 350,
    category: 'equipment',
    rarity: 'rare',
    effect: '+50 HP Máximo',
    icon: '📿',
  },
  
  // Consumíveis
  {
    id: 'xp-boost-small',
    name: 'Boost de XP (30min)',
    description: 'Aumenta ganho de XP em 50% por 30 minutos',
    price: 100,
    category: 'consumables',
    rarity: 'rare',
    effect: '+50% XP (30min)',
    icon: '🌟',
  },
  {
    id: 'xp-boost-large',
    name: 'Boost de XP (1h)',
    description: 'Aumenta ganho de XP em 100% por 1 hora',
    price: 250,
    category: 'consumables',
    rarity: 'epic',
    effect: '+100% XP (1h)',
    icon: '⭐',
  },
  {
    id: 'lucky-coin',
    name: 'Moeda da Sorte',
    description: 'Aumenta taxa de drop em 25%',
    price: 300,
    category: 'consumables',
    rarity: 'epic',
    effect: '+25% Drop Rate',
    icon: '🪙',
  },
];

function ShopPageContent() {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const { classInfo } = useClassStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'potions' | 'equipment' | 'consumables'>('all');

  if (!user || !classInfo) {
    return <LoadingScreen message='Aguardando dados...' />;
  }

  const userCurrencies = useMemo(
    () => ({
      galleons: classInfo.users?.[user.id]?.progress.currencies.galleons ?? 0,
    }),
    [classInfo, user.id],
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'rare':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'epic':
        return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      case 'legendary':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'potions':
        return <Heart className="w-4 h-4" />;
      case 'equipment':
        return <Shield className="w-4 h-4" />;
      case 'consumables':
        return <Zap className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'potions':
        return 'Poções';
      case 'equipment':
        return 'Equipamentos';
      case 'consumables':
        return 'Consumíveis';
      default:
        return 'Todos';
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const canAfford = (item: ShopItem) => {
    return userCurrencies.galleons >= item.price;
  };

  const handlePurchase = (item: ShopItem) => {
    if (canAfford(item)) {
      console.log(`Comprando ${item.name} por ${item.price} Pokédólares`);
      // Aqui você implementaria a lógica real de compra
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-card to-background'>
      <Header
        title='Loja Pokédex'
        subtitle='Itens para Treinadores'
        icon={ShoppingBag}
        showBackButton={true}
        backButtonHref='/great-hall'
        showCurrency='galleons'
        user={user}
        classInfo={classInfo}
        onLogout={logout}
      />

      <div className='container mx-auto px-4 py-8'>
        {/* Currency Display */}
        <Card className="mb-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Seus Pokédólares:</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{userCurrencies.galleons}</span>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs defaultValue='all' onValueChange={(value) => setSelectedCategory(value as any)} className='space-y-6'>
          <TabsList className='grid w-full grid-cols-4 bg-card'>
            <TabsTrigger value='all'>
              <Sparkles className="w-4 h-4 mr-2" />
              Todos
            </TabsTrigger>
            <TabsTrigger value='potions'>
              <Heart className="w-4 h-4 mr-2" />
              Poções
            </TabsTrigger>
            <TabsTrigger value='equipment'>
              <Shield className="w-4 h-4 mr-2" />
              Equipamentos
            </TabsTrigger>
            <TabsTrigger value='consumables'>
              <Zap className="w-4 h-4 mr-2" />
              Consumíveis
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className='hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group'
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{item.icon}</div>
                        <div>
                          <CardTitle className="group-hover:text-primary transition-colors text-lg">
                            {item.name}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getRarityColor(item.rarity)}>
                        {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="border-primary/30">
                        {getCategoryIcon(item.category)}
                        <span className="ml-1">{getCategoryName(item.category)}</span>
                      </Badge>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-semibold text-primary">{item.effect}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-600" />
                        <span className="text-xl font-bold">{item.price}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford(item)}
                        className="group-hover:shadow-lg transition-all"
                        variant={canAfford(item) ? 'default' : 'outline'}
                      >
                        {canAfford(item) ? (
                          <>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Comprar
                          </>
                        ) : (
                          'Pokédólares Insuficientes'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Como Usar os Itens</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-1">🧪 Poções</p>
                    <p>Use durante batalhas para recuperar HP e remover status negativos</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">🛡️ Equipamentos</p>
                    <p>Equipe para aumentar seus atributos permanentemente</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">⚡ Consumíveis</p>
                    <p>Ative para ganhar bônus temporários em suas atividades</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ShopPageWithLayout() {
  return (
    <AuthenticatedLayout>
      <ShopPageContent />
    </AuthenticatedLayout>
  );
}
