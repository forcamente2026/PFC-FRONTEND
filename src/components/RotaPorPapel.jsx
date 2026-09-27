import { Navigate, useOutletContext } from "react-router-dom";

function RotaPorPapel({ papeis, children }) {
  const { usuario } = useOutletContext();

  if (!usuario || !papeis.includes(usuario.papel)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaPorPapel;
