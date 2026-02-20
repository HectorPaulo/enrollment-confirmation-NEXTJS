# 🚀 INICIO RÁPIDO

## ⚡ En 3 Pasos

### 1️⃣ Asegúrate que el Backend está corriendo
```
http://127.0.0.1:8000
```

### 2️⃣ Inicia el Frontend
```bash
cd C:\Users\paulo\WebstormProjects\enrollments
npm run dev
```

### 3️⃣ Abre en el Navegador
```
http://localhost:3000
```

## 📝 Credenciales de Prueba

```
Usuario: admin@local
Contraseña: admin123
```

## 🎯 Lo que Sucede

```
Abres http://localhost:3000
           ↓
No estás autenticado → Redirige a /auth
           ↓
Ves formulario de login
           ↓
Ingresa admin@local / admin123
           ↓
Haces click "Iniciar Sesión"
           ↓
Backend retorna tokens
           ↓
Se guardan en localStorage
           ↓
Redirige automáticamente a /dashboard
           ↓
¡Listo! 🎉
```

## 🌙 Dark Mode

En el dashboard busca el toggle de tema en la esquina superior derecha.

## 🔓 Cerrar Sesión

En el sidebar hay un botón "Logout" que limpia todo.

## 🐛 Si Algo Falla

### "Failed to fetch" o Error CORS
```
1. Verifica que backend está en http://127.0.0.1:8000
2. Recarga página: Ctrl+Shift+R
3. Abre consola: F12 → Console
4. Revisa el error
```

### "Port 3000 already in use"
```bash
# Matar procesos Node.js
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# O usar otro puerto
npm run dev -- --port 3001
```

### Login no funciona
```
1. Verifica que backend está corriendo
2. Asegúrate que endpoint /auth/login existe
3. Comprueba credenciales en backend
```

## 📱 Características

- ✅ Login y autenticación
- ✅ Dark mode
- ✅ Protección de rutas
- ✅ Sidebar condicional
- ✅ Refresh automático de tokens
- ✅ Logout automático

## 📚 Documentación

Para más información revisa:

- `VERIFICATION_FINAL.md` - Estado final del proyecto
- `CORS_FIX_GUIDE.md` - Cómo se resolvió CORS
- `SETUP_GUIDE_COMPLETE.md` - Guía completa
- `USEFUL_COMMANDS.md` - Comandos útiles
- `SOLUTION_SUMMARY.md` - Resumen de soluciones
- `EXECUTIVE_SUMMARY.md` - Resumen ejecutivo

## ✅ Verificación Rápida

Después de iniciar, verifica que:

```
[ ] Página de login carga
[ ] Puedes ingresar credenciales
[ ] Login funciona
[ ] Se redirige a dashboard
[ ] Token está en localStorage (F12 → Application)
[ ] Dark mode se puede activar
[ ] Sidebar está visible en dashboard
[ ] Logout funciona
```

## 🎉 ¡Listo!

Tu aplicación está completamente configurada y funcional.

---

**¡Que disfrutes tu aplicación!** 🚀

