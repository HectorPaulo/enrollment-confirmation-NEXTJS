/**
 * Tipos para las solicitudes y respuestas de autenticación
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  role: string;
  username: string;
  email?: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Modelos para Clientes
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
}

// Modelos para Citas
export interface Appointment {
  id: string;
  client_id: string;
  client?: Client;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
}

export interface CreateAppointmentRequest {
  client_id: string;
  date: string;
  time: string;
  notes?: string;
}

export interface AppointmentConfirmation {
  id: string;
  appointment_id: string;
  token: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  sent_via: 'email' | 'whatsapp';
  created_at?: string;
}

export interface SendConfirmationRequest {
  appointment_id: string;
  method: 'email' | 'whatsapp';
}

export interface VerifyOtpRequest {
  token: string;
  otp: string;
}

