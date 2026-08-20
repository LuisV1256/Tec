import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import { ApiError } from '../types/api';
import '../pages/Login.css';

export function AddUser() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, con letras y números.');
      return;
    }

    setLoading(true);
    try {
      await register(nombre, email, password);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Crear cuenta</h1>
        <p className="login-subtitle">Gestión de usuarios e inmuebles</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            className="login-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            minLength={2}
            required
          />

          <label className="login-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@empresa.com"
            required
          />

          <label className="login-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres, letras y números"
            minLength={8}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="login-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
