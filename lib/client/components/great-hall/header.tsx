'use client';

import {
  type LucideIcon,
  ArrowLeft,
  BookOpen,
  ShoppingBag,
  LogOut,
  User as UserIcon,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Image from 'next/image';

import { Button } from '@/lib/client/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/lib/client/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/lib/client/components/ui/popover';
import type { ClientUser } from '@/lib/core/types/user.type';
import type { EnrichedClass } from '@/lib/core/types/class.type';
import { housesData } from '@/lib/core/domain/house';
import { getHouseDefaultImage } from '@/lib/core/utils/house-images';

const iconMap: Record<string, LucideIcon | string> = {
  potions: '🎯',
  shop: Sparkles,
  profile: UserIcon,
  greatHall: BookOpen,
};

interface HeaderProperties {
  title: string;
  subtitle?: string;
  icon?: LucideIcon | string;
  showBackButton?: boolean;
  backButtonHref?: string;
  showNavLinks?: boolean;
  showCurrency?: 'galleons' | 'all';
  user: ClientUser;
  classInfo?: EnrichedClass | null;
  onLogout: () => void;
}

export function Header({
  title,
  subtitle,
  icon: IconProp = Sparkles,
  showBackButton = false,
  backButtonHref,
  showNavLinks = false,
  showCurrency,
  user,
  classInfo,
  onLogout,
}: HeaderProperties) {
  const router = useRouter();

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

  const userHouse = useMemo(() => {
    const house = housesData[user.house];
    return { id: user.house, house };
  }, [user.house]);

  const houseColorClass = userHouse?.house?.tailwindGradient || 'bg-gray-500';

  const userCurrencies = useMemo(() => {
    if (!classInfo || !user) return { galleons: 0, sickles: 0, knuts: 0 };
    const progress = classInfo.users?.[user.id]?.progress;
    return {
      galleons: progress?.currencies.galleons ?? 0,
      sickles: progress?.currencies.sickles ?? 0,
      knuts: progress?.currencies.knuts ?? 0,
    };
  }, [classInfo, user]);

  const userLevel = useMemo(() => {
    if (!classInfo || !user) return { level: 1, xp: 0, xpToNextLevel: 100 };
    const progress = classInfo.users?.[user.id]?.progress;
    return {
      level: progress?.level ?? 1,
      xp: progress?.xp ?? 0,
      xpToNextLevel: progress?.xpToNextLevel ?? 100,
    };
  }, [classInfo, user]);

  const xpPercentage = useMemo(() => {
    return Math.min((userLevel.xp / userLevel.xpToNextLevel) * 100, 100);
  }, [userLevel]);

  const handleBackClick = () => {
    if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };

  const HeaderIcon =
    typeof IconProp === 'string' ? iconMap[IconProp] || IconProp : IconProp;
  const isEmojiIcon =
    typeof HeaderIcon === 'string' && /\p{Emoji}/u.test(HeaderIcon);

  return (
    <header className='relative overflow-hidden sticky top-0 z-50 shadow-sm'>
      {/* Background image */}
      <div className='absolute inset-0'>
        <Image 
          src='/image/headerprincipal.png' 
          alt='Header Background' 
          fill
          className='object-cover'
          priority
        />
      </div>
      
      <div className='relative container mx-auto px-2 md:px-4 py-2.5'>
        <div className='flex items-center justify-between gap-2'>
          {/* Logo */}
          <div className='flex items-center gap-2 md:gap-8 flex-shrink-0'>
            <Image 
              src='/image/PokédexLOGO.png' 
              alt='PokédexCode' 
              width={180} 
              height={62}
              className='h-10 md:h-16 w-auto'
            />
            
            {/* Navigation Links */}
            <nav className='flex items-center gap-2 md:gap-6'>
              <Button
                variant='ghost'
                className='text-blue-600 font-semibold text-xs md:text-base px-2 md:px-4 !bg-transparent hover:!bg-transparent hover:text-[#FFCB05] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFCB05] hover:after:w-full after:transition-all after:duration-300'
                onClick={() => router.push('/great-hall')}
              >
                Início
              </Button>
              <Button
                variant='ghost'
                className='text-blue-600 font-semibold text-xs md:text-base px-2 md:px-4 !bg-transparent hover:!bg-transparent hover:text-[#FFCB05] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFCB05] hover:after:w-full after:transition-all after:duration-300'
                onClick={() => router.push('/randombattle/battle?mode=random')}
              >
                Batalhar
              </Button>
              <Button
                variant='ghost'
                className='text-blue-600 font-semibold text-xs md:text-base px-2 md:px-4 !bg-transparent hover:!bg-transparent hover:text-[#FFCB05] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFCB05] hover:after:w-full after:transition-all after:duration-300'
                onClick={() => router.push('/professor')}
              >
                Aprender
              </Button>
              <Button
                variant='ghost'
                className='text-blue-600 font-semibold text-xs md:text-base px-2 md:px-4 !bg-transparent hover:!bg-transparent hover:text-[#FFCB05] relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#FFCB05] hover:after:w-full after:transition-all after:duration-300'
                onClick={() => router.push('/shop')}
              >
                Amigos
              </Button>
            </nav>
          </div>

          {/* User Area with Level and XP */}
          <div className='flex items-center gap-3 ml-auto -mr-8 md:-mr-16'>
            <Popover>
              <PopoverTrigger asChild>
                <div className='flex items-center gap-3 md:gap-4 bg-white rounded-full pl-4 md:pl-6 pr-2 md:pr-3 py-2 md:py-2.5 border-[3px] border-[#3C7CCA] cursor-pointer hover:shadow-lg transition-all shadow-md min-w-[180px] md:min-w-[320px]'>
                  {/* Info section */}
                  <div className='flex flex-col items-center flex-1 min-w-0'>
                    <div className='flex items-center justify-between w-full mb-1'>
                      <span className='text-xs md:text-base font-bold text-gray-900 truncate'>
                        {user.profile.name.split(' ')[0]}
                      </span>
                      <span className='text-xs md:text-sm font-bold text-gray-700 ml-2'>
                        LEVEL {userLevel.level}
                      </span>
                    </div>
                    <div className='w-full bg-[#EAEAEA] rounded-full h-3 md:h-4 overflow-hidden'>
                      <div 
                        className='bg-[#00FF15] h-full rounded-full transition-all duration-300'
                        style={{ width: `${xpPercentage}%` }}
                      ></div>
                    </div>
                    <span className='text-[10px] md:text-xs text-gray-700 font-semibold mt-1 text-center'>
                      XP {userLevel.xp}/{userLevel.xpToNextLevel}
                    </span>
                  </div>
                  
                  <Avatar className='border-[3px] border-[#3C7CCA] w-12 h-12 md:w-16 md:h-16 flex-shrink-0'>
                    <AvatarImage
                      src={getHouseDefaultImage(user.house)}
                      alt={user.profile.name}
                    />
                    <AvatarFallback className={`${houseColorClass} text-white font-bold text-sm md:text-lg`}>
                      {getInitials(user.profile.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-56 p-2' sideOffset={10}>
                <div className='flex flex-col space-y-1'>
                  <div className='px-2 py-1.5 text-sm font-semibold truncate'>
                    {user.profile.name}
                  </div>
                  <div className='px-2 py-1.5 text-xs text-muted-foreground truncate'>
                    {user.email}
                  </div>
                  <div className='px-2 py-1.5 text-xs border-t border-border'>
                    <div className='flex justify-between mb-1'>
                      <span className='text-muted-foreground'>Level:</span>
                      <span className='font-semibold'>{userLevel.level}</span>
                    </div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-muted-foreground'>XP:</span>
                      <span className='font-semibold'>{userLevel.xp} / {userLevel.xpToNextLevel}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Pokédólares:</span>
                      <span className='font-semibold'>{userCurrencies.galleons}</span>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start text-sm'
                    onClick={() => router.push('/profile')}
                  >
                    <UserIcon className='w-4 h-4 mr-2' /> Meu Perfil
                  </Button>
                  <div className='md:hidden border-t border-border pt-1 mt-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-sm'
                      onClick={() => router.push('/great-hall')}
                    >
                      <BookOpen className='w-4 h-4 mr-2' /> Início
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-sm'
                      onClick={() => router.push('/randombattle/battle?mode=random')}
                    >
                      <Swords className='w-4 h-4 mr-2' /> Batalhar
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-sm'
                      onClick={() => router.push('/professor')}
                    >
                      <BookOpen className='w-4 h-4 mr-2' /> Aprender
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start text-sm'
                      onClick={() => router.push('/shop')}
                    >
                      <Users className='w-4 h-4 mr-2' /> Amigos
                    </Button>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start text-sm text-destructive hover:text-destructive border-t border-border mt-1 pt-2'
                    onClick={onLogout}
                  >
                    <LogOut className='w-4 h-4 mr-2' /> Sair
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
