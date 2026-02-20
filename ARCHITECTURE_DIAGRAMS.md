# 📊 Diagramas y Visualización del Sistema

## 1. Flujo de Autenticación

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       │ Accede a /auth
       ▼
┌──────────────────┐
│  Página Login    │
│  /auth/page.tsx  │
└────────┬─────────┘
         │
         │ Ingresa credenciales
         │ username: "admin@local"
         │ password: "admin123"
         ▼
┌─────────────────────────────┐
│  Componente Login           │
│  src/app/auth/Login/login   │
│                             │
│  - Validaciones             │
│  - Manejo de errores        │
│  - Estados de carga         │
└────────┬────────────────────┘
         │
         │ onClick: handleSubmit()
         ▼
┌──────────────────────────────┐
│  authService.login()         │
│  src/services/authService.ts │
│                              │
│  POST /api/auth/login        │
└────────┬─────────────────────┘
         │
         │ JSON Request:
         │ {
         │   "username": "admin@local",
         │   "password": "admin123"
         │ }
         ▼
┌──────────────────────────────┐
│  API Route Handler           │
│  /api/auth/login/route.ts    │
│                              │
│  - Valida credenciales       │
│  - Genera tokens             │
└────────┬─────────────────────┘
         │
         │ JSON Response:
         │ {
         │   "access_token": "...",
         │   "refresh_token": "...",
         │   "token_type": "bearer",
         │   "user": {
         │     "id": "usr_xxx",
         │     "role": "sys_admin",
         │     "username": "admin@local"
         │   }
         │ }
         ▼
┌──────────────────────────────┐
│  authService.login()         │
│  Guardar en localStorage     │
│  - access_token              │
│  - refresh_token             │
│  - user                      │
└────────┬─────────────────────┘
         │
         │ router.push('/dashboard')
         ▼
┌──────────────────────────────┐
│  Dashboard Page              │
│  /dashboard/page.tsx         │
│                              │
│  ProtectedRoute Component    │
└────────┬─────────────────────┘
         │
         │ Verificar AuthContext
         ▼
┌──────────────────────────────┐
│  AuthProvider                │
│  Carga user de localStorage  │
└────────┬─────────────────────┘
         │
         │ isAuthenticated = true
         ▼
┌──────────────────────────────┐
│  Mostrar Dashboard           │
│  con datos del usuario       │
└──────────────────────────────┘
```

---

## 2. Arquitectura de Componentes

```
RootLayout
├── AuthProvider
│   ├── Sidebar
│   └── Routes
│       ├── /auth (Login Page)
│       │   └── Login Component
│       │       ├── Form
│       │       │   ├── Username Input
│       │       │   └── Password Input
│       │       └── Error Messages
│       │
│       ├── /dashboard (Protected)
│       │   └── ProtectedRoute
│       │       ├── Dashboard Page
│       │       │   ├── UserProfile
│       │       │   │   ├── User Info
│       │       │   │   └── Logout Button
│       │       │   └── Dashboard Cards
│       │       │
│       │       └── (Redirect to /auth if not authenticated)
│       │
│       └── / (Home)
│           └── Dashboard Component
```

---

## 3. Arquitectura de Servicios

```
Componentes
    │
    ├─→ authService.login()      ┌──────────────────┐
    │   │                         │  authService.ts  │
    │   └──→ fetch POST           │                  │
    │        /api/auth/login      ├──────────────────┤
    │        │                    │ Methods:         │
    │        ▼                    │ - login()        │
    │   ┌─────────────┐           │ - getAccessToken │
    │   │ API Route   │           │ - getUser()      │
    │   │ Handler     │           │ - logout()       │
    │   └─────────────┘           │ - isAuthenticated│
    │        │                    └──────────────────┘
    │        ▼
    │   localStorage
    │   ├── access_token
    │   ├── refresh_token
    │   └── user
    │
    ├─→ httpService.apiGet()     ┌──────────────────┐
    │   │ apiPost()               │  httpService.ts  │
    │   │ apiPut()                │                  │
    │   │ apiDelete()             ├──────────────────┤
    │   │                         │ Features:        │
    │   └──→ fetch() con          │ - Token automático
    │        Authorization header │ - Manejo errores │
    │        Bearer {token}       │ - Redirects 401  │
    │        │                    └──────────────────┘
    │        ▼
    │   Servidor Backend
    │
    └─→ AuthContext.useAuth()    ┌──────────────────┐
        │                         │  AuthContext.tsx │
        ├── user                  │                  │
        ├── isAuthenticated       ├──────────────────┤
        ├── isLoading             │ Proporciona:     │
        └── logout()              │ - user           │
                                  │ - isAuthenticated│
                                  │ - isLoading      │
                                  │ - logout()       │
                                  └──────────────────┘
