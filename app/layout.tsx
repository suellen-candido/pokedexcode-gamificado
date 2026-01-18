import { Pixelify_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import type React from 'react';
import Image from 'next/image';
import BackgroundMusic from '@/lib/client/components/background-music';
import { AuthProvider } from '@/lib/client/contexts/auth-context';
import '@/styles/globals.css';
import TanstackProvider from '@/lib/client/providers/tanstack-provider';
import { Toaster } from 'sonner';

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify-sans',
});

export const metadata: Metadata = {
  description:
    'Aprenda o poder do desenvolvimento web no treinamento mais avançado de programação Pokémon.',
  icons: [{ rel: 'icon', url: '/image/favicon.ico' }],
  title: 'PokédexCode - Treinamento de Desenvolvimento ⚡',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${pixelifySans.variable} dark`} lang='pt-BR'>
      <body className='antialiased min-h-screen bg-gradient-to-br from-background via-card to-background scrollbar-hide font-pixelify relative'>
        <Toaster position='top-right' richColors />

        {/* Pokebola decorativa rotacionando */}
        <div 
          className='fixed left-[-200px] md:left-[-250px] top-1/2 -translate-y-1/2 z-[999] pointer-events-none'
          style={{
            width: '900px',
            height: '920px',
            backgroundImage: 'url(/image/Pokebola.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.3,
            animation: 'spin-slow 20s linear infinite'
          }}
        />

        <div className='relative z-10'>
          <TanstackProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanstackProvider>
        </div>

        <BackgroundMusic />
      </body>
    </html>
  );
}
