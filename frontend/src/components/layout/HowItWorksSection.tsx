'use client';

import { motion } from 'framer-motion';
import { UserPlus, FileText, Vote, Search, Award } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Te registras',
    description: 'Creas tu cuenta con email y contraseña. Automáticamente recibes una identidad digital única — tu dirección en la red, como si fuera una wallet pero sin necesidad de crypto.',
    color: 'text-chain-blue',
    bg: 'bg-chain-blue/10',
  },
  {
    icon: FileText,
    title: 'Propones',
    description: 'Cualquier ciudadano puede redactar una propuesta sobre cualquier tema. Educación, sanidad, vivienda, medio ambiente — sin filtros de partido, sin cuotas, sin censura ideológica.',
    color: 'text-chain-purple',
    bg: 'bg-chain-purple/10',
  },
  {
    icon: Vote,
    title: 'Votas',
    description: 'Cuando una propuesta supera el umbral de apoyos, entra en fase de votación. Puedes votar en público o en anónimo. Tu voto queda registrado en la blockchain — inmutable para siempre.',
    color: 'text-chain-green',
    bg: 'bg-chain-green/10',
  },
  {
    icon: Search,
    title: 'Verificas',
    description: 'Recibes un recibo hash de tu voto. Puedes comprobarlo en el explorador público en cualquier momento. Nadie puede cambiar tu voto sin que la cadena entera se rompa visiblemente.',
    color: 'text-brand-gold',
    bg: 'bg-brand-gold/10',
  },
  {
    icon: Award,
    title: 'Construyes reputación',
    description: 'Cada participación suma a tu reputación ciudadana. No es un ranking competitivo — es un indicador de compromiso democrático. Cuanto más participas, más voz tienes.',
    color: 'text-brand-red',
    bg: 'bg-brand-red/10',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Así de simple podría ser</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Sin abogados. Sin intermediarios. Sin partidos. Solo ciudadanos y tecnología.
          </p>
        </motion.div>

        <div className="relative">
          {/* Línea conectora */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-chain-blue via-chain-green to-brand-red hidden lg:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className={`w-16 h-16 rounded-xl ${step.bg} flex items-center justify-center flex-shrink-0 relative z-10`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>
                <div className="card flex-1 hover:glow-green cursor-default">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white/30 text-sm font-mono">0{i + 1}</span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
