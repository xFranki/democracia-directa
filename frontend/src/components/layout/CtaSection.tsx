'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,214,143,0.08),transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-6">
            La democracia real<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-chain-green to-chain-blue">
              empieza aquí.
            </span>
          </h2>

          <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            No esperamos a que nos den permiso. La herramienta existe. La tecnología existe.
            Solo falta que te unas y demuestres que hay ciudadanos dispuestos a participar de verdad.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/registro" className="btn-primary flex items-center gap-2 text-lg px-10 py-4">
              Crear mi identidad ciudadana
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com/xFranki/democracia-directa"
              className="btn-secondary flex items-center gap-2 text-lg px-10 py-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
              Código abierto
            </Link>
          </div>

          <p className="mt-8 text-white/25 text-sm">
            Plataforma de código abierto · Sin financiación de partidos · Sin tracking · Datos en tu poder
          </p>
        </motion.div>
      </div>
    </section>
  );
}
