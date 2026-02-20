# Guía Completa de Autenticación y Login

## 📋 Resumen del Proyecto

Se ha implementado un sistema completo de autenticación en una aplicación Next.js 16 con TypeScript, Tailwind CSS y React 19. El sistema incluye:

✅ Componente de login con validaciones  
✅ Manejo de tokens (access_token y refresh_token)  
✅ Contexto de autenticación global  
✅ Rutas protegidas  
✅ Servicio HTTP con autenticación automática  
✅ API mock para pruebas locales  
✅ TypeScript completo para type-safety  

---

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── auth.ts                  # Tipos de autenticación
├── services/
│   ├── authService.ts           # Servicio de login y gestión de tokens
│   └── httpService.ts           # Servicio HTTP con autenticación automática
├── context/
│   └── AuthContext.tsx          # Contexto global de autenticación
├── components/
│   ├── ProtectedRoute.tsx       # Componente protegido de rutas
│   ├── UserProfile.tsx          # Componente que muestra perfil del usuario
│   ├── dashboard/
│   │   └── dashboard.tsx
│   └── sidebar/
│       └── sidebar.tsx
├── app/
│   ├── layout.tsx               # Layout raíz con AuthProvider
│   ├── page.tsx
│   ├── auth/
│   │   ├── page.tsx             # Página de login
│   │   └── Login/
│   │       └── login.tsx        # Componente Login
│   ├── dashboard/
│   │   └── page.tsx             # Página protegida de dashboard
│   └── api/
│       └── auth/
│           └── login/
│               └── route.ts     # Ruta API de login (mock)
├── globals.css
└── page.tsx
```

---

## 🔑 Tipos de Datos

### LoginRequest
```typescript
{
  username: string;
  password: string;
}
```

### AuthResponse
```typescript
{
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    role: string;
    username: string;
  }
}
```

---

## 🚀 Cómo Usar

### 1. Iniciar la Aplicación

```bash
cd C:\Users\paulo\WebstormProjects\enrollments
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 2. Acceder al Login

- URL: `http://localhost:3000/auth`
- Usuario: `admin@local`
- Contraseña: `admin123`

### 3. Componente Login (`src/app/auth/Login/login.tsx`)

```typescript
import Login from '@/app/auth/Login/login';

export default function LoginPage() {
  return <Login />;
}
```

**Características:**
- Formulario con campos username y password
- Validaciones en el lado del cliente
- Manejo de estados (loading, error)
- Toggle para mostrar/ocultar contraseña
- Redirección automática a `/dashboard` tras login exitoso

---

## 🔐 Servicio de Autenticación

### `src/services/authService.ts`

```typescript
// Login
const response = await authService.login({
  username: "admin@local",
  password: "admin123"
});

// Obtener token
const token = authService.getAccessToken();

// Obtener datos del usuario
const user = authService.getUser();

// Cerrar sesión
authService.logout();

// Verificar autenticación
const isAuth = authService.isAuthenticated();
```

---

## 🌐 Contexto de Autenticación

### `src/context/AuthContext.tsx`

**En el layout raíz:**
```typescript
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Usar en componentes:**
```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Hola, {user?.username}</p>}
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

**Propiedades del contexto:**
- `user: User | null` - Datos del usuario autenticado
- `isAuthenticated: boolean` - Si el usuario está autenticado
- `isLoading: boolean` - Si aún está cargando los datos
- `logout(): void` - Función para cerrar sesión

---

## 🛡️ Rutas Protegidas

### `src/components/ProtectedRoute.tsx`

**Uso en una página:**
```typescript
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <h1>Panel de Administración</h1>
      {/* Contenido protegido */}
    </ProtectedRoute>
  );
}
```

**Comportamiento:**
- Redirige a `/auth` si no está autenticado
- Muestra un spinner de carga mientras verifica autenticación
- Solo renderiza contenido si está autenticado

---

## 🌍 Solicitudes HTTP con Autenticación

### `src/services/httpService.ts`

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/services/httpService';

// GET
const data = await apiGet('/api/users');

