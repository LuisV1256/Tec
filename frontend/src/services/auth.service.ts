import { apiRequest } from './api';
import type { Usuario } from '../types/usuario';

export interface LoginResponse {
  accessToken: string;
  usuario: Usuario;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function register(
  nombre: string,
  email: string,
  password: string,
): Promise<Usuario> {
  return apiRequest<Usuario>('/auth/register', {
    method: 'POST',
    body: { nombre, email, password },
    auth: false,
  });
}

export function me(): Promise<Usuario> {
  return apiRequest<Usuario>('/auth/me');
}
