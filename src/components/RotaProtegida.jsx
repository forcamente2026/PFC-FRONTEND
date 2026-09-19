import { Navigate, useOutletContext } from "react-router-dom";

function RotaProtegida({ children }) {
    const { usuario } = useOutletContext();

    if (!usuario) return <Navigate to="/" replace />;

    return children;
}

export default RotaProtegida;