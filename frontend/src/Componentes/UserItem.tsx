import type { Usuario } from '../types/usuario';

export function UserItem({ usuario }: { usuario: Usuario }) {
  return (
    <tr>
      <td>{usuario.nombre}</td>
      <td>{usuario.email}</td>
      <td>
        <span className={usuario.activo ? 'estado-activo' : 'estado-inactivo'}>
          {usuario.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>{new Date(usuario.createdAt).toLocaleDateString()}</td>
    </tr>
  );
}
