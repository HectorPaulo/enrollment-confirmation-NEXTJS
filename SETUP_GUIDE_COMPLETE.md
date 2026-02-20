# 🎯 Instrucciones Finales - Sistema de Enrollments

## ¿Qué Fue Arreglado?

### 1. ✅ Error CORS - "Failed to fetch"
Se corrigió la configuración de URLs del API para que todas las solicitudes apunten a `http://127.0.0.1:8000` en lugar de `http://localhost:3000`.

**Archivos modificados:**
- `src/services/authService.ts`
- `src/services/clientService.ts`
- `src/services/appointmentService.ts`
- `next.config.ts` (agregada configuración de proxy)

### 2. ✅ Error TypeScript - Tipos de Retorno
Se agregaron tipos `Promise<any>` explícitos a funciones en `src/services/httpService.ts`.

### 3. ✅ Validación de Características
- Login con validación de usuario/contraseña
- Dark mode en todos los componentes
- Protección de rutas (redirect a `/auth` si no autenticado)
- Sidebar no aparece en rutas de autenticación
- Dashboard como ruta por defecto para usuarios autenticados

## 🚀 Cómo Ejecutar

### Prerequisitos
1. **Backend debe estar corriendo** en `http://127.0.0.1:8000`
2. Endpoints requeridos:
   - `POST /auth/login` - para iniciar sesión
   - `POST /auth/refresh` - para refrescar tokens
   - `GET /auth/me` - para obtener usuario actual

### Iniciar el Servidor

```bash
cd C:\Users\paulo\WebstormProjects\enrollments
npm run dev
```

El servidor se iniciará en:
- **Local:** `http://localhost:3000`
- **Network:** `http://100.64.100.6:3000` (si es necesario)

### Credenciales de Prueba
```
Usuario: admin@local
Contraseña: admin123
```

## 📋 Flujo de Uso

1. **Accede a `http://localhost:3000`**
   - Si no estás autenticado → Redirige a `/auth`
   - Si estás autenticado → Redirige a `/dashboard`

2. **En la página de login (`/auth`)**
   - Ingresa usuario: `admin@local`
   - Ingresa contraseña: `admin123`
   - Haz click en "Iniciar Sesión"

3. **Tras login exitoso**
   - Se guardan tokens en localStorage
   - Se redirige automáticamente a `/dashboard`
   - Puedes navegar a `/citas` y `/clientes`

4. **Para cambiar a Dark Mode**
   - Haz click en el toggle de tema en la esquina superior derecha
   - La preferencia se guarda automáticamente

5. **Para cerrar sesión**
   - Haz click en el botón "Logout" en la barra lateral
   - Se limpian los tokens de localStorage
   - Se redirige a `/auth`

## 🔒 Seguridad

- **Tokens:** Se guardan en localStorage
- **Refresh:** Se ejecuta automáticamente cuando el token expira (401)
- **Logout:** Limpia todos los datos de sesión
- **Rutas protegidas:** Requieren `ProtectedRoute` wrapper

## 🌙 Dark Mode

Todos los componentes soportan dark mode:
- Automático según preferencia del sistema
- Manual con toggle en la UI
- Clases `dark:` en Tailwind CSS
- Transiciones suaves entre temas

## 🔧 Configuración

### `.env.local`
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Backend CORS (si es necesario)
Si el backend no acepta requests desde `localhost:3000`, configura CORS:

