import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTiposInmueble } from '../hooks/useTiposInmueble';
import { useAuth } from '../hooks/useAuth';
import { actualizarInmueble, obtenerInmueble } from '../services/inmuebles.service';
import type { Inmueble } from '../types/inmueble';
import { ApiError } from '../types/api';
import { TIPOS_SIN_HABITACIONES } from '../types/tipoInmueble';
import { LoadingState } from '../Componentes/LoadingState';
import { ErrorState } from '../Componentes/ErrorState';
import '../Componentes/botones.css';
import './InmuebleForm.css';

export function EditInmueble() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { tipos, loading: cargandoTipos } = useTiposInmueble();

  const [inmueble, setInmueble] = useState<Inmueble | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const [direccion, setDireccion] = useState('');
  const [precio, setPrecio] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [metrosCuadrados, setMetrosCuadrados] = useState('');
  const [tipoInmuebleId, setTipoInmuebleId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!id) return;
    obtenerInmueble(id)
      .then((data) => {
        setInmueble(data);
        setDireccion(data.direccion);
        setPrecio(data.precio);
        setHabitaciones(String(data.habitaciones));
        setMetrosCuadrados(data.metrosCuadrados);
        setTipoInmuebleId(data.tipoInmuebleId);
      })
      .catch((err) =>
        setErrorCarga(err instanceof ApiError ? err.message : 'No se pudo cargar el inmueble.'),
      )
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando || cargandoTipos) return <LoadingState mensaje="Cargando inmueble..." />;
  if (errorCarga) return <ErrorState mensaje={errorCarga} />;
  if (!inmueble || !usuario) return null;

  if (inmueble.vendedorId !== usuario.id) {
    return <ErrorState mensaje="No tienes permiso para editar este inmueble." />;
  }

  const esVendido = inmueble.estado.codigo === 'VENDIDO';

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

    setEnviando(true);
    try {
      await actualizarInmueble(id!, {
        direccion,
        precio: Number(precio),
        habitaciones: sinHabitaciones ? 0 : Number(habitaciones),
        metrosCuadrados: Number(metrosCuadrados),
        tipoInmuebleId,
      });
      navigate(`/inmuebles/${id}`, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar el inmueble.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="form-page">
      <h1>Editar inmueble</h1>

      {esVendido && (
        <p className="form-error">
          Este inmueble está VENDIDO — es un estado final y no se puede editar.
        </p>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <fieldset disabled={esVendido} style={{ border: 'none', padding: 0, margin: 0 }}>
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
              {enviando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
