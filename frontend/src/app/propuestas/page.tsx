'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, FileText, SlidersHorizontal, X } from 'lucide-react';
import { api } from '@/lib/api';
import { ProposalCard, type Proposal } from '@/components/proposals/ProposalCard';

const CATEGORIES = [
  { value: '', label: 'Todas las categorías' },
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'SANIDAD', label: 'Sanidad' },
  { value: 'ECONOMIA', label: 'Economía' },
  { value: 'MEDIO_AMBIENTE', label: 'Medio Ambiente' },
  { value: 'JUSTICIA', label: 'Justicia' },
  { value: 'VIVIENDA', label: 'Vivienda' },
  { value: 'TECNOLOGIA', label: 'Tecnología' },
  { value: 'CULTURA', label: 'Cultura' },
  { value: 'DEFENSA', label: 'Defensa' },
  { value: 'OTRO', label: 'Otro' },
];

const STATUSES = [
  { value: '', label: 'Cualquier estado' },
  { value: 'PENDING_REVIEW', label: 'En revisión' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'VOTING', label: 'En votación' },
  { value: 'APPROVED', label: 'Aprobadas' },
];

const TERRITORIES = [
  { value: '', label: 'Todo el territorio' },
  { value: 'NACIONAL', label: 'Nacional' },
  { value: 'ANDALUCIA', label: 'Andalucía' },
  { value: 'ARAGON', label: 'Aragón' },
  { value: 'ASTURIAS', label: 'Asturias' },
  { value: 'BALEARES', label: 'Baleares' },
  { value: 'CANARIAS', label: 'Canarias' },
  { value: 'CANTABRIA', label: 'Cantabria' },
  { value: 'CASTILLA_LA_MANCHA', label: 'Castilla-La Mancha' },
  { value: 'CASTILLA_Y_LEON', label: 'Castilla y León' },
  { value: 'CATALUNA', label: 'Cataluña' },
  { value: 'EXTREMADURA', label: 'Extremadura' },
  { value: 'GALICIA', label: 'Galicia' },
  { value: 'LA_RIOJA', label: 'La Rioja' },
  { value: 'MADRID', label: 'Madrid' },
  { value: 'MURCIA', label: 'Murcia' },
  { value: 'NAVARRA', label: 'Navarra' },
  { value: 'PAIS_VASCO', label: 'País Vasco' },
  { value: 'VALENCIA', label: 'Valencia' },
  { value: 'CEUTA', label: 'Ceuta' },
  { value: 'MELILLA', label: 'Melilla' },
];

export default function PropuestasPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [territory, setTerritory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetPage = useCallback(() => setPage(1), []);

  // Debounce del buscador
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(searchInput);
      resetPage();
    }, 350);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [searchInput, resetPage]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page) };
    if (category) params.category = category;
    if (status) params.status = status;
    if (territory) params.territory = territory;
    if (search) params.search = search;

    api.get('/proposals', { params })
      .then(({ data }) => {
        setProposals(data.proposals);
        setTotal(data.total);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [page, category, status, territory, search]);

  const hasFilters = category || status || territory || search;

  function clearAll() {
    setCategory('');
    setStatus('');
    setTerritory('');
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-chain-green" />
            <span className="text-chain-green text-sm font-medium">Propuestas ciudadanas</span>
          </div>
          <h1 className="text-4xl font-bold">Propuestas</h1>
          <p className="text-white/50 mt-2 max-w-xl">
            Todas las propuestas registradas en la cadena de bloques. Cada una es pública,
            verificable e inmutable.
          </p>
        </div>

        <Link href="/propuestas/nueva" className="btn-primary flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Nueva propuesta
        </Link>
      </div>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar propuestas por título o descripción..."
          className="input pl-9 pr-9 w-full"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(''); setSearch(''); resetPage(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="card mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex items-center gap-2 text-white/40 mr-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm">Filtrar</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40">Categoría</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); resetPage(); }}
            className="input py-1.5 text-sm min-w-[160px]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40">Estado</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); resetPage(); }}
            className="input py-1.5 text-sm min-w-[160px]"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40">Territorio</label>
          <select
            value={territory}
            onChange={(e) => { setTerritory(e.target.value); resetPage(); }}
            className="input py-1.5 text-sm min-w-[180px]"
          >
            {TERRITORIES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-4 self-end">
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-white/40 hover:text-white flex items-center gap-1">
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
          <span className="text-sm text-white/40">
            {loading ? 'Cargando...' : `${total} propuesta${total !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-52 bg-brand-surface/50" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-24">
          <Search className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No hay propuestas con estos filtros</p>
          <Link href="/propuestas/nueva" className="btn-primary inline-flex items-center gap-2 mt-6">
            <Plus className="w-4 h-4" />
            Crear la primera propuesta
          </Link>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {proposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>

          {/* Paginación */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-1.5 text-sm disabled:opacity-30"
              >
                Anterior
              </button>
              <span className="text-white/40 text-sm px-4">
                Página {page} de {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="btn-secondary px-4 py-1.5 text-sm disabled:opacity-30"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
