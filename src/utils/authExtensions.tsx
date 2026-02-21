/**
 * Ejemplo de Extensiones de Autenticación
 * Agrega funcionalidades avanzadas al sistema de autenticación
 */

// ============================================
// 1. REFRESH TOKEN AUTOMÁTICO
// ============================================

import { authService } from '@/services/authService';

/**
 * Intenta renovar el token usando refresh_token
 * Útil cuando el access_token expira
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      authService.logout();
      return null;
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);

    return data.access_token;
  } catch (error) {
    console.error('Error al renovar token:', error);
    authService.logout();
    return null;
  }
}

// ============================================
// 2. INTERCEPTOR DE SOLICITUDES (FETCH)
// ============================================

/**
 * Wrapper para fetch que maneja token expirado
 */
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${authService.getAccessToken()}`,
    },
  });

  // Si el token expiró (401), intentar renovarlo
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
    }
  }

  return response;
}

// ============================================
// 3. GUARDAR ÚLTIMA PÁGINA VISITADA
// ============================================

/**
 * Guarda la página anterior al redirigir a login
 */
export function saveLastPage(pathname: string): void {
  if (pathname !== '/auth') {
    localStorage.setItem('lastPage', pathname);
  }
}

/**
 * Obtiene la última página visitada
 */
export function getLastPage(): string {
  return localStorage.getItem('lastPage') || '/';
}

/**
 * Limpia la última página guardada
 */
export function clearLastPage(): void {
  localStorage.removeItem('lastPage');
}

// ============================================
// 4. VERIFICAR EXPIRACIÓN DE TOKEN
// ============================================

/**
 * Decodifica un JWT y obtiene su información
 */
function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Verifica si el token está próximo a expirar (5 minutos)
 */
export function isTokenExpiringSoon(): boolean {
  const token = authService.getAccessToken();
  if (!token) return true;

  const payload = decodeToken(token);
  if (!payload?.exp) return true;

  const expiresIn = (payload.exp * 1000) - Date.now();
  return expiresIn < 5 * 60 * 1000; // 5 minutos
}

// ============================================
// 5. VERIFICACIÓN PERIÓDICA DE SESIÓN
// ============================================

/**
 * Configurar verificación periódica de sesión
 * Llamar en el componente raíz
 */
export function setupSessionCheck(intervalMs: number = 60000): () => void {
  const interval = setInterval(() => {
    if (isTokenExpiringSoon()) {
      refreshAccessToken();
    }
  }, intervalMs);

  return () => clearInterval(interval);
}

// ============================================
// 6. LOGOUT AUTOMÁTICO POR INACTIVIDAD
// ============================================

/**
 * Configura logout automático si el usuario está inactivo
 */
export function setupInactivityLogout(timeoutMs: number = 15 * 60 * 1000) {
  let timeoutId: NodeJS.Timeout;

  function resetTimer() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }, timeoutMs);
  }

  // Eventos que resetean el timer
  if (typeof window !== 'undefined') {
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
  }

  resetTimer();

  // Retorna función para limpiar listeners
  return () => {
    if (typeof window !== 'undefined') {
      ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    }
    clearTimeout(timeoutId);
  };
}

// ============================================
// 7. MÚLTIPLES ROLES Y PERMISOS
// ============================================

/**
 * Verifica si el usuario tiene un rol específico
 */
export function hasRole(role: string): boolean {
  const user = authService.getUser();
  return user?.role === role;
}

/**
 * Verifica si el usuario tiene alguno de los roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const user = authService.getUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Componente para mostrar contenido solo si tiene cierto rol
 */
export function RoleGuard({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  return hasRole(role) ? <>{children}</> : null;
}

// ============================================
// 8. HISTORIAL DE ACCESOS
// ============================================

/**
 * Registra cada acceso a la aplicación
 */
export function logAccess(page: string, action: string): void {
  const accessLog = {
    timestamp: new Date().toISOString(),
    page,
    action,
    user: authService.getUser()?.username,
  };

  // Aquí podrías enviar a un servidor de analytics
  console.log('Access Log:', accessLog);
}

// ============================================
// 9. MODO INCÓGNITO / PRIVATE BROWSING
// ============================================

/**
 * Detecta si el navegador está en modo privado
 */
export async function isPrivateMode(): Promise<boolean> {
  try {
    const test = '__private_mode_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return false;
  } catch (e) {
    return true;
  }
}

// ============================================
// 10. SINCRONIZACIÓN ENTRE PESTAÑAS
// ============================================

/**
 * Sincroniza logout entre múltiples pestañas
 * Si el usuario cierra sesión en una pestaña, las demás se cierran también
 */
export function setupStorageSync(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('storage', (event) => {
    if (event.key === 'access_token' && event.newValue === null) {
      // Token fue removido (logout) en otra pestaña
      authService.logout();
      window.location.href = '/auth';
    }
  });
}

// ============================================
// EJEMPLO DE USO EN COMPONENTE
// ============================================

/*
'use client';

import { useEffect } from 'react';
import { setupSessionCheck, setupInactivityLogout, setupStorageSync } from '@/utils/authExtensions';

export function AuthSetup() {
  useEffect(() => {
    // Verificar token cada minuto
    const cleanupSessionCheck = setupSessionCheck(60000);

    // Logout automático después de 15 minutos de inactividad
    const cleanupInactivity = setupInactivityLogout(15 * 60 * 1000);

    // Sincronizar logout entre pestañas
    setupStorageSync();

    return () => {
      cleanupSessionCheck();
      cleanupInactivity();
    };
  }, []);

  return null;
}
*/

