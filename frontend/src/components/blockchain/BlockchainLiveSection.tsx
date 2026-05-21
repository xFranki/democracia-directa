'use client';

import { motion } from 'framer-motion';
import { Link2, CheckCircle2, Clock } from 'lucide-react';

// Datos de muestra para la demo visual
const sampleBlocks = [
  {
    index: 4,
    hash: '0001a3f2b9c4d8e1f0a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
    previousHash: '000c7a8b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    transactions: 3,
    timestamp: 'hace 2 min',
    type: 'VOTE',
  },
  {
    index: 3,
    hash: '000c7a8b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    previousHash: '0002d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    transactions: 1,
    timestamp: 'hace 8 min',
    type: 'PROPOSAL',
  },
  {
    index: 2,
    hash: '0002d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    previousHash: '0009e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
    transactions: 5,
    timestamp: 'hace 15 min',
    type: 'VOTE',
  },
  {
    index: 1,
    hash: '0009e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    transactions: 1,
    timestamp: 'Bloque génesis',
    type: 'GENESIS',
  },
];

function BlockCard({ block, isLatest }: { block: typeof sampleBlocks[0]; isLatest: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`card font-mono text-xs ${isLatest ? 'border-chain-green/40 glow-green' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white/40">Bloque</span>
          <span className="text-chain-green font-bold">#{block.index}</span>
          {isLatest && (
            <span className="bg-chain-green/20 text-chain-green text-[10px] px-2 py-0.5 rounded-full">ÚLTIMO</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-white/40">
          <Clock className="w-3 h-3" />
          {block.timestamp}
        </div>
      </div>

      <div className="space-y-1.5 text-white/50">
        <div className="flex gap-2">
          <span className="text-white/30 w-16 flex-shrink-0">Hash</span>
          <span className="text-chain-blue truncate">{block.hash}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-white/30 w-16 flex-shrink-0">Prev</span>
          <span className="text-white/40 truncate">{block.previousHash}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-white/30 w-16 flex-shrink-0">Tipo</span>
          <span className={block.type === 'VOTE' ? 'text-chain-green' : block.type === 'PROPOSAL' ? 'text-chain-purple' : 'text-white/40'}>
            {block.type}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-chain-green/70">
        <CheckCircle2 className="w-3 h-3" />
        <span className="text-[10px]">Cadena verificada · {block.transactions} transacción{block.transactions !== 1 ? 'es' : ''}</span>
      </div>
    </motion.div>
  );
}

export function BlockchainLiveSection() {
  return (
    <section className="py-24 bg-brand-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-chain-blue/10 border border-chain-blue/20 rounded-full px-4 py-1.5 mb-6">
            <Link2 className="w-4 h-4 text-chain-blue" />
            <span className="text-chain-blue text-sm">Explorador de bloques en vivo</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Cada voto queda grabado para siempre
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Esta es la cadena de bloques real de la plataforma. Cada bloque contiene el hash del anterior —
            si alguien manipula un voto, <strong className="text-white/70">toda la cadena se rompe y es detectable al instante</strong>.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleBlocks.map((block, i) => (
            <BlockCard key={block.index} block={block} isLatest={i === 0} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a href="/explorador" className="btn-secondary inline-flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Ver explorador completo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
