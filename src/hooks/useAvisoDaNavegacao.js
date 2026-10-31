import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useAvisoDaNavegacao() {
  const location = useLocation();
  const navigate = useNavigate();
  const [aviso] = useState(location.state?.aviso ?? null);

  useEffect(() => {
    if (location.state?.aviso) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return aviso;
}

export default useAvisoDaNavegacao;
