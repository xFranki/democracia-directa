'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { api } from '@/lib/api';
import { ProposalCard, type Proposal } from '@/components/proposals/ProposalCard';
import {
  ShieldCheck, Clock, FileText, ThumbsUp, CheckCircle2,
  XCircle, MessageSquare, Trash2, ChevronLeft, ChevronRight, ArrowRight,
} from 'lucide-react';

interface ModStats {
  pending: number;
  active: number;
  voting: number;
  approved: number;
  rejected: number;
  expired: number;
  totalComments: number;
  deletedComments: number;
}

export default function ModeracionPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [stats, setStats] = useState<ModStats | null>(null);
  const [queue, setQueue] = useState<Proposal[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') { router.replace('/'); return; }
  }, [user, router]);

  useEffect(() => {
    api.get('/moderacion/stats').then(({ data }) => setStats(data));
  }, []);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/moderacion/queue?page=${page}`);
      setQueue(data.proposals);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Cabecera */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-7 h-7 text-chain-blue" />
          <h1 className="text-4xl font-bold">Panel de moderación</h1>
        </div>
        <p className="text-white/40 text-sm">Revisa las propuestas pendientes y supervisa el contenido de la plataforma.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="card text-center border-yellow-500/20">
            <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            <p className="text-white/40 text-xs mt-1">Pendientes</p>
          </div>
          <div className="card text-center">
            <FileText className="w-5 h-5 text-chain-green mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-white/40 text-xs mt-1">Activas</p>
          </div>
          <div className="card text-center">
            <ThumbsUp className="w-5 h-5 text-chain-blue mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.voting}</p>
            <p className="text-white/40 text-xs mt-1">En votación</p>
          </div>
          <div className="card text-center">
            <CheckCircle2 className="w-5 h-5 text-chain-green mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p className="text-white/40 text-xs mt-1">Aprobadas</p>
          </div>
          <div className="card text-center">
            <XCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.rejected}</p>
            <p className="text-white/40 text-xs mt-1">Rechazadas</p>
          </div>
          <div className="card text-center">
            <Clock className="w-5 h-5 text-white/30 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.expired}</p>
            <p className="text-white/40 text-xs mt-1">Expiradas</p>
          </div>
          <div className="card text-center">
            <MessageSquare className="w-5 h-5 text-white/40 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalComments}</p>
            <p className="text-white/40 text-xs mt-1">Comentarios</p>
          </div>
          <div className="card text-center">
            <Trash2 className="w-5 h-5 text-red-400/60 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.deletedComments}</p>
            <p className="text-white/40 text-xs mt-1">Eliminados</p>
          </div>
        </div>
      )}

      {/* Cola de revisión */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <h2 className="font-semibold">Cola de revisión</h2>
            {total > 0 && (
              <span className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5">
                {total} pendiente{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <Link href="/propuestas" className="text-xs text-white/40 hover:text-white flex items-center gap-1">
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-48 bg-brand-surface/50" />
            ))}
          </div>
        ) : queue.length === 0 ? (
          <div className="card text-center py-16">
            <CheckCircle2 className="w-10 h-10 text-chain-green/30 mx-auto mb-3" />
            <p className="text-white/50 font-medium">Cola vacía</p>
            <p className="text-white/30 text-sm mt-1">No hay propuestas pendientes de revisión.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-5">
              {queue.map(p => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1 disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <span className="text-white/40 text-sm">Página {page} de {pages}</span>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1 disabled:opacity-30">
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