```

---

## 4. Flujo de Datos (Data Flow)

```
┌────────────────────┐
│   Usuario ingresa  │
│   credenciales     │
└─────────┬──────────┘
          │
          ▼
┌─────────────────────────────────────┐
│   Formulario de Login               │
│   Estado: { username, password }    │
└─────────┬───────────────────────────┘
          │
          │ Validación local
          ▼
┌─────────────────────────────────────┐
│   ¿Campos válidos?                  │
├─────────────────────────────────────┤
│   ✓ No vacío                        │
│   ✓ Longitud >= 6 caracteres        │
└─────────┬───────────────────────────┘
          │ SÍ ✓
          ▼
┌─────────────────────────────────────┐
│   authService.login()               │
│   POST /api/auth/login              │
│   Body: { username, password }      │
└─────────┬───────────────────────────┘
          │
          │ Esperar respuesta
          ▼
┌─────────────────────────────────────┐
│   Respuesta del servidor            │
├─────────────────────────────────────┤
│   Status 200 OK                     │
│   {                                 │
│     access_token,                   │
│     refresh_token,                  │
│     token_type,                     │
│     user: { id, role, username }    │
│   }                                 │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│   Guardar en localStorage           │
│   ├── localStorage.access_token     │
│   ├── localStorage.refresh_token    │
│   └── localStorage.user             │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│   AuthContext se actualiza          │
│   useAuth() hook notifica cambios   │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│   Componentes se re-renderizan      │
│   ProtectedRoute permite entrada    │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│   router.push('/dashboard')         │
│   Usuario ve dashboard              │
└─────────────────────────────────────┘
```

---

## 5. Sistema de Protección de Rutas

```
Usuario accede a /dashboard
        │
        ▼
┌──────────────────────────┐
│  ProtectedRoute          │
│  Wrapper Component       │
└──────┬───────────────────┘
       │
       │ Leer AuthContext
       ▼
┌──────────────────────────────────────┐
│  isAuthenticated?                    │
├──────────────────────────────────────┤
│  ¿Token existe en localStorage?      │
│  ¿AuthContext.user != null?          │
└──────┬─────────────────────┬─────────┘
       │ NO                  │ SÍ
       ▼                     ▼
   ┌──────────────┐     ┌──────────────┐
   │  Redirigir   │     │  Renderizar  │
   │  a /auth     │     │  Dashboard   │
   └──────────────┘     └──────────────┘
```

---

## 6. Gestión de Tokens

```
localStorage
│
├── access_token
│   │
│   ├── Usado en: Header Authorization
│   ├── Duración: Variable (ej: 1 hora)
│   ├── Propósito: Autenticar solicitudes
│   └── Renovación: Mediante refresh_token
│
├── refresh_token
│   │
│   ├── Usado en: Renovación de access_token
│   ├── Duración: Larga (ej: 7 días)
│   ├── Propósito: Obtener nuevo access_token
│   └── Método: POST /api/auth/refresh
│
└── user
    │
    ├── id: "usr_b52d0cdd0aca"
    ├── role: "sys_admin"
    ├── username: "admin@local"
    └── Usado en: Mostrar en UI, roles/permisos
```

---

## 7. Ciclo de Vida de Autenticación

```
Aplicación inicia
       │
       ▼
AuthProvider monta
       │
       ├─→ useState(user, isLoading)
       │
       ├─→ useEffect() llama loadUser()
       │   │
       │   ├─→ authService.getUser()
       │   │   │
       │   │   └─→ localStorage.getItem('user')
       │   │
       │   └─→ setUser(storedUser)
       │
       └─→ Proporciona contexto a toda la app
           │
           ▼
        useAuth() hook disponible
        en cualquier componente
           │
           ├─→ Acceso a user
           ├─→ Acceso a isAuthenticated
           ├─→ Acceso a isLoading
           └─→ Acceso a logout()
           
