'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateClientForm } from '@/components/CreateClientForm';
import { ClientsList } from '@/components/ClientsList';

export default function ClientesPage() {
  return (
    <ProtectedRoute>
      <div className="flex-1 ml-64 bg-gray-50 dark:bg-gray-900 h-screen">
        <div className="p-6 space-y-6 max-w-7xl bg-gray-900">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Clientes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Administra la lista de clientes y crea nuevos registros
            </p>
          </div>

          <div className="grid md:grid-rows-2 gap-6">
            <div>
              <ClientsList />
            </div>

            <div>
              <CreateClientForm />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

