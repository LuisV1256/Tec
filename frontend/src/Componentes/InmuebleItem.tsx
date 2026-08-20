import { Link } from 'react-router-dom';
import type { Inmueble } from '../types/inmueble';
import { EstadoBadge } from './EstadoBadge';
import './InmuebleItem.css';

interface InmuebleItemProps {
  inmueble: Inmueble;
  usuarioActualId: string;
  onEliminar: (id: string) => void;
}

export function InmuebleItem({ inmueble, usuarioActualId, onEliminar }: InmuebleItemProps) {
  const esPropio = inmueble.vendedorId === usuarioActualId;
  const precio = Number(inmueble.precio).toLocaleString('es', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

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
          <Link to={`/inmuebles/${inmueble.id}/editar`} className="boton-secundario">
            Editar
          </Link>
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
