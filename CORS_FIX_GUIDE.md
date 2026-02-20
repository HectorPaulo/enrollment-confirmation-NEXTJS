# Guía de Corrección de Error CORS

## Problema
El error CORS ocurría porque:
- El frontend estaba en `http://localhost:3000`
- El backend estaba en `http://127.0.0.1:8000`
- El frontend intentaba hacer solicitudes directas al backend sin la configuración CORS adecuada

## Soluciones Implementadas

### 1. ✅ Actualización de URLs del API
Se actualizó la URL base del API en los siguientes servicios:

**archivos modificados:**
- `src/services/authService.ts`
- `src/services/clientService.ts`
- `src/services/appointmentService.ts`

**cambio:**
```typescript
// Antes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Después
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
```

### 2. ✅ Configuración de next.config.ts
Se agregó configuración de rewrites y headers para manejar CORS:

```typescript
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/api/backend/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ],
  };
},

async headers() {
  return [
    {
      source: '/api/backend/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
        // ... más headers
      ],
    },
  ];
}
```

### 3. ✅ Corrección de Tipos TypeScript
Se agregaron tipos de retorno explícitos en `httpService.ts`:

```typescript
export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {}
): Promise<any> {
  // ...
}
```

## Variable de Entorno
La variable de entorno ya estaba configurada en `.env.local`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Próximos Pasos para la Solución Completa de CORS

### Opción A: Configurar CORS en el Backend (Recomendado)
Si tienes acceso al servidor backend, configura CORS adecuadamente:

**Python (FastAPI/Django):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Node.js (Express):**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
```

### Opción B: Usar Proxy de Next.js
Si no puedes modificar el backend, usa el proxy de Next.js:

1. Actualiza los servicios para usar `/api/backend` en lugar de URLs directas
2. Usa la configuración de rewrites en `next.config.ts`

## Cómo Probar

1. Asegúrate de que el servidor backend está corriendo en `http://127.0.0.1:8000`
2. Inicia el servidor frontend con:
   ```bash
   npm run dev
   ```
3. Accede a `http://localhost:3000` en tu navegador
4. Intenta hacer login con las credenciales de prueba:
   - Usuario: `admin@local`
   - Contraseña: `admin123`

## Resolución de Problemas

### Si aún recibes error CORS:
1. Verifica que la URL del backend sea correcta
2. Asegúrate de que el backend está corriendo
3. Comprueba los headers de CORS en el backend
4. Revisa la consola del navegador (F12) para más detalles

### Si la respuesta es vacía:
1. Verifica que el token se está guardando correctamente en localStorage
2. Comprueba que los endpoints del backend existen
3. Revisa que el formato de la solicitud coincida con lo esperado

## Estructura de la Solicitud y Respuesta

### Solicitud de Login
```json
{
  "username": "admin@local",
  "password": "admin123"
}
```

### Respuesta de Login
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

## Endpoints Configurados
- POST `/auth/login` - Inicia sesión
- POST `/auth/refresh` - Refresca el token
- GET `/auth/me` - Obtiene información del usuario actual
- GET `/users` - Lista de usuarios
- POST `/users` - Crear usuario
- POST `/clients` - Crear cliente
- GET `/clients` - Lista de clientes
- GET `/appointments` - Lista de citas
- Y más...

