import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-chain-green" />
            <span className="font-bold">Democracia<span className="text-chain-green">Directa</span></span>
          </div>

          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/manifiesto" className="hover:text-white transition-colors">Manifiesto</Link>
            <Link href="/como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link>
            <Link href="/explorador" className="hover:text-white transition-colors">Explorador blockchain</Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          </div>

          <p className="text-white/25 text-xs">
            Código abierto · Democracia Directa · España 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
