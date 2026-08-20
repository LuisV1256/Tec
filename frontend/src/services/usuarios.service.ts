import { apiRequest } from './api';
import type { Usuario } from '../types/usuario';
import type { RespuestaPaginada } from '../types/api';

export function listarUsuarios(
  page: number,
  limit: number,
): Promise<RespuestaPaginada<Usuario>> {
  return apiRequest<RespuestaPaginada<Usuario>>('/usuarios', {
    query: { page, limit },
  });
}

export function eliminarUsuario(id: string): Promise<Usuario> {
  return apiRequest<Usuario>(`/usuarios/${id}`, { method: 'DELETE' });
}
