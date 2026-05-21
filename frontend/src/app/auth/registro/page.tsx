'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import clsx from 'clsx';

const schema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  displayName: z.string().max(50).optional(),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe tener al menos una minúscula')
    .regex(/\d/, 'Debe tener al menos un número')
    .regex(/[@$!%*?&]/, 'Debe tener al menos un símbolo (@$!%*?&)'),
  confirmPassword: z.string(),
  isPublic: z.boolean().default(true),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ caracteres', ok: password.length >= 8 },
    { label: 'Mayúscula', ok: /[A-Z]/.test(password) },
    { label: 'Minúscula', ok: /[a-z]/.test(password) },
    { label: 'Número', ok: /\d/.test(password) },
    { label: 'Símbolo', ok: /[@$!%*?&]/.test(password) },
  ];

  return (
    <div className="grid grid-cols-2 gap-1.5 mt-2">
      {checks.map(({ label, ok }) => (
        <div key={label} className={clsx('flex items-center gap-1.5 text-xs', ok ? 'text-chain-green' : 'text-white/30')}>
          {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          {label}
        </div>
      ))}
    </div>
  );
}

export default function RegistroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPublic: true },
  });

  const password = watch('password', '');

  async function onSubmit(data: FormData) {
    setServerError('');
    try {
      await api.post('/auth/register', {
        email: data.email,
        username: data.username,
        password: data.password,
        displayName: data.displayName,
        isPublic: data.isPublic,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setServerError(msg || 'Error al registrarse. Inténtalo de nuevo.');
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-chain-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-chain-green" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Cuenta creada</h2>
          <p className="text-white/60 mb-6">
            Revisa tu email para verificar tu cuenta y activar tu identidad ciudadana.
          </p>
          <button onClick={() => router.push('/auth/login')} className="btn-primary w-full">
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-chain-green mx-auto mb-3" />
          <h1 className="text-3xl font-bold">Crea tu identidad ciudadana</h1>
          <p className="text-white/50 mt-2">Sin partidos. Sin intermediarios. Solo tú y tu voz.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Email</label>
            <input {...register('email')} type="email" placeholder="tu@email.com" className="input" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Nombre de usuario</label>
            <input {...register('username')} placeholder="ciudadano_libre" className="input" />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Nombre visible <span className="text-white/30">(opcional)</span></label>
            <input {...register('displayName')} placeholder="Tu nombre o alias" className="input" />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Contraseña</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && <PasswordStrength password={password} />}
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Confirmar contraseña</label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className="input"
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex items-start gap-3 p-4 bg-brand-dark rounded-lg">
            <input {...register('isPublic')} type="checkbox" id="isPublic" className="mt-0.5 accent-chain-green" />
            <div>
              <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">Perfil público</label>
              <p className="text-white/40 text-xs mt-0.5">
                Tu identidad y participaciones serán visibles. Puedes cambiar esto en cualquier momento.
              </p>
            </div>
          </div>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creando identidad...' : 'Crear mi identidad ciudadana'}
          </button>

          <p className="text-center text-white/40 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-chain-green hover:underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
