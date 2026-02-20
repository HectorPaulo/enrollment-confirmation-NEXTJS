'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8 transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Bienvenido, {user?.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Panel de control principal</p>
          </div>

          {/* User Profile Card */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Tu Perfil</h2>
            <UserProfile />
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Card 1</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contenido del dashboard. Puedes personalizarlo según necesites.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Card 2</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Todas las rutas se protegen con autenticación.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Card 3</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                El usuario será redirigido a login si no está autenticado.
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-4">Información del Usuario</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">ID de Usuario:</p>
                <p className="text-gray-700 dark:text-gray-300">{user?.id}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Rol:</p>
                <p className="text-gray-700 dark:text-gray-300">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Usuario:</p>
                <p className="text-gray-700 dark:text-gray-300">{user?.username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

