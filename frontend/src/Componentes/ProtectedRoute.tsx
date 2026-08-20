import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingState } from './LoadingState';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <LoadingState mensaje="Verificando sesión..." />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
