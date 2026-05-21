'use client';

import { motion } from 'framer-motion';
import { XCircle, CheckCircle2 } from 'lucide-react';

const problems = [
  'Listas cerradas: el partido elige, tú acatas',
  'Voto cada 4 años: tu opinión no importa entre medias',
  'Transfuguismo: el elegido hace lo que le conviene',
  'Financiación opaca de partidos',
  'Coaliciones que traicionan a sus votantes',
  'Ningún mecanismo de revocación ciudadana',
];

const solutions = [
  'Cualquier ciudadano puede proponer una ley',
  'Votación continua sobre cualquier tema',
  'Cada voto es público, trazable e inmutable',
  'Sin partidos, sin listas, sin intermediarios',
  'Resultados en tiempo real verificables por todos',
  'Revocación de mandatos por votación directa',
];

export function WhySection() {
  return (
    <section className="py-24 bg-brand-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            El sistema que <span className="text-brand-red">tenemos</span> vs. el que <span className="text-chain-green">podríamos tener</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            No es utopía. Es tecnología que ya existe. Lo que falta es voluntad política — y eso lo ponemos nosotros.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card border-brand-red/20 bg-brand-red/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-brand-red" />
              <h3 className="text-xl font-bold text-brand-red">Lo que nos venden como democracia</h3>
            </div>
            <ul className="space-y-3">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/60">
                  <XCircle className="w-4 h-4 text-brand-red/60 mt-0.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card border-chain-green/20 bg-chain-green/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-chain-green" />
              <h3 className="text-xl font-bold text-chain-green">Lo que la tecnología nos permite hoy</h3>
            </div>
            <ul className="space-y-3">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-chain-green/60 mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-white/40 text-sm max-w-xl mx-auto"
        >
          * Esta plataforma es una demostración funcional. Los votos aquí no tienen efecto legal (todavía).
          El objetivo es demostrar que es técnicamente posible y políticamente deseable.
        </motion.p>
      </div>
    </section>
  );
}
