/**
 * Servicio de Usuarios
 * Maneja todas las operaciones relacionadas con usuarios
 */

import { User } from "@/types/auth";
import { fetchWithAuth } from "@/services/httpService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export const userService = {
  /**
   * Obtiene la lista de todos los usuarios
   */
  async listUsers(filters?: { role?: string }): Promise<User[]> {
    try {
      let url = `${API_BASE_URL}/users`;
      const params = new URLSearchParams();

      if (filters?.role) params.append("role", filters.role);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const data = await fetchWithAuth(url);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un usuario específico
   */
  async getUser(userId: string): Promise<User> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/users/${userId}`);
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  /**
   * Crea un nuevo usuario
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Actualiza un usuario existente
   */
  async updateUser(
    userId: string,
    userData: Partial<CreateUserRequest>
  ): Promise<User> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  /**
   * Elimina un usuario
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await fetchWithAuth(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  /**
   * Obtiene el perfil del usuario actual autenticado
   */
  async getProfile(): Promise<User> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Actualiza el perfil del usuario autenticado
   */
  async updateProfile(userData: Partial<CreateUserRequest>): Promise<User> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};

