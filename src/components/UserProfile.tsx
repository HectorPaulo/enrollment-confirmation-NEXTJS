/**
 * Componente UserProfile
 * Ejemplo de cómo usar el contexto de autenticación para mostrar datos del usuario
 */

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function UserProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <p className="font-semibold text-gray-800 dark:text-white">{user.username}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{user.id}</p>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