Usuario hace logout
       │
       ▼
logout() se ejecuta
       │
       ├─→ authService.logout()
       │   │
       │   ├─→ localStorage.removeItem('access_token')
       │   ├─→ localStorage.removeItem('refresh_token')
       │   └─→ localStorage.removeItem('user')
       │
       ├─→ setUser(null)
       │
       └─→ router.push('/auth')
           │
           ▼
        Usuario ve Login nuevamente
```

---

## 8. Jerarquía de Carpetas Completa

```
enrollments/
│
├── src/
│   ├── types/
│   │   └── auth.ts                  # Tipos: LoginRequest, AuthResponse
│   │
│   ├── services/
│   │   ├── authService.ts           # Login, tokens, logout
│   │   └── httpService.ts           # Fetch con autenticación
│   │
│   ├── context/
│   │   └── AuthContext.tsx          # Contexto global useAuth()
│   │
│   ├── components/
│   │   ├── ProtectedRoute.tsx       # Wrapper para rutas protegidas
│   │   ├── UserProfile.tsx          # Mostrar usuario + logout
│   │   ├── dashboard/
│   │   │   └── dashboard.tsx
│   │   └── sidebar/
│   │       └── sidebar.tsx
│   │
│   ├── utils/
│   │   └── authExtensions.ts        # Funcionalidades avanzadas
│   │
│   └── app/
│       ├── layout.tsx               # RootLayout + AuthProvider
│       ├── page.tsx
│       ├── globals.css
│       │
│       ├── auth/
│       │   ├── page.tsx             # Página /auth
│       │   └── Login/
│       │       └── login.tsx        # Componente Login
│       │
│       ├── dashboard/
│       │   └── page.tsx             # Página protegida
│       │
│       └── api/
│           └── auth/
│               └── login/
│                   └── route.ts     # POST /api/auth/login (mock)
│
├── .env.local                       # NEXT_PUBLIC_API_URL
├── package.json
├── tsconfig.json
├── next.config.ts
│
├── QUICK_START.md                   # Inicio rápido
├── AUTHENTICATION_GUIDE.md          # Guía completa
├── LOGIN_COMPONENT_README.md        # README del componente
├── IMPLEMENTATION_SUMMARY.md        # Resumen de implementación
└── ARCHITECTURE_DIAGRAMS.md         # Este archivo
```

---

## 9. Matriz de Compatibilidad

```
┌──────────────────┬───────────┬──────────┐
│ Componente       │ React 19  │ Next 16  │
├──────────────────┼───────────┼──────────┤
│ Login            │ ✓ 'use client'        │
│ AuthProvider     │ ✓ 'use client'        │
│ ProtectedRoute   │ ✓ 'use client'        │
│ useAuth Hook     │ ✓ Custom Hook         │
│ API Routes       │ ✓ /api/...           │
│ TypeScript       │ ✓ Total               │
│ Tailwind CSS     │ ✓ Utilidades          │
└──────────────────┴───────────┴──────────┘
```

---

## 10. Estados Posibles del Sistema

```
┌─────────────────────────────────────────────┐
│           Estados de Autenticación          │
└─────────────────────────────────────────────┘

1. NO AUTENTICADO
   ├── AuthContext.user = null
   ├── AuthContext.isAuthenticated = false
   ├── localStorage está vacío
   └── Usuario ve: Página Login

2. CARGANDO
   ├── AuthContext.isLoading = true
   ├── Se verifica localStorage
   ├── Se carga contexto global
   └── Usuario ve: Spinner de carga

3. AUTENTICADO
   ├── AuthContext.user = { id, role, username }
   ├── AuthContext.isAuthenticated = true
   ├── localStorage tiene tokens
   └── Usuario ve: Dashboard protegido

4. SESIÓN EXPIRADA
   ├── access_token inválido/expirado
   ├── API retorna 401
   ├── authService.logout() se ejecuta
   └── Usuario redirigido a /auth
```

---

Estos diagramas representan visualmente toda la arquitectura del sistema de autenticación implementado.

