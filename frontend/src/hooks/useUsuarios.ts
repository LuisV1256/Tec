import { useCallback, useEffect, useState } from 'react';
import { listarUsuarios } from '../services/usuarios.service';
import type { Usuario } from '../types/usuario';
import type { RespuestaPaginada } from '../types/api';
import { ApiError } from '../types/api';

export function useUsuarios(page: number, limit: number) {
  const [respuesta, setRespuesta] = useState<RespuestaPaginada<Usuario> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(() => {
    setLoading(true);
    setError(null);
    listarUsuarios(page, limit)
      .then(setRespuesta)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los usuarios.'),
      )
      .finally(() => setLoading(false));
  }, [page, limit]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { respuesta, loading, error, recargar };
}
