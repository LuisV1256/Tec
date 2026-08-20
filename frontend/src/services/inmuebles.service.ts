import { apiRequest } from './api';
import type {
  CreateInmuebleInput,
  FiltrosInmuebles,
  Inmueble,
  UpdateInmuebleInput,
  EstadoCodigo,
} from '../types/inmueble';
import type { RespuestaPaginada } from '../types/api';

export function listarInmuebles(
  filtros: FiltrosInmuebles,
): Promise<RespuestaPaginada<Inmueble>> {
  return apiRequest<RespuestaPaginada<Inmueble>>('/inmuebles', { query: filtros });
}

export function obtenerInmueble(id: string): Promise<Inmueble> {
  return apiRequest<Inmueble>(`/inmuebles/${id}`);
}

export function crearInmueble(input: CreateInmuebleInput): Promise<Inmueble> {
  return apiRequest<Inmueble>('/inmuebles', { method: 'POST', body: input });
}

export function actualizarInmueble(
  id: string,
  input: UpdateInmuebleInput,
): Promise<Inmueble> {
  return apiRequest<Inmueble>(`/inmuebles/${id}`, { method: 'PATCH', body: input });
}

export function cambiarEstadoInmueble(
  id: string,
  estado: EstadoCodigo,
): Promise<Inmueble> {
  return apiRequest<Inmueble>(`/inmuebles/${id}/estado`, {
    method: 'PATCH',
    body: { estado },
  });
}

export function eliminarInmueble(id: string): Promise<Inmueble> {
  return apiRequest<Inmueble>(`/inmuebles/${id}`, { method: 'DELETE' });
}