**FastAPI:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Express:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── auth/
│   │   ├── Login/
│   │   │   └── login.tsx          # Componente de login
│   │   └── page.tsx               # Página de auth
│   ├── dashboard/
│   │   └── page.tsx               # Dashboard (protegido)
│   ├── citas/
│   │   └── page.tsx               # Listado de citas (protegido)
│   ├── clientes/
│   │   └── page.tsx               # Listado de clientes (protegido)
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Página raíz (redireccionamiento)
├── components/
│   ├── LayoutWrapper.tsx           # Wrapper que controla sidebar
│   ├── ProtectedRoute.tsx          # Componente de protección
│   ├── sidebar/
│   │   └── sidebar.tsx             # Barra lateral
│   ├── ThemeToggle.tsx             # Toggle de tema
│   └── ...otros componentes
├── context/
│   └── AuthContext.tsx             # Contexto de autenticación
├── services/
│   ├── authService.ts              # Servicio de autenticación
│   ├── clientService.ts            # Servicio de clientes
│   ├── appointmentService.ts       # Servicio de citas
│   ├── httpService.ts              # Utilidades HTTP
│   └── ...otros servicios
├── types/
│   └── auth.ts                     # Tipos de autenticación
└── utils/
    └── authExtensions.tsx          # Extensiones de autenticación
```

## 🧪 Testing

### Test Manual de Login
```bash
1. Abre http://localhost:3000
2. Deberías ver la página de login
3. Ingresa admin@local / admin123
4. Deberías ser redirigido a /dashboard
5. Verifica que el token se guardó en localStorage:
   - F12 → Application → localStorage
   - Busca "access_token"
```

### Test de Dark Mode
```bash
1. En el dashboard, busca el toggle de tema
2. Haz click para cambiar a dark mode
3. Verifica que:
   - Fondo oscuro
   - Texto blanco/claro
   - Botones oscuros
   - Sin parpadeos
```

### Test de Protección de Rutas
```bash
1. Cierra sesión (Logout)
2. Intenta acceder a http://localhost:3000/dashboard
3. Deberías ser redirigido a /auth
4. Intenta acceder a http://localhost:3000/citas
5. Deberías ser redirigido a /auth
```

## 🐛 Troubleshooting

### "Port 3000 is already in use"
```bash
# Opción 1: Matar proceso
# Desde PowerShell:
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Opción 2: Usar otro puerto
npm run dev -- --port 3001
```

### "Failed to fetch" o Error CORS
```bash
1. Verifica que el backend está corriendo:
   http://127.0.0.1:8000
2. Revisa la consola del navegador (F12 → Console)
3. Verifica que .env.local tiene:
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
4. Recarga la página (Ctrl+Shift+R para cache limpiar)
```

### Login no funciona
```bash
1. Verifica credenciales en el backend
2. Revisa que /auth/login está disponible
3. Comprueba el formato de respuesta:
   {
     "access_token": "...",
     "refresh_token": "...",
     "token_type": "bearer",
     "user": { "id": "...", "role": "...", "username": "..." }
   }
```

### Token no se guarda en localStorage
```bash
1. Verifica que la respuesta de login incluye "access_token"
2. Comprueba que no hay errores en la consola
3. Abre F12 → Storage → localStorage
4. Busca "access_token"
```

### Dark mode no funciona
```bash
1. Verifica que ThemeToggle está en el layout
2. Comprueba que los componentes tienen clases "dark:"
3. Revisa que html tiene atributo "dark" cuando está activado
4. Limpia cache del navegador
```

## 📚 Documentación Adicional

Consulta estos archivos para más información:
- `CORS_FIX_GUIDE.md` - Detalles sobre solución CORS
- `CHANGES_SUMMARY.md` - Resumen completo de cambios
- `FUNCTIONALITY_CHECKLIST.md` - Checklist de características

## ✅ Verificación Final

Antes de usar en producción, verifica:

- [ ] Backend está corriendo en `http://127.0.0.1:8000`
- [ ] Frontend compila sin errores: `npm run build`
- [ ] Login funciona con credenciales correctas
- [ ] Tokens se guardan en localStorage
- [ ] Redirecciones funcionan correctamente
- [ ] Dark mode se alterna correctamente
- [ ] Sidebar no aparece en `/auth`
- [ ] Protección de rutas funciona
- [ ] No hay errores en la consola del navegador

## 🎉 ¡Listo!

Tu sistema de enrollments está completamente configurado y listo para usar.

