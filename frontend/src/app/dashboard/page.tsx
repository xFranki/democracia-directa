'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { api } from '@/lib/api';
import { Shield, FileText, ThumbsUp, Plus, Link2, CheckCircle2, Clock, Bookmark, MapPin, MessageSquare, Eye, EyeOff } from 'lucide-react';

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
  PENDING_REVIEW: 'text-yellow-400', ACTIVE: 'text-chain-green',
  VOTING: 'text-chain-blue', APPROVED: 'text-chain-green',
  REJECTED: 'text-red-400', EXPIRED: 'text-white/30',
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

interface SavedProposal {
  id: string;
  title: string;
  summary: string;
  category: string;
  territory: string;
  status: string;
  createdAt: string;
  author: { username: string; displayName: string; isPublic: boolean };
  _count: { votes: number; comments: number };
}

export default function DashboardPage() {
  const { user, setAuth } = useAuthStore();
  const router = useRouter();
  const [favorites, setFavorites] = useState<SavedProposal[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [togglingPrivacy, setTogglingPrivacy] = useState(false);

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    api.get('/users/me/favorites')
      .then(({ data }) => setFavorites(data))
      .finally(() => setLoadingFavs(false));
  }, [user, router]);

  async function togglePrivacy() {
    if (!user) return;
    setTogglingPrivacy(true);
    try {
      await api.patch('/users/me', { isPublic: !user.isPublic });
      await useAuthStore.getState().fetchMe();
    } finally {
      setTogglingPrivacy(false);
    }
  }

  if (!user) return null;

  const joinedDate = new Date(user.createdAt ?? '').toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Bienvenida */}
      <div className="mb-10">
        <p className="text-white/40 text-sm mb-1">Bienvenido de vuelta</p>
        <h1 className="text-4xl font-bold">{user.displayName || user.username}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Link2 className="w-3.5 h-3.5 text-chain-blue" />
          <span className="font-mono text-chain-blue text-sm">{user.walletAddress}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="card text-center">
          <FileText className="w-6 h-6 text-chain-green mx-auto mb-2" />
          <p className="text-3xl font-bold">{user._count?.proposals ?? 0}</p>
          <p className="text-white/40 text-sm mt-1">Propuestas</p>
        </div>
        <div className="card text-center">
          <ThumbsUp className="w-6 h-6 text-chain-blue mx-auto mb-2" />
          <p className="text-3xl font-bold">{user._count?.votes ?? 0}</p>
          <p className="text-white/40 text-sm mt-1">Votos emitidos</p>
        </div>
        <div className="card text-center">
          <Bookmark className="w-6 h-6 text-brand-gold mx-auto mb-2" />
          <p className="text-3xl font-bold">{favorites.length}</p>
          <p className="text-white/40 text-sm mt-1">Guardadas</p>
        </div>
        <div className="card text-center">
          <Shield className="w-6 h-6 text-chain-purple mx-auto mb-2" />
          <p className="text-3xl font-bold">{user.reputation ?? 0}</p>
          <p className="text-white/40 text-sm mt-1">Reputación</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <Link href="/propuestas/nueva" className="card flex items-start gap-4 hover:border-chain-green/40 group">
          <div className="w-10 h-10 rounded-lg bg-chain-green/20 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5 text-chain-green" />
          </div>
          <div>
            <p className="font-semibold group-hover:text-chain-green transition-colors">Nueva propuesta</p>
            <p className="text-white/40 text-sm mt-0.5">Registra una propuesta en la blockchain</p>
          </div>
        </Link>
        <Link href="/propuestas" className="card flex items-start gap-4 hover:border-chain-blue/40 group">
          <div className="w-10 h-10 rounded-lg bg-chain-blue/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-chain-blue" />
          </div>
          <div>
            <p className="font-semibold group-hover:text-chain-blue transition-colors">Ver propuestas</p>
            <p className="text-white/40 text-sm mt-0.5">Explora y vota las propuestas activas</p>
          </div>
        </Link>
      </div>

      {/* Propuestas guardadas */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Bookmark className="w-5 h-5 text-brand-gold" />
          <h2 className="text-xl font-bold">Propuestas guardadas</h2>
          <span className="text-white/30 text-sm">({favorites.length})</span>
        </div>

        {loadingFavs ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="card animate-pulse h-36 bg-brand-surface/50" />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="card text-center py-10">
            <Bookmark className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Aún no has guardado ninguna propuesta.</p>
            <Link href="/propuestas" className="btn-secondary text-sm inline-flex mt-4">
              Explorar propuestas
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {favorites.map(p => (
              <Link key={p.id} href={`/propuestas/${p.id}`} className="card flex flex-col gap-3 hover:border-brand-gold/30 group">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-white/40 border border-white/10 rounded-full px-2.5 py-0.5">
                    {CATEGORY_LABELS[p.category]}
                  </span>
                  <span className={`text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </div>

                <h3 className="font-semibold text-white group-hover:text-brand-gold transition-colors line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-white/40 text-sm line-clamp-2">{p.summary}</p>

                <div className="mt-auto pt-3 border-t border-white/10 flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />{p._count.votes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />{p._count.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{TERRITORY_LABELS[p.territory]}
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Clock className="w-3 h-3" />
                    {new Date(p.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Estado de cuenta */}
      <div className="card">
        <h2 className="font-semibold text-white/70 text-sm uppercase tracking-wider mb-4">Estado de cuenta</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/50 text-sm">Email verificado</span>
            {user.isVerified ? (
              <span className="flex items-center gap-1.5 text-chain-green text-sm"><CheckCircle2 className="w-4 h-4" /> Verificado</span>
            ) : (
              <span className="text-yellow-400 text-sm">Pendiente</span>
            )}
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/50 text-sm">Doble factor (2FA)</span>
            {user.twoFactorEnabled ? (
              <span className="flex items-center gap-1.5 text-chain-green text-sm"><CheckCircle2 className="w-4 h-4" /> Activo</span>
            ) : (
              <span className="text-white/30 text-sm">No configurado</span>
            )}
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/50 text-sm">Miembro desde</span>
            <span className="text-white/60 text-sm">{joinedDate}</span>
          </div>
          <div className="flex items-start justify-between gap-4 py-2 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white/50 text-sm">Visibilidad del perfil</span>
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                  user.isPublic
                    ? 'border-chain-green/30 bg-chain-green/10 text-chain-green'
                    : 'border-white/20 bg-white/5 text-white/40'
                }`}>
                  {user.isPublic ? <><Eye className="w-3 h-3" /> Público</> : <><EyeOff className="w-3 h-3" /> Privado</>}
                </span>
              </div>
              <p className="text-white/30 text-xs">
                {user.isPublic
                  ? 'Tu nombre y actividad son visibles para todos.'
                  : 'Solo se muestra tu wallet. Tu actividad en la cadena sigue siendo pública.'
                }
              </p>
            </div>
            <button
              onClick={togglePrivacy}
              disabled={togglingPrivacy}
              className="btn-secondary text-xs py-1.5 px-3 shrink-0 disabled:opacity-50"
            >
              {togglingPrivacy
                ? 'Guardando...'
                : user.isPublic ? 'Hacer privado' : 'Hacer público'
              }
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white/50 text-sm">Rol</span>
            <span className="text-white/70 text-sm capitalize">{user.role?.toLowerCase() ?? 'ciudadano'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
