'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-darker/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="w-6 h-6 text-chain-green group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg tracking-tight">
              Democracia<span className="text-chain-green">Directa</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <Link href="/propuestas" className="hover:text-white transition-colors">Propuestas</Link>
            <Link href="/explorador" className="hover:text-white transition-colors">Explorador</Link>
            <Link href="/como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link>
            <Link href="/manifiesto" className="hover:text-white transition-colors">Manifiesto</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <Link href="/admin" className="text-xs text-brand-gold/70 hover:text-brand-gold transition-colors flex items-center gap-1 border border-brand-gold/20 rounded-lg px-2.5 py-1.5">
                      <Shield className="w-3.5 h-3.5" /> Admin
                    </Link>
                    <Link href="/moderacion" className="text-xs text-chain-blue/70 hover:text-chain-blue transition-colors flex items-center gap-1 border border-chain-blue/20 rounded-lg px-2.5 py-1.5">
                      <Shield className="w-3.5 h-3.5" /> Moderación
                    </Link>
                  </>
                )}
                {user.role === 'MODERATOR' && (
                  <Link href="/moderacion" className="text-xs text-chain-blue/70 hover:text-chain-blue transition-colors flex items-center gap-1 border border-chain-blue/20 rounded-lg px-2.5 py-1.5">
                    <Shield className="w-3.5 h-3.5" /> Moderador
                  </Link>
                )}
                <Link
                  href={`/perfil/${user.username}`}
                  className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-6 h-6 rounded-full bg-chain-green/20 border border-chain-green/30 flex items-center justify-center text-chain-green text-[10px] font-bold">
                    {user.username?.slice(0, 2).toUpperCase() ?? '?'}
                  </span>
                  <span className="text-sm">{user.username}</span>
                </Link>
                <Link href="/dashboard" className="btn-secondary text-sm py-1.5 px-4">
                  Mi cuenta
                </Link>
                <button onClick={logout} className="btn-secondary text-sm py-1.5 px-4">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary text-sm py-1.5 px-4">Entrar</Link>
                <Link href="/auth/registro" className="btn-primary text-sm py-1.5 px-4">Unirme</Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx(
        'md:hidden border-t border-white/10 overflow-hidden transition-all duration-200',
        mobileOpen ? 'max-h-96' : 'max-h-0'
      )}>
        <div className="px-4 py-4 space-y-3">
          <Link href="/propuestas" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Propuestas</Link>
          <Link href="/explorador" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Explorador</Link>
          <Link href="/como-funciona" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Cómo funciona</Link>
          <Link href="/manifiesto" className="block text-white/70 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Manifiesto</Link>
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={`/perfil/${user.username}`} className="block text-white/70 hover:text-white py-2" onClick={() => setMobileOpen(false)}>
                  Mi perfil (@{user.username})
                </Link>
                {user.role === 'ADMIN' && (
                  <>
                    <Link href="/admin" className="block text-brand-gold/70 hover:text-brand-gold py-2" onClick={() => setMobileOpen(false)}>
                      Panel Admin
                    </Link>
                    <Link href="/moderacion" className="block text-chain-blue/70 hover:text-chain-blue py-2" onClick={() => setMobileOpen(false)}>
                      Panel Moderación
                    </Link>
                  </>
                )}
                {user.role === 'MODERATOR' && (
                  <Link href="/moderacion" className="block text-chain-blue/70 hover:text-chain-blue py-2" onClick={() => setMobileOpen(false)}>
                    Panel Moderación
                  </Link>
                )}
                <div className="flex gap-2">
                  <Link href="/dashboard" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Mi cuenta</Link>
                  <button onClick={logout} className="btn-secondary text-sm flex-1">Salir</button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login" className="btn-secondary text-sm flex-1 text-center">Entrar</Link>
                <Link href="/auth/registro" className="btn-primary text-sm flex-1 text-center">Unirme</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
