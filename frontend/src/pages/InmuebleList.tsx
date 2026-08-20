import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInmuebles } from '../hooks/useInmuebles';
import { useTiposInmueble } from '../hooks/useTiposInmueble';
import { useAuth } from '../hooks/useAuth';
import { cambiarEstadoInmueble, eliminarInmueble } from '../services/inmuebles.service';
import { InmuebleItem } from '../Componentes/InmuebleItem';
import { LoadingState } from '../Componentes/LoadingState';
import { ErrorState } from '../Componentes/ErrorState';
import { EmptyState } from '../Componentes/EmptyState';
import type { EstadoCodigo, FiltrosInmuebles } from '../types/inmueble';
import { ApiError } from '../types/api';
import '../Componentes/botones.css';
import './Listas.css';

const LIMIT = 12;

export function InmuebleList() {
  const { usuario } = useAuth();
  const { tipos } = useTiposInmueble();

  const [page, setPage] = useState(1);
  const [estado, setEstado] = useState<EstadoCodigo | ''>('');
  const [tipoInmuebleId, setTipoInmuebleId] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [soloMios, setSoloMios] = useState(false);
  const [orderBy, setOrderBy] = useState<'precio' | 'createdAt'>('createdAt');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [accionError, setAccionError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const filtros: FiltrosInmuebles = {
    page,
    limit: LIMIT,
    estado: estado || undefined,
    tipoInmuebleId: tipoInmuebleId || undefined,
    precioMin: precioMin ? Number(precioMin) : undefined,
    precioMax: precioMax ? Number(precioMax) : undefined,
    search: search || undefined,
    soloMios: soloMios || undefined,
    orderBy,
    order,
  };

  const { respuesta, loading, error, recargar } = useInmuebles(filtros);

  async function handleEliminar(id: string) {
    setAccionError(null);
    try {
      await eliminarInmueble(id);
      recargar();
    } catch (err) {
      setAccionError(
        err instanceof ApiError ? err.message : 'No se pudo eliminar el inmueble.',
      );
    }
  }

  async function handleCambiarEstado(id: string, destino: EstadoCodigo) {
    setAccionError(null);
    try {
      await cambiarEstadoInmueble(id, destino);
      recargar();
    } catch (err) {
      setAccionError(
        err instanceof ApiError ? err.message : 'No se pudo cambiar el estado.',
      );
    }
  }

  return (
    <div className="lista-page">
      <div className="lista-page-header">
        <h1>Inmuebles</h1>
        <Link to="/inmuebles/nuevo" className="boton-primario">
          + Nuevo inmueble
        </Link>
      </div>

      <div className="filtros">
        <select value={estado} onChange={(e) => { setEstado(e.target.value as EstadoCodigo | ''); setPage(1); }}>
          <option value="">Todos los estados</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="RESERVADO">Reservado</option>
          <option value="VENDIDO">Vendido</option>
        </select>

        <select value={tipoInmuebleId} onChange={(e) => { setTipoInmuebleId(e.target.value); setPage(1); }}>
          <option value="">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Precio mín."
          value={precioMin}
          onChange={(e) => { setPrecioMin(e.target.value); setPage(1); }}
        />
        <input
          type="number"
          placeholder="Precio máx."
          value={precioMax}
          onChange={(e) => { setPrecioMax(e.target.value); setPage(1); }}
        />

        <input
          type="text"
          placeholder="Buscar por dirección..."
          value={searchInput}
          onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
        />

        <label>
          <input
            type="checkbox"
            checked={soloMios}
            onChange={(e) => { setSoloMios(e.target.checked); setPage(1); }}
          />
          Solo mis inmuebles
        </label>

        <select
          value={`${orderBy}-${order}`}
          onChange={(e) => {
            const [ob, ord] = e.target.value.split('-') as ['precio' | 'createdAt', 'ASC' | 'DESC'];
            setOrderBy(ob);
            setOrder(ord);
          }}
        >
          <option value="createdAt-DESC">Más recientes primero</option>
          <option value="createdAt-ASC">Más antiguos primero</option>
          <option value="precio-ASC">Precio: menor a mayor</option>
          <option value="precio-DESC">Precio: mayor a menor</option>
        </select>
      </div>

      {accionError && <ErrorState mensaje={accionError} />}

      {loading && <LoadingState mensaje="Cargando inmuebles..." />}
      {!loading && error && <ErrorState mensaje={error} onReintentar={recargar} />}
      {!loading && !error && respuesta && respuesta.data.length === 0 && (
        <EmptyState mensaje="No se encontraron inmuebles con esos filtros." />
      )}

      {!loading && !error && respuesta && respuesta.data.length > 0 && usuario && (
        <>
          <div className="inmuebles-grid">
            {respuesta.data.map((inmueble) => (
              <InmuebleItem
                key={inmueble.id}
                inmueble={inmueble}
                usuarioActualId={usuario.id}
                onEliminar={handleEliminar}
                onCambiarEstado={handleCambiarEstado}
              />
            ))}
          </div>

          <div className="paginacion">
            <button
              type="button"
              className="boton-secundario"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>
              Página {respuesta.meta.page} de {respuesta.meta.totalPages || 1} ({respuesta.meta.total} inmuebles)
            </span>
            <button
              type="button"
              className="boton-secundario"
              disabled={page >= respuesta.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
