export interface TipoInmueble {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

/** Tipos sin habitaciones: un terreno o un local comercial no tiene dormitorios. */
export const TIPOS_SIN_HABITACIONES = ['TERRENO', 'LOCAL_COMERCIAL'];
