import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  cambiarEstadoInmueble,
  eliminarInmueble,
  obtenerInmueble,
} from '../services/inmuebles.service';
import type { EstadoCodigo, Inmueble } from '../types/inmueble';
import { ApiError } from '../types/api';
import { EstadoBadge } from '../Componentes/EstadoBadge';
import { LoadingState } from '../Componentes/LoadingState';
import { ErrorState } from '../Componentes/ErrorState';
import '../Componentes/botones.css';
import './InmuebleDetalle.css';

const TRANSICIONES_VALIDAS: Record<EstadoCodigo, { destino: EstadoCodigo; etiqueta: string }[]> = {
  DISPONIBLE: [{ destino: 'RESERVADO', etiqueta: 'Reservar' }],
  RESERVADO: [
    { destino: 'DISPONIBLE', etiqueta: 'Volver a disponible' },
    { destino: 'VENDIDO', etiqueta: 'Marcar como vendido' },
  ],
  VENDIDO: [],
};

export function InmuebleDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [inmueble, setInmueble] = useState<Inmueble | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accionError, setAccionError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  function cargar() {
    if (!id) return;
    setLoading(true);
    setError(null);
    obtenerInmueble(id)
      .then(setInmueble)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : 'No se pudo cargar el inmueble.'),
      )
      .finally(() => setLoading(false));
  }

  useEffect(cargar, [id]);

  if (loading) return <LoadingState mensaje="Cargando inmueble..." />;
  if (error) return <ErrorState mensaje={error} onReintentar={cargar} />;
  if (!inmueble || !usuario) return null;

  const esPropio = inmueble.vendedorId === usuario.id;
  const precio = Number(inmueble.precio).toLocaleString('es', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  async function handleCambiarEstado(destino: EstadoCodigo) {
    setAccionError(null);
    setProcesando(true);
    try {
      const actualizado = await cambiarEstadoInmueble(id!, destino);
      setInmueble(actualizado);
    } catch (err) {
      setAccionError(
        err instanceof ApiError ? err.message : 'No se pudo cambiar el estado.',
      );
    } finally {
      setProcesando(false);
    }
  }

  async function handleEliminar() {
    setAccionError(null);
    setProcesando(true);
    try {
      await eliminarInmueble(id!);
      navigate('/inmuebles', { replace: true });
    } catch (err) {
      setAccionError(
        err instanceof ApiError ? err.message : 'No se pudo eliminar el inmueble.',
      );
      setProcesando(false);
    }
  }

  const transiciones = esPropio ? TRANSICIONES_VALIDAS[inmueble.estado.codigo] : [];

  return (
    <div className="detalle-page">
      <div className="detalle-header">
        <h1>{inmueble.direccion}</h1>
        <EstadoBadge estado={inmueble.estado.codigo} />
      </div>

      <div className="detalle-card">
        <dl className="detalle-datos">
          <dt>Tipo</dt>
          <dd>{inmueble.tipoInmueble.nombre}</dd>
          <dt>Precio</dt>
          <dd>{precio}</dd>
          <dt>Habitaciones</dt>
          <dd>{inmueble.habitaciones}</dd>
          <dt>Metros cuadrados</dt>
          <dd>{Number(inmueble.metrosCuadrados)} m²</dd>
          <dt>Vendedor</dt>
          <dd>
            {inmueble.vendedor.nombre} ({inmueble.vendedor.email})
          </dd>
          <dt>Publicado</dt>
          <dd>{new Date(inmueble.createdAt).toLocaleDateString()}</dd>
        </dl>

        {accionError && <ErrorState mensaje={accionError} />}

        {esPropio && (
          <div className="detalle-acciones">
            {inmueble.estado.codigo !== 'VENDIDO' && (
              <Link to={`/inmuebles/${inmueble.id}/editar`} className="boton-secundario">
                Editar
              </Link>
            )}
            <button
              type="button"
              className="boton-peligro"
              disabled={procesando}
              onClick={handleEliminar}
            >
              Eliminar
            </button>
            {transiciones.map((t) => (
              <button
                key={t.destino}
                type="button"
                className="boton-primario"
                disabled={procesando}
                onClick={() => handleCambiarEstado(t.destino)}
              >
                {t.etiqueta}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
