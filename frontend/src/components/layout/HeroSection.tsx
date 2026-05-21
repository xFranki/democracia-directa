'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-darker via-brand-surface/50 to-brand-darker" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,214,143,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(51,153,255,0.06),transparent_60%)]" />

      {/* Grid de fondo sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-chain-green/10 border border-chain-green/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-chain-green rounded-full animate-pulse" />
              <span className="text-chain-green text-sm font-medium">Red activa · Blockchain verificable</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              Esto no es{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-gold">
                democracia.
              </span>
              <br />
              <span className="text-white/90">Esto podría serlo.</span>
            </h1>

            <p className="text-xl text-white/60 leading-relaxed mb-10 max-w-2xl">
              En España votamos una vez cada cuatro años para elegir entre listas cerradas que no controlamos.
              Esto es una demostración de lo que sería posible: <strong className="text-white/80">tú, proponiendo.
              Tú, votando. Sin intermediarios. Sin partidos. Sin excusas.</strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/registro" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                Quiero participar
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/propuestas" className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
                Ver propuestas activas
              </Link>
            </div>
          </motion.div>

          {/* Stats rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg"
          >
            {[
              { icon: Users, label: 'Ciudadanos', value: '— únete' },
              { icon: Shield, label: 'Votos registrados', value: '0 alterados' },
              { icon: Zap, label: 'Propuestas activas', value: 'Creciendo' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-chain-green mx-auto mb-1" />
                <div className="text-white/40 text-xs">{label}</div>
                <div className="text-white font-semibold text-sm">{value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
