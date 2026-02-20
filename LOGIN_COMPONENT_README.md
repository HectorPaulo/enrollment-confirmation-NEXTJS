# Componente de Login - Documentación

## Descripción

He creado un componente completo de login para tu aplicación Next.js que maneja autenticación con solicitudes y respuestas HTTP.

## Archivos Creados/Modificados

### 1. **Tipos TypeScript** (`src/types/auth.ts`)
Define los tipos para:
- `LoginRequest`: Estructura de la solicitud (username, password)
- `AuthResponse`: Estructura de la respuesta (access_token, refresh_token, token_type, user)
- `User`: Datos del usuario autenticado
- `AuthError`: Estructura de errores

### 2. **Servicio de Autenticación** (`src/services/authService.ts`)
Proporciona métodos para:
- `login()`: Realiza la solicitud POST y almacena tokens
- `getAccessToken()`: Obtiene el token de acceso del localStorage
- `getUser()`: Obtiene los datos del usuario
- `logout()`: Cierra la sesión
- `isAuthenticated()`: Verifica si está autenticado

### 3. **Componente Login** (`src/app/auth/Login/login.tsx`)
Incluye:
- Formulario con campos de usuario y contraseña
- Validaciones del lado del cliente
- Manejo de estados (loading, error)
- Toggle para mostrar/ocultar contraseña
- Mensaje de error si las credenciales son incorrectas
- Redirección a dashboard tras login exitoso
- Credenciales de prueba mostradas en la UI

### 4. **Página de Login** (`src/app/auth/page.tsx`)
Ruta que renderiza el componente Login

### 5. **API Mock** (`src/app/api/auth/login/route.ts`)
Ruta API local que:
- Simula un endpoint de autenticación
- Valida credenciales (admin@local / admin123)
- Retorna tokens y datos de usuario en la estructura especificada

### 6. **Variables de Entorno** (`.env.local`)
Configura la URL base de la API

## Cómo Usar

### Para Desarrollo Local

1. **Instala dependencias:**
```bash
npm install
```

2. **Inicia el servidor de desarrollo:**
```bash
npm run dev
```

3. **Accede al login:**
Navega a `http://localhost:3000/auth`

4. **Credenciales de prueba:**
- Usuario: `admin@local`
- Contraseña: `admin123`

### Para Conectar a tu Backend Real

Modifica el archivo `src/services/authService.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://tu-api-real.com";
```

O actualiza el archivo `.env.local`:
```
NEXT_PUBLIC_API_URL=https://tu-backend.com
```

## Estructura de Solicitud/Respuesta

### Solicitud (POST /api/auth/login)
```json
{
  "username": "admin@local",
  "password": "admin123"
}
```

### Respuesta (201 OK)
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

## Funcionalidades del Componente

✅ Formulario con validaciones  
✅ Estados de carga (loading spinner)  
✅ Manejo de errores  
✅ Toggle para mostrar/ocultar contraseña  
✅ Almacenamiento seguro de tokens en localStorage  
✅ Redirección automática al dashboard  
✅ Estilos con Tailwind CSS  
✅ TypeScript completo para type-safety  
✅ Responsive design  

## Notas Importantes

- Los tokens se guardan en `localStorage` cuando el login es exitoso
- El servicio tiene métodos para recuperar tokens y datos del usuario en cualquier momento
- El componente está marcado con `'use client'` para trabajar con Next.js App Router
- Las validaciones incluyen verificación de campos vacíos y longitud mínima de contraseña

## Próximos Pasos

Puedes agregar:
1. **Refresh token logic** para renovar tokens expirados
2. **Context API o Zustand** para estado global de autenticación
3. **Protected routes** usando middleware de Next.js
4. **Remember me** funcionalidad
5. **Social login** (Google, GitHub, etc.)

