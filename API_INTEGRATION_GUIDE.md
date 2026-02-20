# 📋 API Integration Guide - Servicios para Endpoints Reales

## 🎯 Descripción

Tu aplicación ahora está configurada para trabajar con una API profesional de gestión de citas. Los servicios han sido actualizados para soportar todos los endpoints listados:

---

## 🔐 Autenticación

### Endpoints
- `POST /auth/login` - Login con usuario y contraseña
- `POST /auth/refresh` - Renovar token de acceso
- `GET /auth/me` - Obtener datos del usuario actual

### Servicio: `authService`

```typescript
import { authService } from '@/services/authService';

// Login
const response = await authService.login({
  username: 'empleado@company.com',
  password: 'password123'
});

// Refresh token automático (se hace automáticamente en fetchWithAuth)
const newToken = await authService.refreshToken();

// Obtener datos del usuario actual
const userData = await authService.getMe();

// Logout
authService.logout();

// Verificar si está autenticado
const isAuth = authService.isAuthenticated();
```

---

## 👥 Gestión de Usuarios

### Endpoints
- `GET /users` - Listar todos los usuarios
- `POST /users` - Crear nuevo usuario
- `GET /users/{id}` - Obtener usuario específico
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

### Servicio: `userService`

```typescript
import { userService } from '@/services/userService';

// Listar usuarios
const users = await userService.listUsers();

// Listar usuarios por rol
const employees = await userService.listUsers({ role: 'employee' });

// Obtener usuario específico
const user = await userService.getUser('user_id');

// Crear nuevo usuario
const newUser = await userService.createUser({
  username: 'newemployee@company.com',
  email: 'newemployee@company.com',
  password: 'password123',
  name: 'New Employee',
  role: 'employee'
});

// Actualizar usuario
const updated = await userService.updateUser('user_id', {
  name: 'Updated Name',
  email: 'newemail@company.com'
});

// Obtener perfil del usuario actual
const profile = await userService.getProfile();

// Actualizar perfil del usuario actual
const updatedProfile = await userService.updateProfile({
  name: 'My New Name'
});

// Eliminar usuario
await userService.deleteUser('user_id');
```

---

## 👤 Gestión de Clientes

### Endpoints
- `GET /clients` - Listar todos los clientes
- `POST /clients` - Crear nuevo cliente
- `GET /clients/{client_id}` - Obtener cliente específico
- `PUT /clients/{client_id}` - Actualizar cliente (no está en la lista pero es común)
- `DELETE /clients/{client_id}` - Eliminar cliente (no está en la lista pero es común)

### Servicio: `clientService`

```typescript
import { clientService } from '@/services/clientService';

// Listar clientes
const clients = await clientService.listClients();

// Obtener cliente específico
const client = await clientService.getClient('client_id');

// Crear nuevo cliente
const newClient = await clientService.createClient({
  name: 'Juan García',
  email: 'juan@example.com',
  phone: '+34 612 345 678'
});

// Actualizar cliente
const updated = await clientService.updateClient('client_id', {
  name: 'Juan García Pérez',
  phone: '+34 612 345 679'
});

// Eliminar cliente
await clientService.deleteClient('client_id');
```

---

## 📅 Gestión de Citas

### Endpoints
- `GET /appointments` - Listar citas
- `POST /appointments` - Crear cita
- `GET /appointments/{appointment_id}` - Obtener cita específica
- `POST /appointments/{appointment_id}/cancel` - Cancelar cita
- `GET /availability` - Obtener disponibilidad

### Servicio: `appointmentService`

```typescript
import { appointmentService } from '@/services/appointmentService';

// Listar citas
const appointments = await appointmentService.listAppointments();

// Listar citas filtradas
const pendingAppointments = await appointmentService.listAppointments({
  status: 'scheduled',
  clientId: 'client_id'
});

// Obtener cita específica
const appointment = await appointmentService.getAppointment('appointment_id');

// Crear cita
const newAppointment = await appointmentService.createAppointment({
  client_id: 'client_id',
  date: '2026-02-25',
  time: '14:30',
  notes: 'Primera consulta'
});

// Cancelar cita
const cancelled = await appointmentService.cancelAppointment('appointment_id');

// Obtener disponibilidad
const availability = await appointmentService.getAvailability({
  date: '2026-02-25',
  duration: 30 // minutos
});
```

---

## 📧 Confirmaciones de Citas

### Endpoints
- `POST /appointments/{appointment_id}/confirmations` - Enviar confirmación
- `GET /appointments/{appointment_id}/confirmations` - Listar confirmaciones
- `GET /public/confirmations/{token}` - Obtener confirmación por token (público)
- `POST /public/confirmations/{token}/confirm` - Confirmar cita por token (público)
- `POST /public/confirmations/otp/verify` - Verificar OTP (público)

