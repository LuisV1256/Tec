import './EstadosUI.css';

export function LoadingState({ mensaje = 'Cargando...' }: { mensaje?: string }) {
  return (
    <div className="estado-ui estado-ui--cargando">
      <div className="spinner" />
      <p>{mensaje}</p>
    </div>
  );
}
