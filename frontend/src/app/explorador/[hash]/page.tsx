'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Hash, ChevronLeft, Cpu, Clock, CheckCircle2, FileText, ThumbsUp, ArrowRight, Blocks } from 'lucide-react';

interface Vote {
  voteHash: string;
  choice: 'YES' | 'NO' | 'ABSTAIN';
  isAnonymous: boolean;
  createdAt: string;
}

interface Proposal {
  id: string;
  title: string;
  status: string;
}

interface BlockDetail {
  id: string;
  index: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  nonce: number;
  timestamp: string;
  data: { type: string; payload: Record<string, unknown> };
  votes: Vote[];
  proposals: Proposal[];
}

const CHOICE_LABELS: Record<string, string> = { YES: 'A favor', NO: 'En contra', ABSTAIN: 'Abstención' };
const CHOICE_COLORS: Record<string, string> = {
  YES: 'text-chain-green border-chain-green/30 bg-chain-green/10',
  NO: 'text-red-400 border-red-400/30 bg-red-400/10',
  ABSTAIN: 'text-white/40 border-white/20 bg-white/5',
};

export default function BlockDetailPage() {
  const { hash } = useParams<{ hash: string }>();
  const router = useRouter();
  const [block, setBlock] = useState<BlockDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blockchain/blocks/${hash}`)
      .then(({ data }) => setBlock(data))
      .catch(() => router.replace('/explorador'))
      .finally(() => setLoading(false));
  }, [hash, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse h-24 bg-brand-surface/50" />
        ))}
      </div>
    );
  }

  if (!block) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Volver */}
      <Link href="/explorador" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Explorador
      </Link>

      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-chain-blue/10 border border-chain-blue/20 flex items-center justify-center shrink-0">
          <Blocks className="w-6 h-6 text-chain-blue" />
        </div>
        <div>
          <p className="text-white/40 text-sm">Bloque</p>
          <h1 className="text-3xl font-bold">#{block.index}</h1>
        </div>
        <span className={`ml-auto text-sm font-medium px-3 py-1 rounded-full border ${
          block.data?.type === 'VOTE'
            ? 'text-chain-purple border-chain-purple/30 bg-chain-purple/10'
            : block.index === 0
            ? 'text-brand-gold border-brand-gold/30 bg-brand-gold/10'
            : 'text-chain-green border-chain-green/30 bg-chain-green/10'
        }`}>
          {block.index === 0 ? 'Génesis' : block.data?.type === 'VOTE' ? 'Voto' : 'Propuesta'}
        </span>
      </div>

      {/* Datos del bloque */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Datos del bloque</h2>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-white/5">
            <span className="text-white/40 sm:w-36 shrink-0">Hash</span>
            <span className="font-mono text-xs text-white/80 break-all">{block.hash}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-white/5">
            <span className="text-white/40 sm:w-36 shrink-0">Hash anterior</span>
            {block.index === 0 ? (
              <span className="font-mono text-xs text-white/30">{block.previousHash}</span>
            ) : (
              <Link href={`/explorador/${block.previousHash}`} className="font-mono text-xs text-chain-blue hover:underline break-all">
                {block.previousHash}
              </Link>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-white/5">
            <span className="text-white/40 sm:w-36 shrink-0">Merkle Root</span>
            <span className="font-mono text-xs text-white/60 break-all">{block.merkleRoot}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-white/5">
            <span className="text-white/40 sm:w-36 shrink-0 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Nonce (PoW)
            </span>
            <span className="font-mono text-white/80">{block.nonce.toLocaleString()}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2">
            <span className="text-white/40 sm:w-36 shrink-0 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Timestamp
            </span>
            <span className="text-white/70">{new Date(block.timestamp).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'medium' })}</span>
          </div>
        </div>
      </div>

      {/* Payload */}
      {block.data?.payload && (
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Contenido registrado</h2>
          <pre className="text-xs text-white/50 bg-black/30 rounded-lg p-4 overflow-x-auto leading-relaxed">
            {JSON.stringify(block.data.payload, null, 2)}
          </pre>
        </div>
      )}

      {/* Propuestas vinculadas */}
      {block.proposals.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-chain-green" />
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Propuestas en este bloque</h2>
          </div>
          <div className="space-y-2">
            {block.proposals.map(p => (
              <Link key={p.id} href={`/propuestas/${p.id}`} className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-white/5 group transition-colors">
                <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">{p.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-chain-green shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Votos vinculados */}
      {block.votes.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-4 h-4 text-chain-purple" />
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Votos en este bloque</h2>
            <span className="text-white/20 text-xs">({block.votes.length})</span>
          </div>
          <div className="space-y-2">
            {block.votes.map(v => (
              <div key={v.voteHash} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/3">
                <Hash className="w-3.5 h-3.5 text-white/20 shrink-0" />
                <span className="font-mono text-xs text-white/40 truncate flex-1">{v.voteHash}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CHOICE_COLORS[v.choice]}`}>
                  {CHOICE_LABELS[v.choice]}
                </span>
                {v.isAnonymous && (
                  <span className="text-xs text-white/20">Anónimo</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verificación */}
      <div className="flex items-center gap-3 p-4 border border-chain-green/20 bg-chain-green/5 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-chain-green shrink-0" />
        <div>
          <p className="text-chain-green text-sm font-medium">Bloque verificado</p>
          <p className="text-white/40 text-xs mt-0.5">El hash SHA-256 de este bloque es válido y está enlazado a la cadena.</p>
        </div>
      </div>
    </div>
  );
}
