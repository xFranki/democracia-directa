'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { FileText, Lock, Link2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';

const schema = z.object({
  title: z.string().min(10, 'Mínimo 10 caracteres').max(200, 'Máximo 200 caracteres'),
  summary: z.string().min(50, 'Mínimo 50 caracteres').max(500, 'Máximo 500 caracteres'),
  content: z.string().min(200, 'Mínimo 200 caracteres'),
  category: z.enum([
    'EDUCACION', 'SANIDAD', 'ECONOMIA', 'MEDIO_AMBIENTE',
    'JUSTICIA', 'VIVIENDA', 'TECNOLOGIA', 'CULTURA', 'DEFENSA', 'OTRO',
  ]),
  territory: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORIES = [
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

const TERRITORIES = [
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

export default function NuevaPropuestaPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/auth/login');
  }, [user, router]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { territory: 'NACIONAL' },
  });

  const titleLen = watch('title')?.length ?? 0;
  const summaryLen = watch('summary')?.length ?? 0;
  const contentLen = watch('content')?.length ?? 0;

  async function onSubmit(data: FormData) {
    setServerError('');
    try {
      const { data: proposal } = await api.post('/proposals', data);
      setSubmitted(true);
      setTimeout(() => router.push(`/propuestas/${proposal.id}`), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setServerError(msg || 'Error al crear la propuesta. Inténtalo de nuevo.');
    }
  }

  if (!user) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-chain-green/20 flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-8 h-8 text-chain-green" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Propuesta registrada!</h2>
          <p className="text-white/50">Tu propuesta ha sido añadida a la cadena de bloques.</p>
          <p className="text-white/30 text-sm mt-2">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-chain-green" />
          <span className="text-chain-green text-sm font-medium">Nueva propuesta ciudadana</span>
        </div>
        <h1 className="text-4xl font-bold">Crear propuesta</h1>
        <p className="text-white/50 mt-2">
          Al publicar, tu propuesta queda registrada de forma permanente en la blockchain.
          Máximo 5 propuestas por hora.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Título */}
        <div className="card space-y-5">
          <h2 className="font-semibold text-white/80 text-sm uppercase tracking-wider">Información básica</h2>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm text-white/70">Título de la propuesta</label>
              <span className={`text-xs ${titleLen > 180 ? 'text-yellow-400' : 'text-white/30'}`}>{titleLen}/200</span>
            </div>
            <input
              {...register('title')}
              placeholder="Una propuesta clara y concisa..."
              className="input"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Categoría</label>
              <select {...register('category')} className="input">
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Ámbito territorial</label>
              <select {...register('territory')} className="input">
                {TERRITORIES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="card space-y-3">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold text-white/80 text-sm uppercase tracking-wider">Resumen</h2>
              <p className="text-white/30 text-xs mt-0.5">Descripción breve que aparece en el listado</p>
            </div>
            <span className={`text-xs self-start pt-1 ${summaryLen > 450 ? 'text-yellow-400' : 'text-white/30'}`}>{summaryLen}/500</span>
          </div>
          <textarea
            {...register('summary')}
            rows={3}
            placeholder="Resume tu propuesta en 1-3 frases. Mínimo 50 caracteres..."
            className="input resize-none"
          />
          {errors.summary && <p className="text-red-400 text-xs mt-1">{errors.summary.message}</p>}
        </div>

        {/* Contenido completo */}
        <div className="card space-y-3">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold text-white/80 text-sm uppercase tracking-wider">Desarrollo completo</h2>
              <p className="text-white/30 text-xs mt-0.5">Explica el problema, la solución y el impacto esperado</p>
            </div>
            <span className={`text-xs self-start pt-1 ${contentLen < 200 ? 'text-red-400/70' : 'text-white/30'}`}>{contentLen} / mín. 200</span>
          </div>
          <textarea
            {...register('content')}
            rows={12}
            placeholder="Desarrolla tu propuesta en detalle. Incluye el problema que resuelve, la solución que propones, cómo se implementaría y qué impacto tendría para los ciudadanos..."
            className="input resize-none"
          />
          {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
        </div>

        {/* Aviso blockchain */}
        <div className="flex items-start gap-3 bg-chain-blue/5 border border-chain-blue/20 rounded-xl px-5 py-4">
          <Lock className="w-4 h-4 text-chain-blue mt-0.5 shrink-0" />
          <p className="text-white/50 text-sm">
            Al publicar, esta propuesta se registrará de forma permanente e inmutable en la cadena de bloques.
            No podrá ser eliminada ni modificada. Revisa el contenido antes de enviar.
          </p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Registrando en blockchain...' : 'Publicar propuesta'}
          </button>
        </div>
      </form>
    </div>
  );
}
