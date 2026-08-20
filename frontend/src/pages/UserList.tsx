import { useState } from 'react';
import { useUsuarios } from '../hooks/useUsuarios';
import { UserItem } from '../Componentes/UserItem';
import { LoadingState } from '../Componentes/LoadingState';
import { ErrorState } from '../Componentes/ErrorState';
import { EmptyState } from '../Componentes/EmptyState';
import '../Componentes/botones.css';
import './Listas.css';

const LIMIT = 10;

export function UserList() {
  const [page, setPage] = useState(1);
  const { respuesta, loading, error, recargar } = useUsuarios(page, LIMIT);

  return (
    <div className="lista-page">
      <h1>Usuarios</h1>

      {loading && <LoadingState mensaje="Cargando usuarios..." />}
      {!loading && error && <ErrorState mensaje={error} onReintentar={recargar} />}
      {!loading && !error && respuesta && respuesta.data.length === 0 && (
        <EmptyState mensaje="No hay usuarios registrados todavía." />
      )}

      {!loading && !error && respuesta && respuesta.data.length > 0 && (
        <>
          <table className="tabla-lista">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Registrado</th>
              </tr>
            </thead>
            <tbody>
              {respuesta.data.map((usuario) => (
                <UserItem key={usuario.id} usuario={usuario} />
              ))}
            </tbody>
          </table>

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
              Página {respuesta.meta.page} de {respuesta.meta.totalPages || 1}
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
