# 📋 EJEMPLOS DE COMPONENTES - Sistema de Gestión de Citas

Este archivo contiene ejemplos de componentes listos para usar en tu aplicación.

## 1. Formulario para Crear Cliente

```typescript
// src/components/CreateClientForm.tsx
'use client';

import { useState } from 'react';
import { clientService } from '@/services/clientService';

export function CreateClientForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newClient = await clientService.createClient(formData);
      alert(`✅ Cliente creado: ${newClient.name}`);
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Cliente'}
      </button>
    </form>
  );
}
```

## 2. Listado de Clientes

```typescript
// src/components/ClientsList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Client } from '@/types/auth';
import { clientService } from '@/services/clientService';

export function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientService.listClients();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Nombre</th>
            <th className="border p-3 text-left">Email</th>
            <th className="border p-3 text-left">Teléfono</th>
            <th className="border p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="border p-3">{client.name}</td>
              <td className="border p-3">{client.email}</td>
              <td className="border p-3">{client.phone || '-'}</td>
              <td className="border p-3">
                <button className="text-blue-600 hover:underline">Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 3. Formulario para Crear Cita

```typescript
// src/components/CreateAppointmentForm.tsx
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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientService.listClients();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
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

    try {
      const appointment = await appointmentService.createAppointment({
        client_id: formData.client_id,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });

      // Enviar confirmaciones
      await Promise.all([
        appointmentService.sendConfirmation(appointment.id, 'email'),
        appointmentService.sendConfirmation(appointment.id, 'whatsapp'),
      ]);

      alert('✅ Cita creada y confirmaciones enviadas');
      setFormData({ client_id: '', date: '', time: '', notes: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Cargando clientes...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Cliente</label>
        <select
          value={formData.client_id}
          onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg"
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
        <label className="block text-sm font-medium">Fecha</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Hora</label>
        <input
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Notas</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
        />
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {submitting ? 'Creando...' : 'Crear Cita'}
      </button>
    </form>
  );
}
```

## 4. Listado de Citas

```typescript
// src/components/AppointmentsList.tsx
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
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
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
        alert('Error al cancelar cita');
      }
    }
  };

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-4">
      {appointments.map((apt) => (
        <div key={apt.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{apt.client?.name || 'Cliente'}</h3>
              <p className="text-sm text-gray-600">
                {apt.date} a las {apt.time}
              </p>
              <p className="text-sm text-gray-600">Estado: {apt.status}</p>
              {apt.notes && <p className="text-sm text-gray-600">Notas: {apt.notes}</p>}
            </div>
            <button
              onClick={() => handleCancel(apt.id)}
              disabled={apt.status === 'cancelled'}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 5. Página de Confirmación Pública (sin autenticación)

```typescript
// src/app/confirm/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { AppointmentConfirmation } from '@/types/auth';

export default function ConfirmationPage({
  params,
}: {
  params: { token: string };
}) {
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const fetchConfirmation = async () => {
      try {
        const data = await appointmentService.getConfirmationByToken(params.token);
        setConfirmation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Confirmación no encontrada');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmation();
  }, [params.token]);

  const handleConfirm = async () => {
    try {
      await appointmentService.confirmByToken(params.token);
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar');
    }
  };

  if (loading) return <div>Cargando confirmación...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (confirmed) return <div className="text-green-600">✅ Cita confirmada correctamente</div>;

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Confirmar Cita</h1>
      <p className="mb-4">
        Por favor confirma tu asistencia haciendo clic en el botón de abajo.
      </p>
      <button
        onClick={handleConfirm}
        className="w-full bg-green-600 text-white py-2 rounded-lg"
      >
        Confirmar Cita
      </button>
    </div>
  );
}
```

---

## Instalación de Componentes

Puedes copiar y pegar estos componentes en tu proyecto. Asegúrate de:

1. Crear la carpeta y archivo correspondiente
2. Actualizar los imports según tu estructura
3. Importar en las páginas donde quieras usarlos

Ejemplo:

```typescript
// src/app/clientes/page.tsx
import { CreateClientForm } from '@/components/CreateClientForm';
import { ClientsList } from '@/components/ClientsList';

export default function ClientesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Crear Cliente</h1>
        <CreateClientForm />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">Clientes</h1>
        <ClientsList />
      </div>
    </div>
  );
}
```

