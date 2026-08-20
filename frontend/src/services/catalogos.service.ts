import { apiRequest } from './api';
import type { TipoInmueble } from '../types/tipoInmueble';

export function listarTiposInmueble(): Promise<TipoInmueble[]> {
  return apiRequest<TipoInmueble[]>('/tipos-inmueble', { auth: false });
}
