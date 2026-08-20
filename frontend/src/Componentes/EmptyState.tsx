import './EstadosUI.css';

export function EmptyState({ mensaje }: { mensaje: string }) {
  return (
    <div className="estado-ui estado-ui--vacio">
      <p>{mensaje}</p>
    </div>
  );
}
