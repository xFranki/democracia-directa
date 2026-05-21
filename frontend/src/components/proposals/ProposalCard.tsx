import Link from 'next/link';
import { MessageSquare, ThumbsUp, MapPin, Clock, Link2, User } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  EDUCACION: 'Educación', SANIDAD: 'Sanidad', ECONOMIA: 'Economía',
  MEDIO_AMBIENTE: 'Medio Ambiente', JUSTICIA: 'Justicia', VIVIENDA: 'Vivienda',
  TECNOLOGIA: 'Tecnología', CULTURA: 'Cultura', DEFENSA: 'Defensa', OTRO: 'Otro',
};

const CATEGORY_COLORS: Record<string, string> = {
  EDUCACION: 'bg-chain-blue/20 text-chain-blue border-chain-blue/30',
  SANIDAD: 'bg-chain-green/20 text-chain-green border-chain-green/30',
  ECONOMIA: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  MEDIO_AMBIENTE: 'bg-green-500/20 text-green-400 border-green-500/30',
  JUSTICIA: 'bg-chain-purple/20 text-chain-purple border-chain-purple/30',
  VIVIENDA: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  TECNOLOGIA: 'bg-chain-blue/20 text-chain-blue border-chain-blue/30',
  CULTURA: 'bg-chain-purple/20 text-chain-purple border-chain-purple/30',
  DEFENSA: 'bg-red-500/20 text-red-400 border-red-500/30',
  OTRO: 'bg-white/10 text-white/50 border-white/20',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_REVIEW: 'En revisión', ACTIVE: 'Activa', VOTING: 'En votación',
  APPROVED: 'Aprobada', REJECTED: 'Rechazada', EXPIRED: 'Expirada',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-500/20 text-yellow-400',
  ACTIVE: 'bg-chain-green/20 text-chain-green',
  VOTING: 'bg-chain-blue/20 text-chain-blue',
  APPROVED: 'bg-chain-green/20 text-chain-green',
  REJECTED: 'bg-red-500/20 text-red-400',
  EXPIRED: 'bg-white/10 text-white/40',
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

export interface Proposal {
  id: string;
  title: string;
  summary: string;
  category: string;
  territory: string;
  status: string;
  blockHash: string;
  createdAt: string;
  author: { username: string; displayName: string | null; isPublic: boolean };
  _count: { votes: number; comments: number };
}

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const categoryColor = CATEGORY_COLORS[proposal.category] || CATEGORY_COLORS.OTRO;
  const statusColor = STATUS_COLORS[proposal.status] || STATUS_COLORS.PENDING_REVIEW;
  const createdAgo = new Date(proposal.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link href={`/propuestas/${proposal.id}`} className="card flex flex-col gap-4 hover:border-white/30 group">
      <div className="flex items-start justify-between gap-3">
        <span className={`text-xs border rounded-full px-2.5 py-0.5 font-medium shrink-0 ${categoryColor}`}>
          {CATEGORY_LABELS[proposal.category] || proposal.category}
        </span>
        <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${statusColor}`}>
          {STATUS_LABELS[proposal.status] || proposal.status}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-white group-hover:text-chain-green transition-colors line-clamp-2 mb-2">
          {proposal.title}
        </h3>
        <p className="text-white/50 text-sm line-clamp-2">{proposal.summary}</p>
      </div>

      <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {proposal._count.votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {proposal._count.comments}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {TERRITORY_LABELS[proposal.territory] || proposal.territory}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {createdAgo}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-white/30 min-w-0">
          <Link2 className="w-3 h-3 text-chain-blue/50 shrink-0" />
          <span className="font-mono text-chain-blue/50 truncate">{proposal.blockHash.substring(0, 20)}...</span>
        </div>
        {proposal.author && (
          <Link
            href={`/perfil/${proposal.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-white/30 hover:text-white/70 transition-colors shrink-0"
          >
            <User className="w-3 h-3" />
            {proposal.author.displayName || proposal.author.username}
          </Link>
        )}
      </div>
    </Link>
  );
}
