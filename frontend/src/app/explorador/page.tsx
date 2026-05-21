'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Blocks, Hash, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight,
  Cpu, FileText, ThumbsUp, Clock, Search, ShieldCheck, ShieldX, ArrowRight, X,
} from 'lucide-react';

interface Block {
  id: string;
  index: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  nonce: number;
  timestamp: string;
  data: { type: string; payload: Record<string, unknown> };
}

interface Stats {
  totalBlocks: number;
  totalVotes: number;
  totalProposals: number;
  lastBlock: Block | null;
}

function shortHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

// ─── Visualización de cadena ─────────────────────────────────────────────────
function ChainViz({ blocks }: { blocks: Block[] }) {
  const visible = [...blocks].reverse().slice(0, 8);

  return (
    <div className="card mb-8 overflow-hidden">
      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Cadena de bloques</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-0 min-w-max">
          {visible.map((block, i) => (
            <div key={block.id} className="flex items-center">
              <Link href={`/explorador/${block.hash}`} className="group flex flex-col items-center gap-2">
                <div className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all group-hover:scale-105 ${
                  block.index === 0
                    ? 'border-brand-gold/50 bg-brand-gold/10'
                    : block.data?.type === 'VOTE'
                    ? 'border-chain-purple/50 bg-chain-purple/10'
                    : 'border-chain-green/50 bg-chain-green/10'
                }`}>
                  <span className={`text-xs font-bold ${
                    block.index === 0 ? 'text-brand-gold' : block.data?.type === 'VOTE' ? 'text-chain-purple' : 'text-chain-green'
                  }`}>#{block.index}</span>
                  <span className="text-white/30 text-[10px] font-mono">{block.hash.slice(0, 6)}</span>
                  <span className="text-white/20 text-[9px]">{timeAgo(block.timestamp)}</span>
                </div>
                <span className={`text-[10px] font-medium ${
                  block.index === 0 ? 'text-brand-gold/70' : block.data?.type === 'VOTE' ? 'text-chain-purple/70' : 'text-chain-green/70'
                }`}>
                  {block.index === 0 ? 'Génesis' : block.data?.type === 'VOTE' ? 'Voto' : 'Propuesta'}
                </span>
              </Link>
              {i < visible.length - 1 && (
                <div className="flex items-center mx-1 mb-6">
                  <div className="w-6 h-px bg-white/20" />
                  <ArrowRight className="w-3 h-3 text-white/20" />
                </div>
              )}
            </div>
          ))}
          {blocks.length > 8 && (
            <div className="flex items-center ml-2 mb-6">
              <div className="w-4 h-px bg-white/10" />
              <span className="text-white/20 text-xs ml-2">+{blocks.length - 8} más</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Verificador de voto ──────────────────────────────────────────────────────
function VoteVerifier() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'valid' | 'invalid' | null>(null);
  const [loading, setLoading] = useState(false);

  async function verify() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/blockchain/verify-vote/${input.trim()}`);
      setResult(data.valid ? 'valid' : 'invalid');
    } catch {
      setResult('invalid');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setInput('');
    setResult(null);
  }

  return (
    <div className="card mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-chain-blue" />
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Verificar recibo de voto</h2>
      </div>
      <p className="text-white/40 text-sm mb-4">
        Pega el hash de tu recibo de voto para comprobar que está registrado en la cadena y no ha sido alterado.
      </p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null); }}
          onKeyDown={e => e.key === 'Enter' && verify()}
          placeholder="Pega tu voteHash aquí..."
          className="input font-mono text-sm flex-1"
        />
        {input && (
          <button onClick={reset} className="btn-secondary px-3 py-2">
            <X className="w-4 h-4" />
          </button>
        )}
        <button onClick={verify} disabled={!input.trim() || loading} className="btn-primary px-4 py-2 text-sm">
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </div>

      {result && (
        <div className={`mt-4 flex items-center gap-3 p-4 rounded-xl border ${
          result === 'valid'
            ? 'border-chain-green/30 bg-chain-green/5'
            : 'border-red-400/30 bg-red-400/5'
        }`}>
          {result === 'valid' ? (
            <>
              <ShieldCheck className="w-5 h-5 text-chain-green shrink-0" />
              <div>
                <p className="text-chain-green font-medium text-sm">Voto auténtico y verificado</p>
                <p className="text-white/40 text-xs mt-0.5">Este hash existe en la cadena y no ha sido manipulado.</p>
              </div>
            </>
          ) : (
            <>
              <ShieldX className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="text-red-400 font-medium text-sm">Hash no encontrado</p>
                <p className="text-white/40 text-xs mt-0.5">Este hash no existe en la cadena. Comprueba que lo has copiado correctamente.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ExploradorPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chainValid, setChainValid] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PROPOSAL' | 'VOTE' | 'GENESIS'>('ALL');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [blocksRes, statsRes, verifyRes] = await Promise.all([
        api.get(`/blockchain/blocks?page=${page}`),
        api.get('/blockchain/stats'),
        api.get('/blockchain/verify'),
      ]);
      setBlocks(blocksRes.data.blocks);
      setTotalPages(blocksRes.data.pages);
      setStats(statsRes.data);
      setChainValid(verifyRes.data.valid);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = blocks.filter(b => {
    const matchType =
      typeFilter === 'ALL' ||
      (typeFilter === 'GENESIS' && b.index === 0) ||
      (typeFilter === 'PROPOSAL' && b.data?.type === 'PROPOSAL' && b.index !== 0) ||
      (typeFilter === 'VOTE' && b.data?.type === 'VOTE');
    const matchSearch =
      !search ||
      b.hash.includes(search.toLowerCase()) ||
      String(b.index) === search;
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Cabecera */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Blocks className="w-7 h-7 text-chain-blue" />
          <h1 className="text-4xl font-bold">Explorador de bloques</h1>
        </div>
        <p className="text-white/40 text-sm">Cada propuesta y voto queda registrado de forma permanente e inmutable en la cadena.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Blocks className="w-5 h-5 text-chain-blue mx-auto mb-2" />
            <p className="text-3xl font-bold">{stats.totalBlocks}</p>
            <p className="text-white/40 text-sm mt-1">Bloques</p>
          </div>
          <div className="card text-center">
            <FileText className="w-5 h-5 text-chain-green mx-auto mb-2" />
            <p className="text-3xl font-bold">{stats.totalProposals}</p>
            <p className="text-white/40 text-sm mt-1">Propuestas</p>
          </div>
          <div className="card text-center">
            <ThumbsUp className="w-5 h-5 text-chain-purple mx-auto mb-2" />
            <p className="text-3xl font-bold">{stats.totalVotes}</p>
            <p className="text-white/40 text-sm mt-1">Votos</p>
          </div>
          <div className="card text-center">
            {chainValid === null ? (
              <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse mx-auto mb-2" />
            ) : chainValid ? (
              <CheckCircle2 className="w-5 h-5 text-chain-green mx-auto mb-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            )}
            <p className={`text-sm font-bold mt-1 ${chainValid === null ? 'text-white/30' : chainValid ? 'text-chain-green' : 'text-red-400'}`}>
              {chainValid === null ? '...' : chainValid ? 'Cadena válida' : 'Cadena corrupta'}
            </p>
            <p className="text-white/40 text-xs mt-0.5">Integridad</p>
          </div>
        </div>
      )}

      {/* Visualización */}
      {!loading && blocks.length > 0 && <ChainViz blocks={blocks} />}

      {/* Verificador */}
      <VoteVerifier />

      {/* Buscador y filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por hash o número de bloque..."
            className="input pl-9 text-sm w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(['ALL', 'PROPOSAL', 'VOTE', 'GENESIS'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                typeFilter === t
                  ? 'border-chain-blue/50 bg-chain-blue/10 text-chain-blue'
                  : 'border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              {t === 'ALL' ? 'Todos' : t === 'PROPOSAL' ? 'Propuestas' : t === 'VOTE' ? 'Votos' : 'Génesis'}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de bloques */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-24 bg-brand-surface/50" />
          ))
        ) : filtered.length === 0 ? (
          <div className="card text-center py-10">
            <Search className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No se encontraron bloques con ese criterio.</p>
          </div>
        ) : (
          filtered.map(block => (
            <Link
              key={block.id}
              href={`/explorador/${block.hash}`}
              className="card flex flex-col sm:flex-row sm:items-center gap-4 hover:border-chain-blue/40 group transition-colors"
            >
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-chain-blue/10 border border-chain-blue/20 flex items-center justify-center">
                  <span className="text-chain-blue font-bold text-sm">#{block.index}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-white/30 shrink-0" />
                  <span className="font-mono text-xs text-white/60 truncate group-hover:text-chain-blue transition-colors">
                    {block.hash}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/20 text-xs font-mono">prev:</span>
                  <span className="font-mono text-xs text-white/30 truncate">{shortHash(block.previousHash)}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  block.data?.type === 'VOTE'
                    ? 'text-chain-purple border-chain-purple/30 bg-chain-purple/10'
                    : block.index === 0
                    ? 'text-brand-gold border-brand-gold/30 bg-brand-gold/10'
                    : 'text-chain-green border-chain-green/30 bg-chain-green/10'
                }`}>
                  {block.index === 0 ? 'Génesis' : block.data?.type === 'VOTE' ? 'Voto' : 'Propuesta'}
                </span>
                <div className="flex items-center gap-1 text-white/30 text-xs">
                  <Cpu className="w-3 h-3" />
                  <span>nonce {block.nonce.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-white/30 text-xs shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(block.timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && !search && typeFilter === 'ALL' && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <span className="text-white/40 text-sm">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1 disabled:opacity-30"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
