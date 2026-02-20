'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir basado en autenticación
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin mr-2">⏳</div>
        <p className="text-gray-600 dark:text-gray-400">Redirigiendo...</p>
      </div>
    </div>
  );
}
