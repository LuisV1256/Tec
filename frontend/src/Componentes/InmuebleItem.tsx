import { Link } from 'react-router-dom';
import type { EstadoCodigo, Inmueble } from '../types/inmueble';
import { TRANSICIONES_VALIDAS } from '../types/inmueble';
import { EstadoBadge } from './EstadoBadge';
import './InmuebleItem.css';

interface InmuebleItemProps {
  inmueble: Inmueble;
  usuarioActualId: string;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, destino: EstadoCodigo) => void;
}

export function InmuebleItem({
  inmueble,
  usuarioActualId,
  onEliminar,
  onCambiarEstado,
}: InmuebleItemProps) {
  const esPropio = inmueble.vendedorId === usuarioActualId;
  const precio = Number(inmueble.precio).toLocaleString('es', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  const transiciones = TRANSICIONES_VALIDAS[inmueble.estado.codigo];

  return (
    <div className="inmueble-item">
      <div className="inmueble-item-header">
        <Link to={`/inmuebles/${inmueble.id}`} className="inmueble-item-direccion">
          {inmueble.direccion}
        </Link>
        <EstadoBadge estado={inmueble.estado.codigo} />
      </div>

      <p className="inmueble-item-tipo">{inmueble.tipoInmueble.nombre}</p>

      <div className="inmueble-item-datos">
        <span>{precio}</span>
        <span>{inmueble.habitaciones} hab.</span>
        <span>{Number(inmueble.metrosCuadrados)} m²</span>
      </div>

      {esPropio && (
        <div className="inmueble-item-acciones">
          {inmueble.estado.codigo !== 'VENDIDO' && (
            <Link to={`/inmuebles/${inmueble.id}/editar`} className="boton-secundario">
              Editar
            </Link>
          )}
          {transiciones.map((t) => (
            <button
              key={t.destino}
              type="button"
              className="boton-primario"
              onClick={() => onCambiarEstado(inmueble.id, t.destino)}
            >
              {t.etiqueta}
            </button>
          ))}
          <button
            type="button"
            className="boton-peligro"
            onClick={() => onEliminar(inmueble.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
