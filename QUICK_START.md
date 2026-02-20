# 🚀 Quick Start - Sistema de Autenticación

## 1️⃣ Instalación (5 segundos)

```bash
# Navega a la carpeta del proyecto
cd C:\Users\paulo\WebstormProjects\enrollments

# Instala dependencias (si es necesario)
npm install
```

## 2️⃣ Inicia el servidor (5 segundos)

```bash
npm run dev
```

**Salida esperada:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

## 3️⃣ Accede a Login (5 segundos)

### URL: `http://localhost:3000/auth`

### Credenciales:
- **Usuario:** `admin@local`
- **Contraseña:** `admin123`

## 4️⃣ Después de Login

Serás redirigido automáticamente a: `http://localhost:3000/dashboard`

---

## 📋 Estructura Rápida

```
Sistema de Login
├── Componente: src/app/auth/Login/login.tsx
├── API: src/app/api/auth/login/route.ts (mock)
├── Servicios:
│   ├── authService.ts (login, tokens)
│   └── httpService.ts (solicitudes autenticadas)
├── Contexto: src/context/AuthContext.tsx
└── Rutas Protegidas: src/components/ProtectedRoute.tsx
```

---

## 🎯 Casos de Uso Rápidos

### Caso 1: Usar datos del usuario en un componente

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Hola, {user?.username}</p>}
    </div>
  );
}
```

### Caso 2: Proteger una página

```typescript
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <h1>Panel Admin</h1>
    </ProtectedRoute>
  );
}
```

### Caso 3: Hacer solicitud HTTP con token

```typescript
'use client';

import { apiGet, apiPost } from '@/services/httpService';

export async function fetchData() {
  // El token se agrega automáticamente
  const data = await apiGet('/api/users');
  return data;
}
```

### Caso 4: Cerrar sesión

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
}
```

---

## 🔧 Personalización Rápida

### Cambiar API Real

**Archivo:** `.env.local`

Antes:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Después:
```
NEXT_PUBLIC_API_URL=https://tu-api-real.com
```

### Cambiar Endpoint de Login

**Archivo:** `src/services/authService.ts`

```typescript
const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  // ↓ Cambiar esta ruta
  // `${API_BASE_URL}/tu-ruta-personalizada`
});
```

### Cambiar Credenciales de Prueba

**Archivo:** `src/app/api/auth/login/route.ts`

```typescript
if (body.username === 'admin@local' && body.password === 'admin123') {
  // ↓ Cambiar aquí
  // if (body.username === 'tu-usuario' && body.password === 'tu-contraseña') {
  const response: AuthResponse = {
    // ...
  };
}
```

---

## 🐛 Problemas Comunes

### ❌ "Error: fetch failed"
**Solución:** Asegúrate de que el servidor Next.js esté corriendo
```bash
npm run dev
```

### ❌ "localhost:3000 refused to connect"
**Solución:** Espera 5-10 segundos a que el servidor inicie

### ❌ "Usuario o contraseña incorrectos"
**Solución:** Usa las credenciales correctas:
- Usuario: `admin@local` (con @)
- Contraseña: `admin123`

### ❌ "Token is undefined"
**Solución:** Asegúrate de que AuthProvider esté en el layout raíz
```typescript
<AuthProvider>
  {children}
</AuthProvider>
```

---

## ✅ Checklist

- [ ] npm install ejecutado
- [ ] npm run dev corriendo
- [ ] Accediste a http://localhost:3000/auth
- [ ] Ingresaste credenciales (admin@local / admin123)
- [ ] Fuiste redirigido a /dashboard
- [ ] Ves tu usuario mostrado
- [ ] El botón "Cerrar Sesión" funciona

---

## 📚 Documentación Completa

Para más detalles:
1. **Guía Completa:** `AUTHENTICATION_GUIDE.md`
2. **Resumen:** `IMPLEMENTATION_SUMMARY.md`
3. **README Componente:** `LOGIN_COMPONENT_README.md`

---

## 🎓 Próximos Pasos

Después de que el login funcione:

1. **Conectar a tu API real**
   - Actualiza `NEXT_PUBLIC_API_URL` en `.env.local`
   - Modifica `src/app/api/auth/login/route.ts` o elimínalo

2. **Agregar más funcionalidades**
   - Registro de usuarios
   - Recuperación de contraseña
   - Actualización de perfil

3. **Avanzado**
   - Refresh token automático
   - Logout por inactividad
   - Múltiples roles/permisos

---

## 💡 Tips

- **F12** para abrir DevTools y ver errores
- **Network** tab para ver solicitudes HTTP
- **Application** tab para ver localStorage (donde se guardan tokens)
- **Console** tab para ver logs y errores

---

## 🎉 ¡Listo!

Tu sistema de autenticación está completamente funcional y listo para personalizar.

**¡Happy coding! 🚀**

