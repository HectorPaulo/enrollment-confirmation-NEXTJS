# 🔌 CONFIGURACIÓN DE API - Guía Paso a Paso

## ✅ Estado Actual

Tu aplicación ahora funciona con **datos de ejemplo (mock)** mientras no tengas la API configurada.

Esto significa:
- ✅ Puedes ver clientes de ejemplo
- ✅ Puedes crear citas de ejemplo
- ✅ Todo funciona sin una API real

---

## 🚀 Para Conectar tu API Real

### Paso 1: Verifica que tu API está corriendo

Asegúrate que tu API está disponible en:
```
http://localhost:8000
```

O donde tengas configurada tu API.

### Paso 2: Actualiza `.env.local`

Si tu API está en otra URL, actualiza:

```
NEXT_PUBLIC_API_URL=http://tu-servidor.com:8000
```

### Paso 3: Reinicia el servidor Next.js

```bash
npm run dev
```

---

## 📋 Endpoints Requeridos

Tu API DEBE tener estos endpoints:

### Autenticación
```
POST /auth/login
POST /auth/refresh  
GET /auth/me
```

### Clientes
```
GET /clients          → Lista de clientes
POST /clients         → Crear cliente
GET /clients/{id}     → Obtener cliente
PUT /clients/{id}     → Actualizar cliente
DELETE /clients/{id}  → Eliminar cliente
```

### Citas
```
GET /appointments                          → Lista de citas
POST /appointments                         → Crear cita
GET /appointments/{id}                     → Obtener cita
POST /appointments/{id}/cancel             → Cancelar cita
POST /appointments/{id}/confirmations      → Enviar confirmación
GET /appointments/{id}/confirmations       → Listar confirmaciones
GET /availability                          → Disponibilidad
```

### Confirmaciones Públicas
```
GET /public/confirmations/{token}              → Obtener confirmación
POST /public/confirmations/{token}/confirm     → Confirmar cita
POST /public/confirmations/otp/verify          → Verificar OTP
```

---

## 📝 Formato de Solicitudes/Respuestas

### Login

**Solicitud:**
```json
POST /auth/login
{
  "username": "empleado@company.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "user_123",
    "username": "empleado@company.com",
    "role": "employee"
  }
}
```

### Crear Cliente

**Solicitud:**
```json
POST /clients
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "name": "Juan García",
  "email": "juan@example.com",
  "phone": "+34 612 345 678"
}
```

**Respuesta:**
```json
{
  "id": "client_123",
  "name": "Juan García",
  "email": "juan@example.com",
  "phone": "+34 612 345 678",
  "created_at": "2026-02-19T10:30:00Z"
}
```

### Crear Cita

**Solicitud:**
```json
POST /appointments
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "client_id": "client_123",
  "date": "2026-02-25",
  "time": "14:30",
  "notes": "Primera consulta"
}
```

**Respuesta:**
```json
{
  "id": "apt_123",
  "client_id": "client_123",
  "date": "2026-02-25",
  "time": "14:30",
  "status": "scheduled",
  "notes": "Primera consulta",
  "created_at": "2026-02-19T10:30:00Z"
}
```

---

## 🧪 Probar tu API

### Opción 1: Con Postman

1. Abre Postman
2. Crea un nuevo request
3. `POST http://localhost:8000/auth/login`
4. Headers: `Content-Type: application/json`
5. Body:
```json
{
  "username": "empleado@company.com",
  "password": "password123"
}
```
6. Envía y verifica que obtienes tokens

### Opción 2: Con cURL

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"empleado@company.com","password":"password123"}'
```

---

## 🐛 Troubleshooting

### "Failed to fetch" en la consola
**Causas posibles:**
1. API no está corriendo
2. URL incorrecta en `.env.local`
3. Problema de CORS (si están en dominios diferentes)

**Solución:**
- Verifica que `NEXT_PUBLIC_API_URL` es correcto
- Verifica que tu API está corriendo en esa URL
- Configura CORS en tu API si es necesario

### "401 Unauthorized"
**Causa:**
- Token inválido o expirado

**Solución:**
- Verifica que `/auth/login` funciona
- Verifica que devuelve `access_token` válido

### API retorna datos pero frontend no los muestra
**Causa:**
- Formato de respuesta diferente al esperado

**Solución:**
- Abre DevTools (F12) → Network
- Verifica que la respuesta es JSON válido
- Comprueba que tiene los campos esperados

---

## ✅ Checklist

- [ ] API está corriendo en `http://localhost:8000`
- [ ] `.env.local` apunta a la URL correcta
- [ ] Probaste `/auth/login` con Postman
- [ ] Obtuviste tokens válidos
- [ ] Reiniciaste `npm run dev`
- [ ] Intentaste login en la app
- [ ] Ves clientes de tu API (no los de ejemplo)

---

## 💡 Mientras tanto...

Mientras configuras tu API real:
- ✅ Puedes ver clientes de **ejemplo**
- ✅ Puedes crear citas de **ejemplo**
- ✅ Puedes probar todo el flujo
- ✅ Los datos se guardan en memoria (no persisten)

Una vez conectes tu API real:
- 🔄 Los datos se sincronizarán con tu backend
- 💾 Los datos serán persistentes
- 📊 Podrás ver datos reales

---

## 📞 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Failed to fetch" | API no responde | Verifica que API está corriendo |
| "401 Unauthorized" | Token inválido | Re-loguéate |
| "Network tab vacía" | CORS bloqueado | Configura CORS en API |
| "Datos vacíos" | Endpoint no existe | Verifica que endpoints existen |
| "JSON parse error" | Respuesta no es JSON | Verifica formato de respuesta |

---

**Una vez conectes tu API, todo funcionará automáticamente! 🎉**

