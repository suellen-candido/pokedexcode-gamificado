'use client';
import { Card, CardContent } from '@/lib/client/components/ui/card';
import { Badge } from '@/lib/client/components/ui/badge';

interface House {
  id: string;
  name: string;
  description: string;
  specialty: string;
  colors: string;
  traits: string[];
  icon: string;
  quote: string;
}

interface HouseSelectorProps {
  onHouseSelect: (houseId: string) => void;
  selectedHouse?: string;
}

export function HouseSelector({
  onHouseSelect,
  selectedHouse,
}: HouseSelectorProps) {
  const houses: House[] = [
    {
      id: 'gryffindor',
      name: 'Treinador de Fogo',
      description: 'Time dos corajosos especialistas em IA & Machine Learning',
      specialty: 'IA & Machine Learning',
      colors: 'from-orange-600 to-red-500',
      traits: ['Corajoso', 'Inovador', 'Apaixonado'],
      icon: '🔥',
      quote:
        'Como Charmander, o fogo da inovação impulsiona a inteligência artificial!',
    },
    {
      id: 'slytherin',
      name: 'Treinador de Água',
      description: 'Time dos estratégicos especialistas em Segurança & Dados',
      specialty: 'Segurança & Proteção de Dados',
      colors: 'from-blue-600 to-cyan-500',
      traits: ['Estratégico', 'Protetor', 'Cuidadoso'],
      icon: '💧',
      quote:
        'Como Squirtle, protegemos os dados com uma defesa impenetrável!',
    },
    {
      id: 'ravenclaw',
      name: 'Treinador de Planta',
      description: 'Time dos inteligentes especialistas em Web Development',
      specialty: 'Web Development & Full Stack',
      colors: 'from-green-600 to-lime-500',
      traits: ['Inteligente', 'Equilibrado', 'Versátil'],
      icon: '🌱',
      quote:
        'Como Bulbasaur, crescemos e nos adaptamos ao desenvolvimento web moderno!',
    },
    {
      id: 'hufflepuff',
      name: 'Treinador de Elétrico',
      description: 'Time dos confiáveis especialistas em DevOps & Infraestrutura',
      specialty: 'DevOps & Infraestrutura',
      colors: 'from-yellow-500 to-amber-500',
      traits: ['Leal', 'Energético', 'Confiável'],
      icon: '⚡',
      quote: 'Como Pikachu, mantemos toda a infraestrutura funcionando com energia!',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {houses.map((house) => (
        <Card
          key={house.id}
          className={`cursor-pointer transition-all hover:scale-105 ${
            selectedHouse === house.id
              ? 'ring-2 ring-accent magical-border'
              : ''
          }`}
          onClick={() => onHouseSelect(house.id)}
        >
          <CardContent className='p-6 text-center'>
            <div
              className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${house.colors} flex items-center justify-center animate-float`}
            >
              <span className='text-4xl'>{house.icon}</span>
            </div>

            <h3 className='text-xl font-bold mb-2'>{house.name}</h3>
            <p className='text-sm text-muted-foreground mb-3'>
              {house.description}
            </p>

            <div className='flex justify-center gap-1 mb-3'>
              {house.traits.map((trait, index) => (
                <Badge key={index} variant='secondary' className='text-xs'>
                  {trait}
                </Badge>
              ))}
            </div>

            <p className='text-xs italic text-muted-foreground mb-4'>
              "{house.quote}"
            </p>

            <div className='text-xs font-semibold text-accent'>
              {house.specialty}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
