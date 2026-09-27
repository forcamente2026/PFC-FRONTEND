import { Navigate, useOutletContext } from "react-router-dom";

// Irma da RotaProtegida: aquela exige sessao, esta exige sessao E papel.
// Quem nao tem o papel volta para a home, sem explicacao — a existencia da
// tela nao e informacao que interesse a quem nao pode entrar.
function RotaPorPapel({ papeis, children }) {
  const { usuario } = useOutletContext();

  if (!usuario || !papeis.includes(usuario.papel)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaPorPapel;
