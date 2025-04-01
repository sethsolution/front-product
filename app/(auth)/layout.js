export default function AuthLayout({ children }) {
  // TODO: validar que el jwt sea valido y que el usuario este autenticado para no reiniciar la sesion

  return <div>{children}</div>;
}
