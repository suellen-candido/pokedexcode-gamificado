'use client';

import {
  User as UserIcon,
  Mail,
  BarChart3,
  TrendingUp,
  Star,
  Coins,
  Gem,
  Languages,
  Cog,
  Bell,
  Zap,
  Trophy,
} from 'lucide-react';

import {
  useAuthState,
  useAuthActions,
} from '@/lib/client/contexts/auth-context';
import { useClassStore } from '@/lib/client/store/class-store';
import { housesData } from '@/lib/core/domain/house';
import { getHouseDefaultImage } from '@/lib/core/utils/house-images';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/lib/client/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/client/components/ui/card';
import { Badge } from '@/lib/client/components/ui/badge';
import { Separator } from '@/lib/client/components/ui/separator';

import { cn } from '@/lib/core/utils/utils';
import { AuthenticatedLayout } from '@/lib/client/components/layout/AuthenticatedLayout';
import { LoadingScreen } from '@/lib/client/components/loading-screen';
import { Header } from '@/lib/client/components/great-hall/header';

function ProfilePageContent() {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const { classInfo } = useClassStore();

  if (!user || !classInfo) {
    console.error('ProfilePageContent renderizado sem user ou classInfo!');
    return <LoadingScreen message='Aguardando dados...' />;
  }

  const houseInfo = user.house
    ? housesData[user.house as keyof typeof housesData]
    : null;
  const userProgressInClass = classInfo.users?.[user.id]?.progress;

  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return (
      name
        .split(' ')
        .map((n) => n?.[0] ?? '')
        .join('')
        .toUpperCase() || '?'
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-card to-background'>
      <Header
        title='Meu Perfil'
        subtitle='Gerencie suas informações e progresso'
        icon={UserIcon}
        showBackButton={true}
        showCurrency='galleons'
        user={user}
        classInfo={classInfo}
        onLogout={logout}
      />

      <div className='container mx-auto px-4 py-6'>
        {/* Banner com Pokémon */}
        <div className='relative h-48 rounded-xl overflow-hidden mb-6 shadow-2xl'>
          <div className='absolute inset-0 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500'>
            <div className='absolute inset-0 backdrop-blur-sm bg-black/30'></div>
          </div>
          <div className='absolute inset-0 flex items-center justify-around opacity-60'>
            <img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/6.png' alt='Charizard' className='h-32 drop-shadow-2xl' />
            <img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/9.png' alt='Blastoise' className='h-32 drop-shadow-2xl' />
            <img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/3.png' alt='Venusaur' className='h-32 drop-shadow-2xl' />
          </div>
          <div className='absolute bottom-4 left-6 flex items-center gap-4'>
            <Avatar className='w-24 h-24 border-4 border-white shadow-2xl'>
              <AvatarImage
                src={getHouseDefaultImage(user.house)}
                alt={user.profile.name}
              />
              <AvatarFallback
                className={`${houseInfo?.tailwindGradient ?? 'bg-gray-500'} text-white text-3xl font-bold`}
              >
                {getInitials(user.profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className='text-white drop-shadow-lg'>
              <h1 className='text-3xl font-bold'>{user.profile.name}</h1>
              <p className='text-lg opacity-90 flex items-center gap-2'>
                <span>{houseInfo?.icon || '❓'}</span>
                {houseInfo?.name || user.house}
              </p>
            </div>
          </div>
        </div>

        {/* Layout em duas colunas */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Coluna da esquerda - Informações */}
          <div className='lg:col-span-1 space-y-6'>
            <Card className='magical-border border-accent/20 bg-card/70 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-xl flex items-center gap-2'>
                  <UserIcon className='w-5 h-5' /> Informações
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg'>
                    <Mail className='w-5 h-5 text-muted-foreground' />
                    <div className='flex-1'>
                      <p className='text-xs text-muted-foreground'>Email</p>
                      <p className='font-medium text-sm truncate'>{user.email}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg'>
                    <UserIcon className='w-5 h-5 text-muted-foreground' />
                    <div className='flex-1'>
                      <p className='text-xs text-muted-foreground'>Função</p>
                      <p className='font-medium text-sm capitalize'>{user.role}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg'>
                    <Languages className='w-5 h-5 text-muted-foreground' />
                    <div className='flex-1'>
                      <p className='text-xs text-muted-foreground'>Idioma</p>
                      <p className='font-medium text-sm'>
                        {user.preferences.language === 'pt-BR' ? 'Português (BR)' : 'Inglês (US)'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 p-3 bg-muted/30 rounded-lg'>
                    <Bell className='w-5 h-5 text-muted-foreground' />
                    <div className='flex-1'>
                      <p className='text-xs text-muted-foreground'>Notificações</p>
                      <Badge
                        variant={user.preferences.notifications ? 'default' : 'secondary'}
                        className={cn(
                          'text-xs mt-1',
                          user.preferences.notifications
                            ? 'bg-green-600/80 border-green-600/30 text-white'
                            : 'bg-red-600/80 border-red-600/30 text-white',
                        )}
                      >
                        {user.preferences.notifications ? 'Ativadas' : 'Desativadas'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            {userProgressInClass && (
              <Card className='magical-border border-accent/20 bg-card/70 backdrop-blur-sm'>
                <CardHeader>
                  <CardTitle className='text-xl flex items-center gap-2'>
                    <BarChart3 className='w-5 h-5' /> Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Zap className='w-5 h-5 text-primary' />
                      <span className='text-sm text-muted-foreground'>XP Total</span>
                    </div>
                    <span className='font-bold text-lg text-primary'>
                      {userProgressInClass.xp.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Star className='w-5 h-5 text-yellow-500' />
                      <span className='text-sm text-muted-foreground'>Nível</span>
                    </div>
                    <span className='font-bold text-lg'>{userProgressInClass.level}</span>
                  </div>
                  <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-5 h-5 text-green-500' />
                      <span className='text-sm text-muted-foreground'>Streak</span>
                    </div>
                    <span className='font-bold text-lg'>{userProgressInClass.streak} dias</span>
                  </div>
                  <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                    <div className='flex items-center gap-2'>
                      <Coins className='w-5 h-5 text-yellow-600' />
                      <span className='text-sm text-muted-foreground'>Pokédólares</span>
                    </div>
                    <span className='font-bold text-lg'>{userProgressInClass.currencies.galleons}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna da direita - Missões */}
          <div className='lg:col-span-2 space-y-4'>
            <h2 className='text-2xl font-bold flex items-center gap-2'>
              <Trophy className='w-6 h-6 text-primary' /> Missões
            </h2>
            
            {/* Missão 1 */}
            <Card className='magical-border border-accent/20 bg-card/70 backdrop-blur-sm hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl'>
                      🐍
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-lg mb-1'>Treinar Python: Listas</h3>
                    <p className='text-sm text-muted-foreground mb-3'>
                      Manipule os poderes das Python Listas com maestria
                    </p>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Zap className='w-4 h-4 text-green-500' />
                        <span className='text-green-500 font-semibold'>+75 XP</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2'>
                        <div className='bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full' style={{width: '60%'}}></div>
                      </div>
                      <p className='text-xs text-muted-foreground'>3 de 5 exercícios completos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Missão 2 */}
            <Card className='magical-border border-accent/20 bg-card/70 backdrop-blur-sm hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-16 h-16 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-3xl'>
                      🧪
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-lg mb-1'>Ler Bombadas Funções em Python</h3>
                    <p className='text-sm text-muted-foreground mb-3'>
                      Descubra e domine funções complexas de Python
                    </p>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Zap className='w-4 h-4 text-blue-500' />
                        <span className='text-blue-500 font-semibold'>+100 XP</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2'>
                        <div className='bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full' style={{width: '80%'}}></div>
                      </div>
                      <p className='text-xs text-muted-foreground'>4 de 5 capítulos lidos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Missão 3 */}
            <Card className='magical-border border-accent/20 bg-card/70 backdrop-blur-sm hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-3xl'>
                      ❤️
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-lg mb-1'>Conhecer uma 2 novas Pessoas</h3>
                    <p className='text-sm text-muted-foreground mb-3'>
                      Interaja com outros treinadores e faça amizades na jornada
                    </p>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Zap className='w-4 h-4 text-pink-500' />
                        <span className='text-pink-500 font-semibold'>+50 XP</span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-2'>
                        <div className='bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full' style={{width: '50%'}}></div>
                      </div>
                      <p className='text-xs text-muted-foreground'>1 de 2 conexões feitas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePageWithLayout() {
  return (
    <AuthenticatedLayout>
      <ProfilePageContent />
    </AuthenticatedLayout>
  );
}
