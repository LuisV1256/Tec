import { useEffect, useState } from 'react';
import { listarTiposInmueble } from '../services/catalogos.service';
import type { TipoInmueble } from '../types/tipoInmueble';
import { ApiError } from '../types/api';

export function useTiposInmueble() {
  const [tipos, setTipos] = useState<TipoInmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarTiposInmueble()
      .then(setTipos)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los tipos de inmueble.'),
      )
      .finally(() => setLoading(false));
  }, []);

  return { tipos, loading, error };
}
