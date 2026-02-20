# ✅ Checklist de Funcionalidad

## 🔐 Autenticación

- [ ] **Login**
  - [ ] Página accesible en `/auth`
  - [ ] Formulario acepta usuario y contraseña
  - [ ] Valida campos vacíos
  - [ ] Valida longitud de contraseña (min 6)
  - [ ] Muestra mensaje de error si falla
  - [ ] Muestra indicador de carga durante login
  - [ ] Redirige a `/dashboard` tras login exitoso
  - [ ] Token se guarda en localStorage

- [ ] **Protección de Rutas**
  - [ ] Página raíz (`/`) redirige a `/auth` si no está autenticado
  - [ ] Página raíz redirige a `/dashboard` si está autenticado
  - [ ] `/dashboard` solo accesible si está autenticado
  - [ ] `/citas` solo accesible si está autenticado
  - [ ] `/clientes` solo accesible si está autenticado
  - [ ] Intento de acceso sin token redirige a `/auth`

- [ ] **Sidebar**
  - [ ] No aparece en `/auth`
  - [ ] No aparece en `/auth/login`
  - [ ] No aparece en `/auth/register`
  - [ ] Aparece en `/dashboard`
  - [ ] Aparece en `/citas`
  - [ ] Aparece en `/clientes`

## 🌙 Dark Mode

- [ ] **Tema Claro (por defecto)**
  - [ ] Logo/Header visible
  - [ ] Texto legible
  - [ ] Fondos blancos/claros
  - [ ] Botones con colores claros

- [ ] **Tema Oscuro**
  - [ ] Todos los elementos tienen clase `dark:`
  - [ ] Toggle de tema funciona
  - [ ] Preferencia se persiste
  - [ ] Fondos oscuros
  - [ ] Texto claro
  - [ ] Suficiente contraste

## 🔗 Endpoints y API

- [ ] **Login**
  - [ ] Solicitud POST a `/auth/login`
  - [ ] Cuerpo: `{"username": "...", "password": "..."}`
  - [ ] Respuesta incluye `access_token`
  - [ ] Respuesta incluye `refresh_token`
  - [ ] Respuesta incluye `token_type: "bearer"`
  - [ ] Respuesta incluye objeto `user`

- [ ] **Refresh Token**
  - [ ] Se usa cuando token expira (401)
  - [ ] Solicitud automática a `/auth/refresh`
  - [ ] Nuevo token se guarda
  - [ ] Solicitud original se reintenta

- [ ] **Usuario Actual**
  - [ ] Endpoint GET `/auth/me` funciona
  - [ ] Requiere autenticación
  - [ ] Retorna información del usuario

- [ ] **Clientes**
  - [ ] GET `/clients` lista clientes
  - [ ] POST `/clients` crea cliente
  - [ ] GET `/clients/{id}` obtiene cliente
  - [ ] Con autenticación funciona
  - [ ] Sin autenticación falla apropiadamente

- [ ] **Citas**
  - [ ] GET `/appointments` lista citas
  - [ ] POST `/appointments` crea cita
  - [ ] GET `/appointments/{id}` obtiene cita
  - [ ] POST `/appointments/{id}/cancel` cancela cita
  - [ ] POST `/appointments/{id}/confirmations` envía confirmación
  - [ ] Con autenticación funciona
  - [ ] Sin autenticación falla apropiadamente

## 📝 Componentes

- [ ] **Login Component**
  - [ ] Valida campos
  - [ ] Maneja errores
  - [ ] Muestra credenciales de prueba
  - [ ] Toggle de visibilidad de contraseña
  - [ ] Indicador de carga animado
  - [ ] Soporta dark mode
  - [ ] Link a registro

- [ ] **Dashboard**
  - [ ] Muestra bienvenida personalizada
  - [ ] Muestra información del usuario
  - [ ] Protegido con ProtectedRoute
  - [ ] Soporta dark mode
  - [ ] Sidebar visible

- [ ] **ClientsList**
  - [ ] Obtiene clientes del API
  - [ ] Si API falla, muestra datos mock
  - [ ] Lista los clientes en tabla/grid
  - [ ] Permite crear nuevo cliente
  - [ ] Soporta dark mode

- [ ] **AppointmentsList**
  - [ ] Obtiene citas del API
  - [ ] Si API falla, muestra datos mock
  - [ ] Lista las citas
  - [ ] Permite crear nueva cita
  - [ ] Permite cancelar cita
  - [ ] Permite enviar confirmación
  - [ ] Soporta dark mode

- [ ] **Sidebar**
  - [ ] Navegación a `/dashboard`
  - [ ] Navegación a `/citas`
  - [ ] Navegación a `/clientes`
  - [ ] Botón de logout
  - [ ] Toggle de tema
  - [ ] No aparece en rutas de auth

## 🎨 Estilos

- [ ] **Tailwind CSS**
  - [ ] Clases `dark:` en elementos
  - [ ] Transiciones suaves
  - [ ] Responsive design
  - [ ] Colores consistentes

- [ ] **Tema Oscuro**
  - [ ] `bg-gray-900` en fondos oscuros
  - [ ] `text-white` para texto oscuro
  - [ ] `bg-gray-800` para tarjetas oscuras
  - [ ] `border-gray-700` para bordes oscuros
  - [ ] Suficiente contraste

## 🐛 Errores

- [ ] **Console Errors**
  - [ ] Sin errores de CORS
  - [ ] Sin errores de fetch
  - [ ] Sin errores de TypeScript
  - [ ] Sin warnings de compilación

- [ ] **Build**
  - [ ] `npm run build` compila sin errores
  - [ ] TypeScript check pasa
  - [ ] Turbopack compila correctamente

## 🚀 Performance

- [ ] **Carga de Página**
  - [ ] Login carga rápido
  - [ ] Dashboard carga sin lag
  - [ ] Transiciones suaves
  - [ ] No hay flickering en tema oscuro

- [ ] **API**
  - [ ] Solicitudes se envían correctamente
  - [ ] Respuestas se procesan correctamente
  - [ ] Manejo de errores funciona
  - [ ] Timeouts se respetan

## 📱 Responsive

- [ ] **Mobile (< 640px)**
  - [ ] Login formulario completo
  - [ ] Dashboard responsive
  - [ ] Sidebar colapsable (si aplica)
  - [ ] Botones de tamaño adecuado

- [ ] **Tablet (640px - 1024px)**
  - [ ] Layouts se adaptan
  - [ ] Texto legible
  - [ ] Espaciado adecuado

- [ ] **Desktop (> 1024px)**
  - [ ] Aprovexa ancho disponible
  - [ ] Layouts de 2-3 columnas
  - [ ] Sidebar visible

## 📋 Notas

- El servidor debe estar corriendo en `http://127.0.0.1:8000`
- Frontend corre en `http://localhost:3000` (o puerto disponible)
- Todos los tokens se guardan en localStorage
- Dark mode usa preferencia del sistema o toggle manual
- Autenticación es requerida para rutas protegidas
- Error CORS se ha resuelto con configuración correcta de URLs