### Servicio: `appointmentService`

```typescript
import { appointmentService } from '@/services/appointmentService';

// Enviar confirmación por email o WhatsApp
const confirmation = await appointmentService.sendConfirmation(
  'appointment_id',
  'email' // o 'whatsapp'
);

// Listar confirmaciones de una cita
const confirmations = await appointmentService.listConfirmations('appointment_id');

// ===== ENDPOINTS PÚBLICOS (no necesitan autenticación) =====

// Obtener confirmación por token
const confirmation = await appointmentService.getConfirmationByToken('token_xyz');

// Confirmar cita por token (cliente hace clic en link del email)
const confirmed = await appointmentService.confirmByToken('token_xyz');

// Verificar OTP después de recibir en WhatsApp
const verified = await appointmentService.verifyOtp('token_xyz', '123456');
```

---

## 🔄 Refresh Token Automático

El sistema ahora incluye **refresh token automático**:

```typescript
// Cuando el token expira (401):
// 1. Se intenta automáticamente refrescarlo con POST /auth/refresh
// 2. Si funciona, se reintenta la solicitud original
// 3. Si falla, se redirige a /auth

// Esto ocurre transparentemente en fetchWithAuth()
// No necesitas hacer nada especial en tu código
```

---

## 💡 Ejemplo de Flujo Completo

### Scenario: Empleado crea una cita para cliente y envía confirmación

```typescript
import { clientService } from '@/services/clientService';
import { appointmentService } from '@/services/appointmentService';

// 1. Crear cliente si no existe
let client = await clientService.createClient({
  name: 'María López',
  email: 'maria@example.com',
  phone: '+34 612 345 678'
});

// 2. Obtener disponibilidad
const availability = await appointmentService.getAvailability({
  date: '2026-02-25',
  duration: 30
});

// 3. Crear cita
const appointment = await appointmentService.createAppointment({
  client_id: client.id,
  date: '2026-02-25',
  time: '14:30',
  notes: 'Consulta de dermatología'
});

// 4. Enviar confirmación por email
const confirmation = await appointmentService.sendConfirmation(
  appointment.id,
  'email'
);

// 5. Enviar también por WhatsApp
const whatsappConfirmation = await appointmentService.sendConfirmation(
  appointment.id,
  'whatsapp'
);

console.log('✅ Cita creada y confirmaciones enviadas');
```

---

## 🌐 Variables de Entorno

Asegúrate de configurar la URL de tu API en `.env.local`:

```
NEXT_PUBLIC_API_URL=https://tu-api.com
```

Si no está configurada, usa por defecto: `http://localhost:3000`

---

## 🚀 Usando los Servicios en Componentes

```typescript
'use client';

import { useEffect, useState } from 'react';
import { appointmentService } from '@/services/appointmentService';
import { clientService } from '@/services/clientService';

export function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {appointments.map(apt => (
        <div key={apt.id}>
          <h3>Cita {apt.id}</h3>
          <p>Fecha: {apt.date} {apt.time}</p>
          <p>Estado: {apt.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist de Configuración

- [ ] API_BASE_URL configurada en `.env.local`
- [ ] Endpoint de login funcionando
- [ ] Refresh token implementado en el backend
- [ ] Endpoints de clientes disponibles
- [ ] Endpoints de citas disponibles
- [ ] Endpoints de confirmaciones configurados
- [ ] WhatsApp webhook configurado (opcional)
- [ ] Email SMTP configurado (opcional)

---

## 🆘 Troubleshooting

### Error 401 después de login
- Verifica que el endpoint `/auth/login` retorna `access_token` y `refresh_token`
- Comprueba el formato del token (debe ser JWT)

### Token no se refresca automáticamente
- Asegúrate que `/auth/refresh` está implementado
- Verifica que acepta `refresh_token` en el body
- Comprueba que retorna nuevo `access_token`

### Clients o Appointments no se cargan
- Verifica que los endpoints existen: `/clients`, `/appointments`
- Comprueba que devuelven JSON válido
- Asegúrate que estás autenticado (token válido)

### WhatsApp no envía mensajes
- Verifica que `/webhooks/whatsapp` está configurado
- Comprueba credenciales de WhatsApp Business API
- Revisa logs de servidor

---

## 📚 Documentación Adicional

Para más detalles sobre:
- Tipos TypeScript: Ver `src/types/auth.ts`
- HTTP Service: Ver `src/services/httpService.ts`
- Auth Context: Ver `src/context/AuthContext.tsx`

