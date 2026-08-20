import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTiposInmueble } from '../hooks/useTiposInmueble';
import { crearInmueble } from '../services/inmuebles.service';
import { ApiError } from '../types/api';
import { TIPOS_SIN_HABITACIONES } from '../types/tipoInmueble';
import { LoadingState } from '../Componentes/LoadingState';
import { ErrorState } from '../Componentes/ErrorState';
import '../Componentes/botones.css';
import './InmuebleForm.css';

export function AddInmueble() {
  const navigate = useNavigate();
  const { tipos, loading: cargandoTipos, error: errorTipos } = useTiposInmueble();

  const [direccion, setDireccion] = useState('');
  const [precio, setPrecio] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [metrosCuadrados, setMetrosCuadrados] = useState('');
  const [tipoInmuebleId, setTipoInmuebleId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const tipoSeleccionado = tipos.find((t) => t.id === tipoInmuebleId);
  const sinHabitaciones = tipoSeleccionado
    ? TIPOS_SIN_HABITACIONES.includes(tipoSeleccionado.codigo)
    : false;

  function handleCambiarTipo(nuevoTipoId: string) {
    setTipoInmuebleId(nuevoTipoId);
    const nuevoTipo = tipos.find((t) => t.id === nuevoTipoId);
    if (nuevoTipo && TIPOS_SIN_HABITACIONES.includes(nuevoTipo.codigo)) {
      setHabitaciones('0');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (Number(precio) <= 0) {
      setError('El precio debe ser mayor que cero.');
      return;
    }
    if (!tipoInmuebleId) {
      setError('Selecciona un tipo de inmueble.');
      return;
    }

    setEnviando(true);
    try {
      const inmueble = await crearInmueble({
        direccion,
        precio: Number(precio),
        habitaciones: sinHabitaciones ? 0 : Number(habitaciones),
        metrosCuadrados: Number(metrosCuadrados),
        tipoInmuebleId,
      });
      navigate(`/inmuebles/${inmueble.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear el inmueble.');
    } finally {
      setEnviando(false);
    }
  }

  if (cargandoTipos) return <LoadingState mensaje="Cargando tipos de inmueble..." />;
  if (errorTipos) return <ErrorState mensaje={errorTipos} />;

  return (
    <div className="form-page">
      <h1>Nuevo inmueble</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-campo">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="form-campo">
          <label htmlFor="tipo">Tipo de inmueble</label>
          <select
            id="tipo"
            value={tipoInmuebleId}
            onChange={(e) => handleCambiarTipo(e.target.value)}
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-fila">
          <div className="form-campo">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              type="number"
              min="0.01"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <div className="form-campo">
            <label htmlFor="habitaciones">Habitaciones</label>
            <input
              id="habitaciones"
              type="number"
              min="0"
              value={sinHabitaciones ? '0' : habitaciones}
              onChange={(e) => setHabitaciones(e.target.value)}
              disabled={sinHabitaciones}
              required={!sinHabitaciones}
            />
          </div>
        </div>

        <div className="form-campo">
          <label htmlFor="metros">Metros cuadrados</label>
          <input
            id="metros"
            type="number"
            min="0.01"
            step="0.01"
            value={metrosCuadrados}
            onChange={(e) => setMetrosCuadrados(e.target.value)}
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-acciones">
          <button type="submit" className="boton-primario" disabled={enviando}>
            {enviando ? 'Creando...' : 'Crear inmueble'}
          </button>
        </div>
      </form>
    </div>
  );
}
