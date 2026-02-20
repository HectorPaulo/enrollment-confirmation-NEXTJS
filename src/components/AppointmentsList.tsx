'use client';

import { useEffect, useState } from 'react';
import { Appointment } from '@/types/auth';
import { appointmentService } from '@/services/appointmentService';

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.listAppointments();
        setAppointments(data || []);
      } catch (err) {
        console.error('Error loading appointments:', err);
        // Los datos de ejemplo ya están cargados
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        await appointmentService.cancelAppointment(appointmentId);
        setAppointments(appointments.map(a =>
          a.id === appointmentId ? { ...a, status: 'cancelled' } : a
        ));
      } catch (err) {
        alert('Error al cancelar cita: ' + (err instanceof Error ? err.message : 'Error'));
      }
    }
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin mr-2">⏳</div>
      <p className="text-gray-600 dark:text-gray-400">Cargando citas...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Mis Citas ({appointments.length})
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">No hay citas registradas</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {apt.client?.name || 'Cliente'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📅 {apt.date} ⏰ {apt.time}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estado:{' '}
                      <span
                        className={`font-semibold ${
                          apt.status === 'confirmed'
                            ? 'text-green-600 dark:text-green-400'
                            : apt.status === 'cancelled'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </p>
                    {apt.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        📝 {apt.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCancel(apt.id)}
                    disabled={apt.status === 'cancelled'}
                    className="ml-4 px-3 py-1 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white rounded text-sm font-semibold disabled:opacity-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

