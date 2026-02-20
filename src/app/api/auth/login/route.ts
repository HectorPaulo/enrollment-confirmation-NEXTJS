/**
 * Ruta API de login (mock)
 * En producción, esto se conectaría a tu backend real
 */

import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Validar que las credenciales sean válidas
    if (body.username === 'admin@local' && body.password === 'admin123') {
      // Respuesta exitosa con la estructura que especificaste
      const response: AuthResponse = {
        access_token: 'hJ_lkWg6d2Q5L8vaNuvmtwUmD47VK7-Wkqoy8W_EUm8',
        refresh_token: 'MTidTfZRDYu3CcN-nWs44fl3u39fvUsGZoYvowDXs0_x_ywPgVA5TQyjg8G8hBX8',
        token_type: 'bearer',
        user: {
          id: 'usr_b52d0cdd0aca',
          role: 'sys_admin',
          username: 'admin@local',
        },
      };

      return NextResponse.json(response, { status: 200 });
    } else {
      // Credenciales inválidas
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

