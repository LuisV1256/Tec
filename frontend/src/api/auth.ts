const API_URL = import.meta.env.VITE_API_URL;

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
}

export interface LoginResponse {
  accessToken: string;
  usuario: Usuario;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'No se pudo iniciar sesión.');
  }

  return res.json();
}
