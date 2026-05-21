'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';

const schema = z.object({
  emailOrUsername: z.string().min(1, 'Requerido'),
  password: z.string().min(1, 'Requerido'),
});

const twoFaSchema = z.object({
  token: z.string().length(6, 'El código tiene 6 dígitos'),
});

type FormData = z.infer<typeof schema>;
type TwoFaData = z.infer<typeof twoFaSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [twoFaUserId, setTwoFaUserId] = useState<string | null>(null);
  const { setAuth, fetchMe } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const twoFaForm = useForm<TwoFaData>({ resolver: zodResolver(twoFaSchema) });

  async function onSubmit(data: FormData) {
    setServerError('');
    try {
      const { data: res } = await api.post('/auth/login', data);

      if (res.requiresTwoFactor) {
        setTwoFaUserId(res.userId);
        return;
      }

      setAuth({} as never, res.accessToken);
      await fetchMe();
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setServerError(msg || 'Error al iniciar sesión');
    }
  }

  async function onTwoFa(data: TwoFaData) {
    setServerError('');
    try {
      const { data: res } = await api.post('/auth/2fa/verify', {
        userId: twoFaUserId,
        token: data.token,
      });
      setAuth({} as never, res.accessToken);
      await fetchMe();
      router.push('/dashboard');
    } catch {
      twoFaForm.setError('token', { message: 'Código incorrecto' });
    }
  }

  if (twoFaUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Shield className="w-10 h-10 text-chain-green mx-auto mb-3" />
            <h1 className="text-2xl font-bold">Doble verificación</h1>
            <p className="text-white/50 mt-2">Introduce el código de tu app autenticadora</p>
          </div>

          <form onSubmit={twoFaForm.handleSubmit(onTwoFa)} className="card space-y-5">
            <input
              {...twoFaForm.register('token')}
              placeholder="000000"
              maxLength={6}
              className="input text-center text-2xl tracking-widest font-mono"
            />
            {twoFaForm.formState.errors.token && (
              <p className="text-red-400 text-xs">{twoFaForm.formState.errors.token.message}</p>
            )}
            <button type="submit" disabled={twoFaForm.formState.isSubmitting} className="btn-primary w-full">
              Verificar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-chain-green mx-auto mb-3" />
          <h1 className="text-3xl font-bold">Accede a la red</h1>
          <p className="text-white/50 mt-2">Tu identidad ciudadana te espera</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Email o nombre de usuario</label>
            <input {...register('emailOrUsername')} className="input" placeholder="ciudadano@email.com" />
            {errors.emailOrUsername && <p className="text-red-400 text-xs mt-1">{errors.emailOrUsername.message}</p>}
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
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Accediendo...' : 'Acceder a la red'}
          </button>

          <p className="text-center text-white/40 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/registro" className="text-chain-green hover:underline">Únete ahora</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
