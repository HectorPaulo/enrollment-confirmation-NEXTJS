/**
 * Servicio de Clientes
 * Maneja todas las operaciones relacionadas con clientes
 */

import { Client, CreateClientRequest } from "@/types/auth";
import { fetchWithAuth } from "@/services/httpService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Datos de ejemplo para desarrollo
const MOCK_CLIENTS: Client[] = [
  {
    id: "client_001",
    name: "Juan García",
    email: "juan@example.com",
    phone: "+34 612 345 678",
  },
  {
    id: "client_002",
    name: "María López",
    email: "maria@example.com",
    phone: "+34 623 456 789",
  },
  {
    id: "client_003",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    phone: "+34 634 567 890",
  },
];

export const clientService = {
  /**
   * Obtiene la lista de todos los clientes
   */
  async listClients(): Promise<Client[]> {
    try {
      // Intentar obtener de la API con timeout de 2 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const data = await fetchWithAuth(`${API_BASE_URL}/clients`, {
        signal: controller.signal as any,
      });

      clearTimeout(timeoutId);
      return data || MOCK_CLIENTS;
    } catch (error) {
      // Si falla, retornar datos de ejemplo sin error
      console.info("Using mock data for clients");
      return MOCK_CLIENTS;
    }
  },

  /**
   * Obtiene los detalles de un cliente específico
   */
  async getClient(clientId: string): Promise<Client> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/clients/${clientId}`);
      return data;
    } catch (error) {
      console.error("Error fetching client:", error);
      // Buscar en datos de ejemplo
      const mockClient = MOCK_CLIENTS.find(c => c.id === clientId);
      if (mockClient) return mockClient;
      throw error;
    }
  },

  /**
   * Crea un nuevo cliente
   */
  async createClient(clientData: CreateClientRequest): Promise<Client> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/clients`, {
        method: "POST",
        body: JSON.stringify(clientData),
      });
      return data;
    } catch (error) {
      console.warn("Error creating client on API, using mock:", error);
      // Retornar cliente simulado
      const newClient: Client = {
        id: `client_${Date.now()}`,
        ...clientData,
      };
      MOCK_CLIENTS.push(newClient);
      return newClient;
    }
  },

  /**
   * Actualiza un cliente existente
   */
  async updateClient(
    clientId: string,
    clientData: Partial<CreateClientRequest>
  ): Promise<Client> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/clients/${clientId}`, {
        method: "PUT",
        body: JSON.stringify(clientData),
      });
      return data;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  },

  /**
   * Elimina un cliente
   */
  async deleteClient(clientId: string): Promise<void> {
    try {
      await fetchWithAuth(`${API_BASE_URL}/clients/${clientId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  },
};

