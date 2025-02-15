import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import Disclaimer from '@/components/Disclaimer';
import GitHubLink from '@/components/GitHubLink';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Calculator - Movie Industry Tycoon',
  description: 'Calculate affinity in the movie industry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} flex flex-col h-full`}>
        <ThemeProvider>
          <LanguageProvider>
            <header className="flex justify-end items-center p-4 space-x-4">
              <LanguageSelector />
              <ThemeToggle />
              <GitHubLink />
            </header>
            <main className="flex-grow flex items-center justify-center px-4">
              {children}
            </main>
            <Disclaimer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}