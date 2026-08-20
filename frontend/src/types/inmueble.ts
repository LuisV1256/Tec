import type { Usuario } from './usuario';
import type { TipoInmueble } from './tipoInmueble';

export type EstadoCodigo = 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO';

export interface EstadoInmueble {
  id: string;
  codigo: EstadoCodigo;
  nombre: string;
  activo: boolean;
}

export interface Inmueble {
  id: string;
  direccion: string;
  precio: string;
  habitaciones: number;
  metrosCuadrados: string;
  tipoInmuebleId: string;
  vendedorId: string;
  estadoId: string;
  createdAt: string;
  updatedAt: string;
  estado: EstadoInmueble;
  tipoInmueble: TipoInmueble;
  vendedor: Usuario;
}

export interface CreateInmuebleInput {
  direccion: string;
  precio: number;
  habitaciones: number;
  metrosCuadrados: number;
  tipoInmuebleId: string;
}

export type UpdateInmuebleInput = Partial<CreateInmuebleInput>;

export interface FiltrosInmuebles {
  page?: number;
  limit?: number;
  estado?: EstadoCodigo;
  tipoInmuebleId?: string;
  precioMin?: number;
  precioMax?: number;
  search?: string;
  soloMios?: boolean;
  orderBy?: 'precio' | 'createdAt';
  order?: 'ASC' | 'DESC';
}

export interface TransicionEstado {
  destino: EstadoCodigo;
  etiqueta: string;
}

/** Únicas transiciones válidas — refleja TRANSICIONES_VALIDAS del backend. */
export const TRANSICIONES_VALIDAS: Record<EstadoCodigo, TransicionEstado[]> = {
  DISPONIBLE: [{ destino: 'RESERVADO', etiqueta: 'Reservar' }],
  RESERVADO: [
    { destino: 'DISPONIBLE', etiqueta: 'Volver a disponible' },
    { destino: 'VENDIDO', etiqueta: 'Marcar como vendido' },
  ],
  VENDIDO: [],
};
