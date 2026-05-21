'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, ThumbsUp, ThumbsDown, Minus,
  Link2, User, MessageSquare, CheckCircle2, Lock, Bookmark, BookmarkCheck, ShieldCheck, Copy, Check,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { CommentsSection } from '@/components/proposals/CommentsSection';

const CATEGORY_LABELS: Record<string, string> = {
  EDUCACION: 'Educación', SANIDAD: 'Sanidad', ECONOMIA: 'Economía',
  MEDIO_AMBIENTE: 'Medio Ambiente', JUSTICIA: 'Justicia', VIVIENDA: 'Vivienda',
  TECNOLOGIA: 'Tecnología', CULTURA: 'Cultura', DEFENSA: 'Defensa', OTRO: 'Otro',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: 'En revisión', ACTIVE: 'Activa', VOTING: 'En votación',
  APPROVED: 'Aprobada', REJECTED: 'Rechazada', EXPIRED: 'Expirada',
};
const STATUS_COLORS: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ACTIVE: 'bg-chain-green/20 text-chain-green border-chain-green/30',
  VOTING: 'bg-chain-blue/20 text-chain-blue border-chain-blue/30',
  APPROVED: 'bg-chain-green/20 text-chain-green border-chain-green/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  EXPIRED: 'bg-white/10 text-white/40 border-white/20',
};
const TERRITORY_LABELS: Record<string, string> = {
  NACIONAL: 'Nacional', ANDALUCIA: 'Andalucía', ARAGON: 'Aragón',
  ASTURIAS: 'Asturias', BALEARES: 'Baleares', CANARIAS: 'Canarias',
  CANTABRIA: 'Cantabria', CASTILLA_LA_MANCHA: 'Castilla-La Mancha',
  CASTILLA_Y_LEON: 'Castilla y León', CATALUNA: 'Cataluña',
  EXTREMADURA: 'Extremadura', GALICIA: 'Galicia', LA_RIOJA: 'La Rioja',
  MADRID: 'Madrid', MURCIA: 'Murcia', NAVARRA: 'Navarra',
  PAIS_VASCO: 'País Vasco', VALENCIA: 'Valencia', CEUTA: 'Ceuta', MELILLA: 'Melilla',
};

