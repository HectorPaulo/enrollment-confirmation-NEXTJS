/**
 * Servicio de autenticación
 * Maneja las solicitudes de login y almacenamiento de tokens
 */

import { LoginRequest, AuthResponse, AuthError, RefreshTokenRequest } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const authService = {
  /**
   * Realiza una solicitud de login
   * @param credentials - Usuario y contraseña
   * @returns Respuesta con tokens y datos del usuario
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          message: error.message || "Error en la autenticación",
          status: response.status,
        } as AuthError;
      }

      const data: AuthResponse = await response.json();

      // Guardar tokens en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      if (error) {
        throw error;
      }
      throw {
        message: error instanceof Error ? error.message : "Error desconocido",
      } as AuthError;
    }
  },

  /**
   * Refresca el token de acceso
   * @returns Nuevo token de acceso
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw {
          message: "No refresh token available",
        } as AuthError;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        this.logout();
        throw {
          message: "Token refresh failed",
          status: response.status,
        } as AuthError;
      }

      const data: AuthResponse = await response.json();

      // Actualizar tokens
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data.access_token;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene los datos del usuario autenticado actual
   */
  async getMe(): Promise<any> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw {
          message: "No authentication token",
        } as AuthError;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // Token expiró, intentar refrescar
        const newToken = await this.refreshToken();
        return this.getMe(); // Reintentar con nuevo token
      }

      if (!response.ok) {
        throw {
          message: "Failed to fetch user data",
          status: response.status,
        } as AuthError;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene el token de acceso del almacenamiento local
   */
  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  },

  /**
   * Obtiene el token de refresco del almacenamiento local
   */
  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  },

  /**
   * Obtiene el usuario del almacenamiento local
   */
  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  },
};

