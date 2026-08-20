import type { EstadoCodigo } from '../types/inmueble';
import './EstadoBadge.css';

const ETIQUETAS: Record<EstadoCodigo, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADO: 'Reservado',
  VENDIDO: 'Vendido',
};

export function EstadoBadge({ estado }: { estado: EstadoCodigo }) {
  return (
    <span className={`estado-badge estado-badge--${estado.toLowerCase()}`}>
      {ETIQUETAS[estado]}
    </span>
  );
}
