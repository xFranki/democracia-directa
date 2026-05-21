'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ProposalCard, type Proposal } from '@/components/proposals/ProposalCard';
import {
  User, Wallet, FileText, ThumbsUp, Star, Calendar,
  ShieldCheck, Lock,
} from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  CITIZEN: 'Ciudadano',
  MODERATOR: 'Moderador',
  ADMIN: 'Administrador',
};

const ROLE_COLORS: Record<string, string> = {
  CITIZEN: 'text-white/50 border-white/20 bg-white/5',
  MODERATOR: 'text-chain-blue border-chain-blue/30 bg-chain-blue/10',
  ADMIN: 'text-brand-gold border-brand-gold/30 bg-brand-gold/10',
};

interface UserProfile {
  username: string;
  displayName: string | null;
  walletAddress: string;
  bio: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  role: string;
  reputation: number;
  createdAt: string;
  _count: { proposals: number; votes: number };
  proposals: (Proposal & { author?: never })[];
}

function AvatarPlaceholder({ username }: { username: string }) {
  const initials = username.slice(0, 2).toUpperCase();
  const colors = [
    'from-chain-blue to-chain-purple',
    'from-chain-green to-chain-blue',
    'from-brand-gold to-orange-500',
    'from-chain-purple to-pink-500',
  ];
  const color = colors[username.charCodeAt(0) % colors.length];
  return (
    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-2xl shrink-0`}>
      {initials}
    </div>
  );
}

export default function PerfilPage() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/users/${username}`)
      .then(({ data }) => setUser(data))
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar el perfil'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="card animate-pulse h-40" />
        <div className="card animate-pulse h-24" />
        <div className="grid sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Usuario no encontrado</h2>
        <p className="text-white/40 text-sm">No existe ningún usuario con ese nombre.</p>
      </div>
    );
  }

  if (!user) return null;

  const joinedDate = new Date(user.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const proposalsWithAuthor = user.proposals.map(p => ({
    ...p,
    author: {
      username: user.username,
      displayName: user.displayName,
      isPublic: user.isPublic,
    },
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Cabecera de perfil */}
      <div className="card mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          {user.username
            ? <AvatarPlaceholder username={user.username} />
            : (
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Lock className="w-8 h-8 text-white/20" />
              </div>
            )
          }

          <div className="flex-1 min-w-0">
            {user.username ? (
              <>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
                  <span className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${ROLE_COLORS[user.role] || ROLE_COLORS.CITIZEN}`}>
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                  {user.reputation > 0 && (
                    <span className="flex items-center gap-1 text-xs text-brand-gold border border-brand-gold/30 bg-brand-gold/10 rounded-full px-2.5 py-0.5">
                      <Star className="w-3 h-3" />
                      {user.reputation} reputación
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-sm mb-3">@{user.username}</p>
                {user.bio && (
                  <p className="text-white/70 text-sm mb-3 max-w-xl">{user.bio}</p>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl font-semibold text-white/50">Perfil privado</h1>
                  <Lock className="w-4 h-4 text-white/30" />
                </div>
                <p className="text-white/30 text-sm mb-3">
                  Este ciudadano ha configurado su perfil como privado. Su identidad en la cadena sí es pública.
                </p>
              </>
            )}

            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Wallet className="w-3.5 h-3.5 text-chain-blue/60" />
              <span className="font-mono text-chain-blue/60 truncate">{user.walletAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <FileText className="w-5 h-5 text-chain-green mx-auto mb-2" />
          <p className="text-2xl font-bold">{user._count.proposals}</p>
          <p className="text-white/40 text-xs mt-1">Propuestas</p>
        </div>
        <div className="card text-center">
          <ThumbsUp className="w-5 h-5 text-chain-purple mx-auto mb-2" />
          <p className="text-2xl font-bold">{user._count.votes}</p>
          <p className="text-white/40 text-xs mt-1">Votos emitidos</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-5 h-5 text-white/30 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white/70 mt-1">{joinedDate}</p>
          <p className="text-white/40 text-xs mt-1">Miembro desde</p>
        </div>
      </div>

      {/* Propuestas del usuario */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="w-4 h-4 text-chain-green" />
          <h2 className="font-semibold">
            {user.username
              ? `Propuestas de ${user.displayName || user.username}`
              : 'Actividad en la cadena'
            }
          </h2>
          <span className="text-white/30 text-sm">({user.proposals.length})</span>
        </div>

        {!user.username && (
          <div className="flex items-center gap-2 text-xs text-white/30 mb-4 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            Ciudadano anónimo — las propuestas son actos públicos registrados en la cadena independientemente de la privacidad del perfil.
          </div>
        )}

        {user.proposals.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Este ciudadano aún no ha presentado propuestas.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {proposalsWithAuthor.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
