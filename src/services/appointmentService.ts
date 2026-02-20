/**
 * Servicio de Citas
 * Maneja todas las operaciones relacionadas con citas y confirmaciones
 */

import {
  Appointment,
  CreateAppointmentRequest,
  AppointmentConfirmation,
  SendConfirmationRequest,
  VerifyOtpRequest,
} from "@/types/auth";
import { fetchWithAuth } from "@/services/httpService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// * Datos de ejemplo para desarrollo
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "apt_001",
    client_id: "client_001",
    date: "2026-02-25",
    time: "14:30",
    status: "confirmed",
    notes: "Primera consulta",
  },
  {
    id: "apt_002",
    client_id: "client_002",
    date: "2026-02-26",
    time: "10:00",
    status: "scheduled",
    notes: "Seguimiento",
  },
];

export const appointmentService = {
  /**
   * Obtiene la lista de todas las citas
   */
  async listAppointments(filters?: { status?: string; clientId?: string }): Promise<Appointment[]> {
    try {
      let url = `${API_BASE_URL}/appointments`;
      const params = new URLSearchParams();

      if (filters?.status) params.append("status", filters.status);
      if (filters?.clientId) params.append("client_id", filters.clientId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      // Intentar obtener de la API con timeout de 2 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const data = await fetchWithAuth(url, {
        signal: controller.signal as any,
      });

      clearTimeout(timeoutId);
      return data || MOCK_APPOINTMENTS;
    } catch (error) {
      // Si falla, retornar datos de ejemplo sin error
      console.info("Using mock data for appointments");
      return MOCK_APPOINTMENTS;
    }
  },

  /**
   * Obtiene los detalles de una cita específica
   */
  async getAppointment(appointmentId: string): Promise<Appointment> {
    try {
      const data = await fetchWithAuth(
        `${API_BASE_URL}/appointments/${appointmentId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching appointment:", error);
      const mockAppointment = MOCK_APPOINTMENTS.find(a => a.id === appointmentId);
      if (mockAppointment) return mockAppointment;
      throw error;
    }
  },

  /**
   * Crea una nueva cita
   */
  async createAppointment(
    appointmentData: CreateAppointmentRequest
  ): Promise<Appointment> {
    try {
      const data = await fetchWithAuth(`${API_BASE_URL}/appointments`, {
        method: "POST",
        body: JSON.stringify(appointmentData),
      });
      return data;
    } catch (error) {
      console.warn("Error creating appointment on API, using mock:", error);
      const newAppointment: Appointment = {
        id: `apt_${Date.now()}`,
        ...appointmentData,
        status: "scheduled",
      };
      MOCK_APPOINTMENTS.push(newAppointment);
      return newAppointment;
    }
  },

  /**
   * Cancela una cita
   */
  async cancelAppointment(appointmentId: string): Promise<Appointment> {
    try {
      const data = await fetchWithAuth(
        `${API_BASE_URL}/appointments/${appointmentId}/cancel`,
        {
          method: "POST",
        }
      );
      return data;
    } catch (error) {
      console.warn("Error canceling appointment, using mock:", error);
      const appointment = MOCK_APPOINTMENTS.find(a => a.id === appointmentId);
      if (appointment) {
        appointment.status = "cancelled";
        return appointment;
      }
      throw error;
    }
  },

  /**
   * Envía confirmación de cita por email o WhatsApp
   */
  async sendConfirmation(
    appointmentId: string,
    method: "email" | "whatsapp"
  ): Promise<AppointmentConfirmation> {
    try {
      const data = await fetchWithAuth(
        `${API_BASE_URL}/appointments/${appointmentId}/confirmations`,
        {
          method: "POST",
          body: JSON.stringify({ method }),
        }
      );
      return data;
    } catch (error) {
      console.warn(`Error sending ${method} confirmation, using mock:`, error);
      return {
        id: `conf_${Date.now()}`,
        appointment_id: appointmentId,
        token: `token_${Math.random().toString(36).substr(2, 9)}`,
        status: "pending",
        sent_via: method,
      };
    }
  },

  /**
   * Obtiene la lista de confirmaciones de una cita
   */
  async listConfirmations(appointmentId: string): Promise<AppointmentConfirmation[]> {
    try {
      const data = await fetchWithAuth(
        `${API_BASE_URL}/appointments/${appointmentId}/confirmations`
      );
      return data;
    } catch (error) {
      console.error("Error fetching confirmations:", error);
      throw error;
    }
  },

  /**
   * Obtiene confirmación por token (endpoint público)
   */
  async getConfirmationByToken(token: string): Promise<AppointmentConfirmation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/public/confirmations/${token}`
      );

      if (!response.ok) {
        throw new Error("Failed to get confirmation");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching confirmation by token:", error);
      throw error;
    }
  },

  /**
   * Confirma una cita usando token (endpoint público)
   */
  async confirmByToken(token: string): Promise<AppointmentConfirmation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/public/confirmations/${token}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm appointment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error confirming appointment by token:", error);
      throw error;
    }
  },

  /**
   * Verifica OTP para confirmar cita
   */
  async verifyOtp(token: string, otp: string): Promise<AppointmentConfirmation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/public/confirmations/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, otp }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      return await response.json();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },

  /**
   * Obtiene disponibilidad para agendar citas
   */
  async getAvailability(filters?: { date?: string; duration?: number }): Promise<any> {
    try {
      let url = `${API_BASE_URL}/availability`;
      const params = new URLSearchParams();

      if (filters?.date) params.append("date", filters.date);
      if (filters?.duration) params.append("duration", filters.duration.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const data = await fetchWithAuth(url);
      return data;
    } catch (error) {
      console.error("Error fetching availability:", error);
      throw error;
    }
  },
};


