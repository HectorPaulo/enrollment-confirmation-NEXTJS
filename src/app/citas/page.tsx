'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CreateAppointmentForm } from '@/components/CreateAppointmentForm';
import { AppointmentsList } from '@/components/AppointmentsList';

export default function CitasPage() {
  return (
    <ProtectedRoute>
      <div className="flex-1 ml-64">
        <div className="p-6 space-y-6 max-w-7xl h-screen bg-gray-900">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Gestión de Citas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Crea y administra las citas de los clientes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <CreateAppointmentForm />
            </div>

            <div>
              <AppointmentsList />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

