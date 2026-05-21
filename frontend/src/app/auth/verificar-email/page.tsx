'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function VerificarEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!token) { setState('error'); return; }

    api.get(`/auth/verify-email/${token}`)
      .then(() => {
        setState('success');
        setTimeout(() => router.push('/auth/login'), 3000);
      })
      .catch(() => setState('error'));
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {state === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-chain-green mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Verificando tu email...</h1>
            <p className="text-white/40">Un momento</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-chain-green/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-chain-green" />
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Email verificado!</h1>
            <p className="text-white/50 mb-6">Tu cuenta está activa. Redirigiendo al login...</p>
            <Link href="/auth/login" className="btn-primary">Acceder ahora</Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Enlace inválido</h1>
            <p className="text-white/50 mb-6">
              El enlace ha caducado o ya fue usado. Regístrate de nuevo si es necesario.
            </p>
            <Link href="/auth/registro" className="btn-primary">Volver al registro</Link>
          </>
        )}
      </div>
    </div>
  );
}