interface Reaction { type: 'LIKE' | 'DISLIKE'; userId: string; }
interface Vote { choice: string; isAnonymous: boolean; voteHash: string; user: { username: string; walletAddress: string }; }
interface Comment {
  id: string; content: string; createdAt: string; isDeleted: boolean; parentId: string | null;
  user: { id: string; username: string; displayName: string; walletAddress: string; role: string };
  reactions: Reaction[]; _count: { replies: number }; replies?: Comment[];
}
interface Proposal {
  id: string; title: string; summary: string; content: string;
  category: string; territory: string; status: string; blockHash: string;
  createdAt: string; threshold: number;
  author: { username: string; displayName: string; walletAddress: string; isPublic: boolean };
  _count: { votes: number; comments: number; reactions: number; favorites: number };
  votes: Vote[];
  reactions: Reaction[];
  favorites: { userId: string }[];
}

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [votedChoice, setVotedChoice] = useState<string | null>(null);
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);
  const [voteReceipt, setVoteReceipt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const fetchProposal = useCallback(async () => {
    const { data } = await api.get(`/proposals/${id}`);
    setProposal(data);
    if (user) {
      const myVote = data.votes.find((v: Vote) => v.user?.username === user.username);
      if (myVote) {
        setVotedChoice(myVote.choice);
        setVoteReceipt(myVote.voteHash);
      }
    }
  }, [id, user]);

  const fetchComments = useCallback(async () => {
    const { data } = await api.get(`/proposals/${id}/comments`);
    setComments(data);
  }, [id]);

  useEffect(() => {
    Promise.all([fetchProposal(), fetchComments()])
      .catch(() => router.replace('/propuestas'))
      .finally(() => setLoading(false));
  }, [fetchProposal, fetchComments, router]);

  async function handleVote(choice: string) {
    if (!user) { router.push('/auth/login'); return; }
    setVoting(true); setVoteError('');
    try {
      const { data } = await api.post(`/votes/${id}`, { choice });
      setVotedChoice(choice);
      setPendingChoice(null);
      setVoteReceipt(data.voteHash);
      await fetchProposal();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setVoteError(msg || 'Error al registrar el voto');
    } finally { setVoting(false); }
  }

  async function copyReceipt() {
    if (!voteReceipt) return;
    await navigator.clipboard.writeText(voteReceipt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleReact(type: 'LIKE' | 'DISLIKE') {
    if (!user) { router.push('/auth/login'); return; }
    await api.post(`/proposals/${id}/react`, { type });
    await fetchProposal();
  }

  async function handleStatusChange(status: string) {
    if (!confirm(`¿Cambiar el estado a "${STATUS_LABELS[status]}"?`)) return;
    setChangingStatus(true);
    try {
      await api.patch(`/proposals/${id}/status`, { status });
      await fetchProposal();
    } finally {
      setChangingStatus(false);
    }
  }

  async function handleFavorite() {
    if (!user) { router.push('/auth/login'); return; }
    await api.post(`/proposals/${id}/favorite`);
    await fetchProposal();
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-brand-surface rounded w-3/4" />
          <div className="h-4 bg-brand-surface rounded w-1/2" />
          <div className="h-64 bg-brand-surface rounded mt-8" />
        </div>
      </div>
    );
  }

  if (!proposal) return null;

  const myReaction = proposal.reactions.find(r => r.userId === user?.id)?.type;
  const isSaved = proposal.favorites.some(f => f.userId === user?.id);
  const likes = proposal.reactions.filter(r => r.type === 'LIKE').length;
  const dislikes = proposal.reactions.filter(r => r.type === 'DISLIKE').length;
  const yesVotes = proposal.votes.filter(v => v.choice === 'YES').length;
  const noVotes = proposal.votes.filter(v => v.choice === 'NO').length;
  const abstainVotes = proposal.votes.filter(v => v.choice === 'ABSTAIN').length;
  const totalVotes = proposal._count.votes;
  const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;
  const createdDate = new Date(proposal.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <Link href="/propuestas" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a propuestas
      </Link>

      {/* Cabecera */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs border border-white/20 rounded-full px-2.5 py-0.5 text-white/50">{CATEGORY_LABELS[proposal.category]}</span>
          <span className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${STATUS_COLORS[proposal.status]}`}>{STATUS_LABELS[proposal.status]}</span>
          <span className="flex items-center gap-1 text-xs text-white/30"><MapPin className="w-3 h-3" />{TERRITORY_LABELS[proposal.territory]}</span>
          <span className="flex items-center gap-1 text-xs text-white/30"><Clock className="w-3 h-3" />{createdDate}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{proposal.title}</h1>
        <p className="text-white/60 text-lg leading-relaxed">{proposal.summary}</p>

        {/* Autor + reacciones + favorito */}
        <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2 mr-auto">
            <User className="w-4 h-4 text-white/30" />
            <span className="text-white/50 text-sm">
              Por <span className="text-white/80 font-medium">
                {proposal.author.isPublic ? proposal.author.displayName || proposal.author.username : 'Ciudadano anónimo'}
              </span>
            </span>
            {proposal.author.isPublic && (
              <span className="font-mono text-chain-blue/60 text-xs">{proposal.author.walletAddress.substring(0, 14)}...</span>
            )}
          </div>

          {/* Reacciones */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReact('LIKE')}
              className={`flex items-center gap-1.5 text-sm border rounded-full px-3 py-1.5 transition-all
                ${myReaction === 'LIKE' ? 'border-chain-green/50 bg-chain-green/10 text-chain-green' : 'border-white/10 text-white/40 hover:border-chain-green/30 hover:text-chain-green'}`}
            >
              <ThumbsUp className="w-3.5 h-3.5" /> {likes}
            </button>
            <button
              onClick={() => handleReact('DISLIKE')}
              className={`flex items-center gap-1.5 text-sm border rounded-full px-3 py-1.5 transition-all
                ${myReaction === 'DISLIKE' ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-white/10 text-white/40 hover:border-red-500/30 hover:text-red-400'}`}
            >
              <ThumbsDown className="w-3.5 h-3.5" /> {dislikes}
            </button>
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-1.5 text-sm border rounded-full px-3 py-1.5 transition-all
                ${isSaved ? 'border-brand-gold/50 bg-brand-gold/10 text-brand-gold' : 'border-white/10 text-white/40 hover:border-brand-gold/30 hover:text-brand-gold'}`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {isSaved ? 'Guardado' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Contenido + comentarios */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider mb-5">Desarrollo completo</h2>
            <div className="text-white/70 leading-relaxed space-y-4">
              {proposal.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className={paragraph.length < 60 ? 'font-semibold text-white mt-6 first:mt-0' : ''}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="w-4 h-4 text-white/40" />
              <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider">
                Comentarios ({proposal._count.comments})
              </h2>
            </div>
            <CommentsSection
              proposalId={proposal.id}
              comments={comments}
              onUpdate={() => { fetchProposal(); fetchComments(); }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Votación */}
          <div className="card">
            <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider mb-4">Votación</h2>

            {proposal.status === 'VOTING' ? (
              <div className="space-y-3">
                {votedChoice && (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-chain-green text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Voto registrado en blockchain
                    </div>
                    {voteReceipt && (
                      <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <p className="text-white/30 text-xs mb-1.5">Tu recibo de voto:</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-white/50 break-all flex-1">{voteReceipt}</span>
                          <button onClick={copyReceipt} className="shrink-0 text-white/30 hover:text-white transition-colors">
                            {copied ? <Check className="w-3.5 h-3.5 text-chain-green" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-white/20 text-[10px] mt-2">Guarda este hash para verificar tu voto en el explorador.</p>
                      </div>
                    )}
                  </div>
                )}
                {!votedChoice && !pendingChoice && (['YES', 'NO', 'ABSTAIN'] as const).map((choice) => {
                  const icons = { YES: ThumbsUp, NO: ThumbsDown, ABSTAIN: Minus };
                  const labels = { YES: 'A favor', NO: 'En contra', ABSTAIN: 'Abstención' };
                  const colors = { YES: 'hover:border-chain-green/50 hover:bg-chain-green/10', NO: 'hover:border-red-500/50 hover:bg-red-500/10', ABSTAIN: 'hover:border-white/30 hover:bg-white/5' };
                  const Icon = icons[choice];
                  return (
                    <button key={choice} onClick={() => setPendingChoice(choice)}
                      className={`w-full flex items-center gap-3 border border-white/10 text-white/60 rounded-lg px-4 py-3 transition-all text-sm font-medium ${colors[choice]}`}>
                      <Icon className="w-4 h-4" /> {labels[choice]}
                    </button>
                  );
                })}

                {!votedChoice && pendingChoice && (() => {
                  const icons = { YES: ThumbsUp, NO: ThumbsDown, ABSTAIN: Minus };
                  const labels: Record<string, string> = { YES: 'A favor', NO: 'En contra', ABSTAIN: 'Abstención' };
                  const accent: Record<string, string> = {
                    YES: 'border-chain-green/40 bg-chain-green/10 text-chain-green',
                    NO: 'border-red-500/40 bg-red-500/10 text-red-400',
                    ABSTAIN: 'border-white/20 bg-white/5 text-white/60',
                  };
                  const Icon = icons[pendingChoice as 'YES' | 'NO' | 'ABSTAIN'];
                  return (
                    <div className="space-y-3">
                      <p className="text-white/40 text-xs text-center">Confirma tu voto antes de enviarlo</p>
                      <div className={`rounded-xl border px-4 py-4 flex items-center gap-3 ${accent[pendingChoice]}`}>
                        <Icon className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">Tu voto</p>
                          <p className="text-lg font-bold">{labels[pendingChoice]}</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 px-3 py-2.5 text-xs text-yellow-400/80 leading-relaxed">
                        <strong>Atención:</strong> Los votos son irreversibles. Una vez confirmado quedará registrado permanentemente en la blockchain.
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setPendingChoice(null)} disabled={voting}
                          className="flex-1 btn-secondary text-sm py-2 disabled:opacity-50">
                          Cancelar
                        </button>
                        <button onClick={() => handleVote(pendingChoice)} disabled={voting}
                          className="flex-1 btn-primary text-sm py-2 disabled:opacity-50">
                          {voting ? 'Registrando...' : 'Confirmar voto'}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {voteError && <p className="text-red-400 text-xs mt-2">{voteError}</p>}
                {totalVotes > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-white/50">
                    <div className="flex justify-between"><span>A favor</span><span className="text-chain-green">{yesVotes} ({yesPercent}%)</span></div>
                    <div className="flex justify-between"><span>En contra</span><span className="text-red-400">{noVotes} ({noPercent}%)</span></div>
                    <div className="flex justify-between"><span>Abstención</span><span>{abstainVotes}</span></div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-2">
                      <div className="h-full bg-chain-green rounded-full" style={{ width: `${yesPercent}%` }} />
                    </div>
                    <p className="text-center pt-1">{totalVotes} / {proposal.threshold} votos mínimos</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Lock className="w-6 h-6 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">
                  {proposal.status === 'PENDING_REVIEW' ? 'La votación se abrirá cuando la propuesta sea revisada y activada.'
                    : proposal.status === 'ACTIVE' ? 'La votación aún no ha comenzado.'
                    : 'La votación ha finalizado.'}
                </p>
              </div>
            )}
          </div>

          {/* Blockchain */}
          <div className="card">
            <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider mb-3">Registro blockchain</h2>
            <div className="flex items-start gap-2">
              <Link2 className="w-3.5 h-3.5 text-chain-blue mt-0.5 shrink-0" />
              <span className="font-mono text-chain-blue text-xs break-all">{proposal.blockHash}</span>
            </div>
            <p className="text-white/30 text-xs mt-2">Prueba criptográfica de que esta propuesta es inmutable en la cadena de bloques.</p>
          </div>

          {/* Administración — solo mods/admins */}
          {(user?.role === 'MODERATOR' || user?.role === 'ADMIN') && (
            <div className="card border-chain-purple/20">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-chain-purple" />
                <h2 className="font-semibold text-chain-purple text-sm uppercase tracking-wider">Moderación</h2>
              </div>
              <p className="text-white/40 text-xs mb-4">
                Estado actual: <span className={`font-medium ${STATUS_COLORS[proposal.status].split(' ')[1]}`}>{STATUS_LABELS[proposal.status]}</span>
              </p>
              <div className="space-y-2">
                {(['PENDING_REVIEW', 'ACTIVE', 'VOTING', 'APPROVED', 'REJECTED', 'EXPIRED'] as const)
                  .filter(s => s !== proposal.status)
                  .map(s => {
                    const colors: Record<string, string> = {
                      PENDING_REVIEW: 'hover:border-yellow-500/40 hover:text-yellow-400',
                      ACTIVE: 'hover:border-chain-green/40 hover:text-chain-green',
                      VOTING: 'hover:border-chain-blue/40 hover:text-chain-blue',
                      APPROVED: 'hover:border-chain-green/40 hover:text-chain-green',
                      REJECTED: 'hover:border-red-500/40 hover:text-red-400',
                      EXPIRED: 'hover:border-white/20 hover:text-white/40',
                    };
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={changingStatus}
                        className={`w-full text-left px-3 py-2 rounded-lg border border-white/10 text-white/40 text-sm transition-all disabled:opacity-50 ${colors[s]}`}
                      >
                        {changingStatus ? 'Actualizando...' : `→ ${STATUS_LABELS[s]}`}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
