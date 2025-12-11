import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'MSTC | Microsoft Student Technical Club',
  description: 'Code. Compete. Conquer. The official platform for MSTC.',
};

import { Providers } from './providers';

// ... imports

import { auth } from '@/auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0f0f0f] text-white selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        <Providers session={session}>
          {children}
        </Providers>
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
