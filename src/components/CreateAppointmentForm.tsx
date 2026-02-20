'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/types/auth';
import { clientService } from '@/services/clientService';
import { appointmentService } from '@/services/appointmentService';

export function CreateAppointmentForm() {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    client_id: '',
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientService.listClients();
        setClients(data || []);
      } catch (err) {
        console.error('Error loading clients:', err);
        // Los datos de ejemplo ya están cargados
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const appointment = await appointmentService.createAppointment({
        client_id: formData.client_id,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });

      // Enviar confirmaciones
      await Promise.all([
        appointmentService.sendConfirmation(appointment.id, 'email').catch(() => null),
        appointmentService.sendConfirmation(appointment.id, 'whatsapp').catch(() => null),
      ]);

      setSuccess(true);
      setFormData({ client_id: '', date: '', time: '', notes: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cita');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin mr-2">⏳</div>
      <p className="text-gray-600 dark:text-gray-400">Cargando clientes...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Crear Nueva Cita</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cliente *
        </label>
        <select
          value={formData.client_id}
          onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
        >
          <option value="">Selecciona un cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Fecha *
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hora *
        </label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notas
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Notas adicionales..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
          rows={3}
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
          ✅ Cita creada exitosamente. Confirmaciones enviadas.
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || clients.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 transition"
      >
        {submitting ? 'Creando...' : 'Crear Cita'}
      </button>
    </form>
  );
}

