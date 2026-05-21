'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThumbsUp, ThumbsDown, Reply, Trash2, ShieldX, AlertTriangle, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';

interface Reaction { type: 'LIKE' | 'DISLIKE'; userId: string; }

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  isDeleted: boolean;
  parentId: string | null;
  user: { id: string; username: string; displayName: string; walletAddress: string; role: string };
  reactions: Reaction[];
  _count: { replies: number };
  replies?: CommentData[];
}

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'ahora mismo';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} días`;
}

function CommentItem({
  comment, proposalId, currentUserId, currentUserRole, onUpdate,
}: {
  comment: CommentData;
  proposalId: string;
  currentUserId: string | undefined;
  currentUserRole: string | undefined;
  onUpdate: () => void;
}) {
  const router = useRouter();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const likes = comment.reactions.filter(r => r.type === 'LIKE').length;
  const dislikes = comment.reactions.filter(r => r.type === 'DISLIKE').length;
  const myReaction = comment.reactions.find(r => r.userId === currentUserId)?.type;
  const isMod = currentUserRole === 'MODERATOR' || currentUserRole === 'ADMIN';
  const isOwn = comment.user.id === currentUserId;

  async function react(type: 'LIKE' | 'DISLIKE') {
    if (!currentUserId) { router.push('/auth/login'); return; }
    await api.post(`/proposals/${proposalId}/comments/${comment.id}/react`, { type });
    onUpdate();
  }

  async function remove() {
    await api.delete(`/proposals/${proposalId}/comments/${comment.id}`);
    onUpdate();
  }

  async function ban() {
    if (!confirm('¿Suspender a este usuario? No podrá comentar más.')) return;
    await api.post(`/proposals/${proposalId}/comments/${comment.id}/ban`);
    onUpdate();
  }

  async function submitReply() {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/proposals/${proposalId}/comments`, { content: replyText, parentId: comment.id });
      setReplyText('');
      setReplyOpen(false);
      onUpdate();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`${comment.parentId ? 'ml-8 border-l border-white/10 pl-4' : ''}`}>
      <div className="py-4">
        {comment.isDeleted ? (
          <p className="text-white/20 text-sm italic">[Comentario eliminado]</p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm text-white/80">{comment.user.displayName || comment.user.username}</span>
              {(comment.user.role === 'MODERATOR' || comment.user.role === 'ADMIN') && (
                <span className="text-xs bg-chain-purple/20 text-chain-purple border border-chain-purple/30 rounded-full px-2 py-0.5">Moderador</span>
              )}
              <span className="text-white/30 text-xs">{timeAgo(comment.createdAt)}</span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{comment.content}</p>

            <div className="flex items-center gap-4 text-xs text-white/40">
              <button onClick={() => react('LIKE')} className={`flex items-center gap-1 hover:text-chain-green transition-colors ${myReaction === 'LIKE' ? 'text-chain-green' : ''}`}>
                <ThumbsUp className="w-3.5 h-3.5" /> {likes}
              </button>
              <button onClick={() => react('DISLIKE')} className={`flex items-center gap-1 hover:text-red-400 transition-colors ${myReaction === 'DISLIKE' ? 'text-red-400' : ''}`}>
                <ThumbsDown className="w-3.5 h-3.5" /> {dislikes}
              </button>
              {!comment.parentId && currentUserId && (
                <button onClick={() => setReplyOpen(!replyOpen)} className="flex items-center gap-1 hover:text-white transition-colors">
                  <Reply className="w-3.5 h-3.5" /> Responder
                </button>
              )}
              {(isOwn || isMod) && (
                <button onClick={remove} className="flex items-center gap-1 hover:text-red-400 transition-colors ml-auto">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              {isMod && !isOwn && (
                <button onClick={ban} className="flex items-center gap-1 hover:text-red-500 transition-colors text-red-400/60">
                  <ShieldX className="w-3.5 h-3.5" /> Suspender
                </button>
              )}
            </div>

            {replyOpen && (
              <div className="mt-3 flex gap-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={2}
                  placeholder="Escribe tu respuesta..."
                  className="input text-sm resize-none flex-1"
                  maxLength={1000}
                />
                <button onClick={submitReply} disabled={submitting || !replyText.trim()} className="btn-primary px-3 py-2 self-end">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {comment.replies?.map(reply => (
        <CommentItem
          key={reply.id}
          comment={reply}
          proposalId={proposalId}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export function CommentsSection({ proposalId, comments, onUpdate }: {
  proposalId: string;
  comments: CommentData[];
  onUpdate: () => void;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!user) { router.push('/auth/login'); return; }
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/proposals/${proposalId}/comments`, { content: text });
      setText('');
      onUpdate();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Error al publicar el comentario');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Aviso de convivencia */}
      <div className="flex items-start gap-3 bg-brand-gold/5 border border-brand-gold/20 rounded-xl px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
        <p className="text-white/50 text-xs leading-relaxed">
          <span className="text-white/70 font-medium">Norma de convivencia:</span> Aquí debatimos y construimos juntos, seas del pensamiento que seas. Puedes estar en total desacuerdo, pero los argumentos deben ser respetuosos. Las faltas de respeto, insultos o ataques personales resultarán en la <span className="text-red-400">pérdida inmediata del derecho a comentar</span>. Venimos a debatir y a construir, no a destruir.
        </p>
      </div>

      {/* Formulario nuevo comentario */}
      {user ? (
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              placeholder="Comparte tu opinión de forma constructiva..."
              className="input resize-none text-sm"
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${text.length > 900 ? 'text-yellow-400' : 'text-white/30'}`}>{text.length}/1000</span>
              <button onClick={submit} disabled={submitting || !text.trim()} className="btn-primary text-sm py-1.5 px-4 flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Publicando...' : 'Comentar'}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        </div>
      ) : (
        <button onClick={() => router.push('/auth/login')} className="w-full py-3 border border-white/10 rounded-lg text-white/40 text-sm hover:border-white/20 hover:text-white/60 transition-colors">
          Inicia sesión para comentar
        </button>
      )}

      {/* Lista de comentarios */}
      {comments.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-6">Sé el primero en comentar.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              proposalId={proposalId}
              currentUserId={user?.id}
              currentUserRole={user?.role}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
