import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tu Vida en Semanas | WeeksToDie',
  description:
    'Visualiza cada semana de tu vida en una cuadricula. Una perspectiva unica sobre el tiempo basada en el concepto de 4000 semanas.',
  keywords: ['semanas de vida', '4000 semanas', 'visualizador', 'tiempo', 'perspectiva de vida'],
  openGraph: {
    title: 'Tu Vida en Semanas | WeeksToDie',
    description: 'Visualiza cada semana de tu vida en una cuadricula',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
