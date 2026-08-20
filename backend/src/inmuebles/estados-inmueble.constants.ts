export const ESTADOS_INMUEBLE = ['DISPONIBLE', 'RESERVADO', 'VENDIDO'] as const;

export const ESTADO_INICIAL = 'DISPONIBLE';

export const ESTADO_FINAL = 'VENDIDO';

/**
 * Únicas transiciones válidas:
 * DISPONIBLE -> RESERVADO -> VENDIDO, y RESERVADO -> DISPONIBLE.
 * VENDIDO no tiene salidas: es estado final.
 */
export const TRANSICIONES_VALIDAS: Record<string, string[]> = {
  DISPONIBLE: ['RESERVADO'],
  RESERVADO: ['DISPONIBLE', 'VENDIDO'],
  VENDIDO: [],
};

export const InmuebleErrorCode = {
  TRANSICION_INVALIDA: 'TRANSICION_INVALIDA',
  ESTADO_FINAL: 'ESTADO_FINAL',
} as const;