// POST
const result = await apiPost('/api/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT
const updated = await apiPut('/api/users/1', {
  name: 'Jane'
});

// DELETE
await apiDelete('/api/users/1');

// O usar fetchWithAuth directamente
const response = await fetchWithAuth('/api/data', {
  method: 'GET',
  includeAuth: true // Incluye token automáticamente
});
```

**Características:**
- Agrega token automáticamente a todas las solicitudes
- Manejo de errores 401 (token expirado)
- Redirección a login si el token expiró
- TypeScript completo

---

## 📡 API Mock

### `src/app/api/auth/login/route.ts`

Ruta API local para pruebas. Simula un endpoint real de autenticación.

**Solicitud:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin@local",
  "password": "admin123"
}
```

**Respuesta (200 OK):**
```json
{
  "access_token": "hJ_lkWg6d2Q5L8vaNuvmtwUmD47VK7-Wkqoy8W_EUm8",
  "refresh_token": "MTidTfZRDYu3CcN-nWs44fl3u39fvUsGZoYvowDXs0_x_ywPgVA5TQyjg8G8hBX8",
  "token_type": "bearer",
  "user": {
    "id": "usr_b52d0cdd0aca",
    "role": "sys_admin",
    "username": "admin@local"
  }
}
```

**Para conectar a tu backend real:**

Actualiza `src/services/authService.ts`:
```typescript
const API_BASE_URL = "https://tu-api-real.com";
```

O usa `.env.local`:
```
NEXT_PUBLIC_API_URL=https://tu-api-real.com
```

---

## 💾 Almacenamiento de Tokens

Los tokens se guardan en **localStorage** con las siguientes claves:
- `access_token` - Token de acceso JWT
- `refresh_token` - Token para renovar acceso
- `user` - Datos del usuario en JSON

```typescript
// Acceder a tokens manualmente
const token = localStorage.getItem('access_token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
```

**Nota:** Para mayor seguridad en producción, considera usar:
- httpOnly cookies en lugar de localStorage
- Encriptación de tokens
- CSRF protection

---

## 🎯 Ejemplo de Uso Completo

### 1. Página de Login

```typescript
// http://localhost:3000/auth
import Login from '@/app/auth/Login/login';

export default function LoginPage() {
  return <Login />;
}
```

### 2. Dashboard Protegido

```typescript
// http://localhost:3000/dashboard
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <h1>Bienvenido, {user?.username}</h1>
      {/* Contenido del dashboard */}
    </ProtectedRoute>
  );
}
```

### 3. Componente con Datos del Usuario

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <p>Usuario: {user?.username}</p>
      <p>Rol: {user?.role}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </header>
  );
}
```

---

## 🔄 Flujo de Autenticación

```
1. Usuario accede a /auth
   ↓
2. Completa formulario de login
   ↓
3. Se valida el formulario
   ↓
4. Se envía POST a /api/auth/login
   ↓
5. Backend valida credenciales
   ↓
6. Backend retorna tokens + usuario
   ↓
7. Tokens se guardan en localStorage
   ↓
8. Usuario se redirige a /dashboard
   ↓
9. Dashboard renderiza con ProtectedRoute
   ↓
10. Se verifica autenticación
    ↓
11. Se muestra contenido protegido
```

---

## ⚙️ Variables de Entorno

### `.env.local`

```
# URL base de la API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Para producción:
# NEXT_PUBLIC_API_URL=https://tu-api-real.com
```

---

## 🐛 Troubleshooting

### Login no funciona
1. Verifica que el servidor Next.js esté corriendo (`npm run dev`)
2. Verifica las credenciales (admin@local / admin123)
3. Abre la consola del navegador (F12) para ver errores

### Token no persiste
1. Verifica que localStorage no esté deshabilitado
2. Comprueba que el archivo authService.ts esté importando correctamente

### Ruta protegida no funciona
1. Asegúrate de envolver con `<ProtectedRoute>`
2. Comprueba que el `<AuthProvider>` esté en el layout raíz

---

## 📚 Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)

---

## 🎨 Personalización

### Cambiar estilos
Todos los componentes usan Tailwind CSS. Modifica las clases en:
- `src/app/auth/Login/login.tsx` - Estilos del formulario de login
- `src/components/UserProfile.tsx` - Estilos del perfil
- `src/components/ProtectedRoute.tsx` - Estilos del loader

### Cambiar colores
Los colores principales están en `src/app/globals.css` y usan Tailwind.

### Agregar campos al login
1. Actualiza el tipo `LoginRequest` en `src/types/auth.ts`
2. Agrega campos al componente Login
3. Actualiza la validación en `handleSubmit`

---

## ✅ Checklist de Implementación

- ✅ Tipos TypeScript definidos
- ✅ Servicio de autenticación
- ✅ Componente de login
- ✅ Contexto de autenticación global
- ✅ Rutas protegidas
- ✅ Servicio HTTP autenticado
- ✅ API mock para pruebas
- ✅ Almacenamiento de tokens
- ✅ Gestión de errores
- ✅ Redirecciones automáticas

---

¡Listo para usar! 🎉

