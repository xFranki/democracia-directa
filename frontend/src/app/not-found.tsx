'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Shield } from 'lucide-react';

export default function NotFound() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      logout().then(() => router.replace('/'));
    } else {
      router.replace('/');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Shield className="w-10 h-10 text-white/20 mx-auto mb-4" />
        <p className="text-white/40">Redirigiendo...</p>
      </div>
    </div>
  );
}
