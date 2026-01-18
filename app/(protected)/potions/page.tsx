'use client';

import { Coins, Sparkles, Star, Trophy, FlaskConical, Swords, Target, Zap } from 'lucide-react';

import {
  useAuthState,
  useAuthActions,
} from '@/lib/client/contexts/auth-context';
import { useClassStore } from '@/lib/client/store/class-store';

import { LoadingScreen } from '@/lib/client/components/loading-screen';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/lib/client/components/ui/card';
import { AuthenticatedLayout } from '@/lib/client/components/layout/AuthenticatedLayout';
import { Header } from '@/lib/client/components/great-hall/header';
import { Button } from '@/lib/client/components/ui/button';
import { Badge } from '@/lib/client/components/ui/badge';

function PotionsPageContent() {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const { classInfo } = useClassStore();

  if (!user || !classInfo) {
    return <LoadingScreen message='Aguardando dados...' />;
  }

  // Desafios de batalha - você pode substituir por dados reais
  const battles = [
    {
      id: 1,
      title: "Duelo de Iniciantes",
      description: "Enfrente desafios básicos de programação",
      difficulty: "Fácil",
      rewards: { xp: 50, coins: 25 },
      icon: "⚔️",
      level: 1,
    },
    {
      id: 2,
      title: "Arena de Lógica",
      description: "Resolva problemas de lógica de programação",
      difficulty: "Médio",
      rewards: { xp: 100, coins: 50 },
      icon: "🎯",
      level: 3,
    },
    {
      id: 3,
      title: "Torneio de Algoritmos",
      description: "Domine algoritmos complexos",
      difficulty: "Difícil",
      rewards: { xp: 200, coins: 100 },
      icon: "🏆",
      level: 5,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "Médio":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "Difícil":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-card to-background'>
      <Header
        title='Desafios de Programação'
        subtitle='Batalhe e conquiste recompensas'
        icon={FlaskConical}
        showBackButton={true}
        backButtonHref='/great-hall'
        showCurrency='galleons'
        user={user}
        classInfo={classInfo}
        onLogout={logout}
      />

      <div className='container mx-auto px-4 py-8'>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Swords className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batalhas Disponíveis</p>
                  <p className="text-2xl font-bold">{battles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vitórias</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className='magical-border card-hover border-accent/20 bg-card/60 backdrop-blur-sm mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <Sparkles className='w-6 h-6 text-accent animate-sparkle' />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
              <div className='space-y-2'>
                <div className='w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center ring-2 ring-green-500/30'>
                  <Trophy className='w-6 h-6 text-green-500' />
                </div>
                <h4 className='font-semibold'>Sistema de Combos</h4>
                <p className='text-xs text-muted-foreground'>
                  Acerte em sequência para bônus de XP! <br />
                  3+ = +20% | 5+ = +30% | 10+ = +50%
                </p>
              </div>
              <div className='space-y-2'>
                <div className='w-12 h-12 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center ring-2 ring-blue-500/30'>
                  <Star className='w-6 h-6 text-blue-500' />
                </div>
                <h4 className='font-semibold'>Bônus de Performance</h4>
                <p className='text-xs text-muted-foreground'>
                  Notas altas rendem XP extra! <br />
                  100% = +50% | 90%+ = +25% | 80%+ = +10%
                </p>
              </div>
              <div className='space-y-2'>
                <div className='w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center ring-2 ring-yellow-500/30'>
                  <Coins className='w-6 h-6 text-yellow-500' />
                </div>
                <h4 className='font-semibold'>Recompensas</h4>
                <p className='text-xs text-muted-foreground'>
                  Complete na 1ª vez (≥70%) para ganhar XP e Pokédólares.
                  <br /> Bônus por combo e performance!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Battles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {battles.map((battle) => (
            <Card
              key={battle.id}
              className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
            >
              <CardHeader>
                <div className="text-center">
                  <div className="text-5xl mb-3">{battle.icon}</div>
                  <CardTitle className="group-hover:text-primary transition-colors mb-2">
                    {battle.title}
                  </CardTitle>
                  <CardDescription>
                    {battle.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className={getDifficultyColor(battle.difficulty)}>
                    {battle.difficulty}
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30">
                    Level {battle.level}+
                  </Badge>
                </div>

                <div className="flex justify-around py-3 border-y">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold">
                      <Star className="w-4 h-4" />
                      {battle.rewards.xp}
                    </div>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-600 font-bold">
                      <Coins className="w-4 h-4" />
                      {battle.rewards.coins}
                    </div>
                    <p className="text-xs text-muted-foreground">Pokédólares</p>
                  </div>
                </div>

                <Button className="w-full group-hover:shadow-lg transition-all">
                  <Zap className="w-4 h-4 mr-2" />
                  Iniciar Batalha
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="mt-8 border-dashed">
          <CardContent className="p-8 text-center">
            <Swords className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mais Desafios em Breve</h3>
            <p className="text-muted-foreground">
              Novos desafios e torneios serão adicionados regularmente. Prepare-se para batalhar!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PotionsPageWithLayout() {
  return (
    <AuthenticatedLayout>
      <PotionsPageContent />
    </AuthenticatedLayout>
  );
}
