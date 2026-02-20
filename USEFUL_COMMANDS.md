# 🛠️ COMANDOS ÚTILES

## 🚀 Desarrollo

### Iniciar servidor de desarrollo
```bash
npm run dev
```
- Inicia Next.js en `http://localhost:3000`
- Hot reload habilitado
- Turbopack para compilación rápida

### Compilar para producción
```bash
npm run build
```
- Compila optimizado para producción
- Verifica tipos TypeScript
- Genera archivos estáticos cuando sea posible

### Iniciar servidor de producción
```bash
npm start
```
- Requiere que haya corrido `npm run build` primero
- Más rápido que desarrollo

## 🧹 Limpieza

### Limpiar caché de Next.js
```bash
# Windows PowerShell
rm -Force -Recurse .next

# O directamente en PowerShell
Remove-Item -Path .\.next -Recurse -Force
```

### Limpiar node_modules e instalar nuevamente
```bash
rm -r node_modules
npm install
```

### Limpiar todo
```bash
rm -Force -Recurse .next
rm -r node_modules
npm install
```

## 🔍 Depuración

### Ver procesos Node en ejecución
```bash
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Select-Object ProcessName, Id, Handles
```

### Matar todos los procesos Node
```bash
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### Matar proceso específico por puerto
```bash
# Ver que está usando el puerto 3000
Get-NetTCPConnection -LocalPort 3000

# Matar el proceso
Stop-Process -Id <PID> -Force
```

## 📦 Dependencias

### Instalar dependencias
```bash
npm install
```

### Instalar una dependencia específica
```bash
npm install <nombre-paquete>
```

### Instalar dependencia de desarrollo
```bash
npm install --save-dev <nombre-paquete>
```

### Ver versiones instaladas
```bash
npm list
```

### Ver dependencias desactualizadas
```bash
npm outdated
```

### Actualizar dependencia
```bash
npm update <nombre-paquete>
```

## 📝 Linting y Formato

### Ejecutar ESLint
```bash
npm run lint
```

### Ejecutar TypeScript check
```bash
npx tsc --noEmit
```

## 🌍 Pruebas en Red Local

### Ver IP local
```bash
ipconfig
```

### Acceder desde otra máquina
```
http://<tu-ip>:3000
# Ejemplo: http://192.168.1.100:3000
```

## 🔐 Variables de Entorno

### Archivos usados
```
.env.local          # Variables locales (no subir a Git)
.env                # Variables por defecto
.env.production     # Variables de producción
```

### Ver variables cargadas
```bash
# En .env.local debe estar:
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### Recargar variables
```bash
# Debes reiniciar npm run dev para que cargue cambios
```

## 🧪 Verificación de Errores

### Ver errores de compilación
```bash
npm run build
```

### Ver errores de TypeScript
```bash
npx tsc --noEmit
```

### Ver errores en consola del navegador
```
F12 → Console tab
```

### Ver errores de red
```
F12 → Network tab
```

### Ver localStorage
```
F12 → Application → Storage → localStorage
```

## 📊 Performance

### Analizar bundle
```bash
npm run build
# Revisa el .next/static/chunks folder
```

### Medir tiempos de compilación
```bash
npm run build  # Muestra tiempos en consola
```

## 🔄 Git

### Ver cambios
```bash
git status
```

### Ver diff
```bash
git diff src/
```

### Revertir cambios
```bash
git checkout -- src/
```

### Limpiar cambios no rastreados
```bash
git clean -fd
```

## 🎯 Troubleshooting

### Puerto 3000 en uso
```bash
# Matar proceso en puerto 3000
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# O usar otro puerto
npm run dev -- --port 3001
```

### Cache del navegador
```bash
# En navegador: Ctrl + Shift + Suprimir
# Y vaciar cache
```

### Refrescar página sin cache
```bash
Ctrl + Shift + R  (Chrome/Firefox)
Cmd + Shift + R   (Mac)
```

### Limpiar localStorage
```javascript
// En consola del navegador (F12):
localStorage.clear()
```

### Ver logs en tiempo real
```bash
npm run dev

# Verás salida como:
# ✓ Compiled successfully
# ✓ Ready in 2s
```

## 📋 Checklist Diario de Desarrollo

### Antes de empezar
- [ ] Verificar que backend está corriendo: `http://127.0.0.1:8000`
- [ ] Instalar dependencias: `npm install`
- [ ] Iniciar servidor: `npm run dev`

### Durante desarrollo
- [ ] Revisar consola del navegador (F12) para errores
- [ ] Revisar terminal para errores de compilación
- [ ] Probar cambios en ambos temas (claro y oscuro)
- [ ] Probar en móvil/tablet (si aplica)

### Antes de commit
- [ ] Ejecutar build: `npm run build`
- [ ] Verificar no hay errores TypeScript
- [ ] Revisar que lint pasa: `npm run lint`
- [ ] Probar login y navegación básica

### Antes de deploy
- [ ] Build exitoso
- [ ] Todos los tests pasan
- [ ] Variables de entorno configuradas
- [ ] Backend disponible en producción
- [ ] No hay errores en consola

## 🆘 Ayuda Rápida

### Error: "Cannot find module"
```bash
rm -r node_modules
npm install
```

### Error: "Port already in use"
```bash
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### Error: "CORS policy blocked"
```
1. Verifica NEXT_PUBLIC_API_URL en .env.local
2. Verifica que backend está en http://127.0.0.1:8000
3. Recarga página: Ctrl+Shift+R
```

### Error: "Token not found"
```javascript
// En consola del navegador:
localStorage.getItem('access_token')

// Si retorna null, necesitas hacer login nuevamente
```

### Dark Mode no funciona
```bash
1. F12 → Elements
2. Busca <html> tag
3. Debería tener class="dark" si está activado
4. Recarga: npm run dev
```

## 🎓 Recursos Útiles

### Documentación oficial
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Documentación del proyecto
- `CORS_FIX_GUIDE.md` - Solución CORS
- `CHANGES_SUMMARY.md` - Cambios realizados
- `FUNCTIONALITY_CHECKLIST.md` - Funcionalidades
- `SETUP_GUIDE_COMPLETE.md` - Guía completa
- `SOLUTION_SUMMARY.md` - Resumen

### Mis archivos creados
- `README.md` - Información general
- `package.json` - Dependencias
- `.env.local` - Variables de entorno
- `next.config.ts` - Configuración Next.js
- `tsconfig.json` - Configuración TypeScript
- `tailwind.config.ts` - Configuración Tailwind

## 💡 Tips Pro

1. **Hot Reload rápido**
   ```bash
   npm run dev
   # Cambia un archivo y verás cambios al instante
   ```

2. **Debug en navegador**
   ```
   F12 → Sources tab → Coloca breakpoints
   ```

3. **Ver cambios sin reiniciar**
   ```
   Ctrl+S para guardar
   Ctrl+Shift+R para refrescar sin cache
   ```

4. **Verificar CORS desde consola**
   ```javascript
   fetch('http://127.0.0.1:8000/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username: 'admin@local', password: 'admin123' })
   })
   ```

5. **Ver todos los logs en tiempo real**
   ```bash
   npm run dev 2>&1 | tee dev.log
   ```

---

**Última actualización:** 2026-02-20

Guarda este archivo para referencia rápida de comandos útiles.

