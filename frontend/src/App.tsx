import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './Componentes/ProtectedRoute';
import { Layout } from './Componentes/Layout';
import { Login } from './pages/Login';
import { AddUser } from './pages/AddUser';
import { UserList } from './pages/UserList';
import { InmuebleList } from './pages/InmuebleList';
import { AddInmueble } from './pages/AddInmueble';
import { EditInmueble } from './pages/EditInmueble';
import { InmuebleDetalle } from './pages/InmuebleDetalle';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<AddUser />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/inmuebles" replace />} />
            <Route path="/usuarios" element={<UserList />} />
            <Route path="/inmuebles" element={<InmuebleList />} />
            <Route path="/inmuebles/nuevo" element={<AddInmueble />} />
            <Route path="/inmuebles/:id" element={<InmuebleDetalle />} />
            <Route path="/inmuebles/:id/editar" element={<EditInmueble />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
