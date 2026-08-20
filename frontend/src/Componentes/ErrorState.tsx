import './EstadosUI.css';

export function ErrorState({
  mensaje,
  onReintentar,
}: {
  mensaje: string;
  onReintentar?: () => void;
}) {
  return (
    <div className="estado-ui estado-ui--error">
      <p>{mensaje}</p>
      {onReintentar && (
        <button type="button" onClick={onReintentar} className="boton-reintentar">
          Reintentar
        </button>
      )}
    </div>
  );
}
