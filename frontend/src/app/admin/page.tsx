'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { api } from '@/lib/api';
import {
  Shield, Users, FileText, ThumbsUp, MessageSquare, Search, X,
  ChevronLeft, ChevronRight, Ban, ShieldOff, ShieldCheck, Crown, User,
} from 'lucide-react';

interface Stats {
  users: number;
  proposals: number;
  votes: number;
  comments: number;
  bannedUsers: number;
}

interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: 'CITIZEN' | 'MODERATOR' | 'ADMIN';
  isVerified: boolean;
  isBanned: boolean;
  isCommentBanned: boolean;
  isPublic: boolean;
  reputation: number;
  createdAt: string;
  _count: { proposals: number; votes: number };
}

const ROLE_LABELS = { CITIZEN: 'Ciudadano', MODERATOR: 'Moderador', ADMIN: 'Admin' };
const ROLE_COLORS = {
  CITIZEN: 'text-white/50 border-white/20 bg-white/5',
  MODERATOR: 'text-chain-blue border-chain-blue/30 bg-chain-blue/10',
  ADMIN: 'text-brand-gold border-brand-gold/30 bg-brand-gold/10',
};

const ROLES: AdminUser['role'][] = ['CITIZEN', 'MODERATOR', 'ADMIN'];

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    if (user.role !== 'ADMIN') { router.replace('/'); return; }
  }, [user, router]);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (search) params.search = search;
    try {
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function changeRole(userId: string, role: AdminUser['role']) {
    setActionLoading(`role-${userId}`);
    try {
      const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: data.role } : u));
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleBan(userId: string) {
    setActionLoading(`ban-${userId}`);
    try {
      const { data } = await api.patch(`/admin/users/${userId}/ban`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: data.isBanned } : u));
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleCommentBan(userId: string) {
    setActionLoading(`cban-${userId}`);
    try {
      const { data } = await api.patch(`/admin/users/${userId}/comment-ban`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isCommentBanned: data.isCommentBanned } : u));
    } finally {
      setActionLoading(null);
    }
  }

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Cabecera */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-brand-gold" />
          <h1 className="text-4xl font-bold">Panel de administración</h1>
        </div>
        <p className="text-white/40 text-sm">Gestión de usuarios, roles y moderación de la plataforma.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          <div className="card text-center">
            <Users className="w-5 h-5 text-chain-blue mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.users}</p>
            <p className="text-white/40 text-xs mt-1">Usuarios</p>
          </div>
          <div className="card text-center">
            <FileText className="w-5 h-5 text-chain-green mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.proposals}</p>
            <p className="text-white/40 text-xs mt-1">Propuestas</p>
          </div>
          <div className="card text-center">
            <ThumbsUp className="w-5 h-5 text-chain-purple mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.votes}</p>
            <p className="text-white/40 text-xs mt-1">Votos</p>
          </div>
          <div className="card text-center">
            <MessageSquare className="w-5 h-5 text-white/40 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.comments}</p>
            <p className="text-white/40 text-xs mt-1">Comentarios</p>
          </div>
          <div className="card text-center">
            <Ban className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.bannedUsers}</p>
            <p className="text-white/40 text-xs mt-1">Baneados</p>
          </div>
        </div>
      )}

      {/* Buscador */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Buscar por usuario, email o nombre..."
          className="input pl-9 pr-9 w-full"
        />
        {searchInput && (
          <button onClick={() => { setSearchInput(''); setSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabla de usuarios */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-semibold text-sm text-white/70 uppercase tracking-wider">
            Usuarios {!loading && <span className="text-white/30 font-normal">({total})</span>}
          </h2>
        </div>

        {loading ? (
          <div className="divide-y divide-white/5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 animate-pulse flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-32" />
                  <div className="h-3 bg-white/5 rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <User className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No se encontraron usuarios.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map(u => (
              <div key={u.id} className={`px-5 py-4 flex flex-wrap items-center gap-4 ${u.isBanned ? 'bg-red-500/5' : ''}`}>

                {/* Avatar + info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    u.role === 'ADMIN' ? 'bg-brand-gold/20 text-brand-gold' :
                    u.role === 'MODERATOR' ? 'bg-chain-blue/20 text-chain-blue' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{u.displayName}</span>
                      <span className="text-white/30 text-xs">@{u.username}</span>
                      <span className={`text-xs border rounded-full px-2 py-0.5 ${ROLE_COLORS[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </span>
                      {u.isBanned && <span className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 rounded-full px-2 py-0.5">Baneado</span>}
                      {u.isCommentBanned && <span className="text-xs text-orange-400 border border-orange-400/30 bg-orange-400/10 rounded-full px-2 py-0.5">Sin comentarios</span>}
                    </div>
                    <p className="text-white/30 text-xs mt-0.5">{u.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-white/30 shrink-0">
                  <span>{u._count.proposals} prop.</span>
                  <span>{u._count.votes} votos</span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Cambiar rol */}
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value as AdminUser['role'])}
                    disabled={actionLoading === `role-${u.id}` || u.id === user.id}
                    className="input py-1 text-xs min-w-[120px] disabled:opacity-40"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>

                  {/* Ban comentarios */}
                  <button
                    onClick={() => toggleCommentBan(u.id)}
                    disabled={actionLoading === `cban-${u.id}` || u.id === user.id}
                    title={u.isCommentBanned ? 'Permitir comentarios' : 'Vedar comentarios'}
                    className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
                      u.isCommentBanned
                        ? 'border-orange-400/30 bg-orange-400/10 text-orange-400 hover:bg-orange-400/20'
                        : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>

                  {/* Ban plataforma */}
                  <button
                    onClick={() => toggleBan(u.id)}
                    disabled={actionLoading === `ban-${u.id}` || u.id === user.id}
                    title={u.isBanned ? 'Desbanear usuario' : 'Banear usuario'}
                    className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
                      u.isBanned
                        ? 'border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20'
                        : 'border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
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

    </div>
  );
}
