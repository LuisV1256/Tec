import { useState } from 'react';
import { Login } from './pages/Login';
import './App.css';

function App() {
  const [nombre, setNombre] = useState<string | null>(null);

  if (!nombre) {
    return <Login onSuccess={setNombre} />;
  }

  function handleLogout() {
    localStorage.removeItem('accessToken');
    setNombre(null);
  }

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <h1>Bienvenido, {nombre}</h1>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default App;
