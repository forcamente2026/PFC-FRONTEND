import { useEffect, useState } from "react";

const TABLET = "(min-width: 768px)";
const DESKTOP = "(min-width: 1280px)";

function medir() {
  try {
    if (window.matchMedia(DESKTOP).matches) return 4;
    if (window.matchMedia(TABLET).matches) return 3;

    return 0;
  } catch {
    return 0;
  }
}

function useColunasDaGrade() {
  const [maximo, setMaximo] = useState(medir);

  useEffect(() => {
    const consultas = [window.matchMedia(TABLET), window.matchMedia(DESKTOP)];

    function aoMudar() {
      setMaximo(medir());
    }

    consultas.forEach((consulta) => consulta.addEventListener("change", aoMudar));

    return () =>
      consultas.forEach((consulta) => consulta.removeEventListener("change", aoMudar));
  }, []);

  return maximo;
}

export default useColunasDaGrade;
