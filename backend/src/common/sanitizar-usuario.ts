export function sanitizarUsuario<T extends { password: string }>(
  usuario: T,
): Omit<T, 'password'> {
  const { password, ...resto } = usuario;
  return resto;
}
