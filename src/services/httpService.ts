import { authService } from '@/services/authService';

interface FetchOptions extends RequestInit {
  includeAuth?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

/**
 * Realiza una solicitud HTTP con token de autenticación automático
 */
export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {}
): Promise<any> {
  const { includeAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  } as Record<string, string>;

  // Agregar token de autenticación si está disponible
  if (includeAuth) {
    const token = authService.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch (error) {
    console.warn('Fetch error (API unavailable, will use fallback):', error);
    // Re-throw para que el servicio maneje el fallback
    throw new Error('API_UNAVAILABLE');
  }

  // Manejar token expirado con refresh automático
  if (response.status === 401 && includeAuth) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const newToken = await authService.refreshToken();
        processQueue(null, newToken);

        // Reintentar la solicitud original con el nuevo token
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...fetchOptions,
          headers,
        });
      } catch (error) {
        processQueue(error, null);
        authService.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        throw error;
      }
    } else {
      // Si ya está refrescando, esperar a que termine
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        headers['Authorization'] = `Bearer ${token}`;
        return fetchWithAuth(url, { ...options, includeAuth });
      });
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Error en la solicitud',
    }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Alias para GET
 */
export async function apiGet(url: string): Promise<any> {
  return fetchWithAuth(url, { method: 'GET' });
}

/**
 * Alias para POST
 */
export async function apiPost(url: string, data: any): Promise<any> {
  return fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Alias para PUT
 */
export async function apiPut(url: string, data: any): Promise<any> {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Alias para DELETE
 */
export async function apiDelete(url: string): Promise<any> {
  return fetchWithAuth(url, { method: 'DELETE' });
}

