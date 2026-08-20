import { useCallback, useEffect, useState } from 'react';
import { listarInmuebles } from '../services/inmuebles.service';
import type { FiltrosInmuebles, Inmueble } from '../types/inmueble';
import type { RespuestaPaginada } from '../types/api';
import { ApiError } from '../types/api';

export function useInmuebles(filtros: FiltrosInmuebles) {
  const [respuesta, setRespuesta] = useState<RespuestaPaginada<Inmueble> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(() => {
    setLoading(true);
    setError(null);
    listarInmuebles(filtros)
      .then(setRespuesta)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los inmuebles.'),
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filtros)]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { respuesta, loading, error, recargar };
}
