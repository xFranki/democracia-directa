import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Democracia Directa — El poder de decidir, por fin en tus manos',
  description: 'Plataforma ciudadana de democracia directa con registro transparente en blockchain. Propón, debate y vota sin intermediarios.',
  keywords: ['democracia directa', 'España', 'participación ciudadana', 'blockchain', 'propuestas', 'votaciones'],
  openGraph: {
    title: 'Democracia Directa',
    description: 'El poder de decidir, por fin en tus manos',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-brand-darker text-white min-h-screen flex flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
