import { Children, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ESTILO_SETA =
  "absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/20 text-red-200 hover:bg-red-500 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-white/5 disabled:hover:text-gray-600";

function CarrosselCards({ children }) {
  const faixa = useRef(null);
  const quantidade = Children.count(children);
  const [temOverflow, setTemOverflow] = useState(false);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  useEffect(() => {
    const elemento = faixa.current;
    if (!elemento) return;

    function atualizarEstado() {
      const limite = elemento.scrollWidth - elemento.clientWidth;
      setTemOverflow(limite > 1);
      setPodeVoltar(elemento.scrollLeft > 1);
      setPodeAvancar(elemento.scrollLeft < limite - 1);
    }

    function aoGirarRoda(evento) {
      if (!evento.deltaY) return;

      const deslocamento =
        evento.deltaMode === 1 ? evento.deltaY * 16 : evento.deltaY;
      const limite = elemento.scrollWidth - elemento.clientWidth;
      const avancando = deslocamento > 0;
      const podeIrAdiante = avancando && elemento.scrollLeft < limite - 1;
      const podeIrAtras = !avancando && elemento.scrollLeft > 1;

      if (!podeIrAdiante && !podeIrAtras) return;

      evento.preventDefault();
      elemento.scrollLeft += deslocamento;
    }

    const medicaoInicial = setTimeout(atualizarEstado, 0);
    const observador = new ResizeObserver(atualizarEstado);
    observador.observe(elemento);
    elemento.addEventListener("scroll", atualizarEstado, { passive: true });
    elemento.addEventListener("wheel", aoGirarRoda, { passive: false });

    return () => {
      clearTimeout(medicaoInicial);
      observador.disconnect();
      elemento.removeEventListener("scroll", atualizarEstado);
      elemento.removeEventListener("wheel", aoGirarRoda);
    };
  }, [quantidade]);

  function mover(direcao) {
    const elemento = faixa.current;
    if (!elemento) return;

    const card = elemento.firstElementChild;
    const espacamento = parseFloat(getComputedStyle(elemento).gap) || 0;
    const passo = card
      ? card.getBoundingClientRect().width + espacamento
      : elemento.clientWidth;

    elemento.scrollBy({ left: direcao * passo, behavior: "smooth" });
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto ">
      {temOverflow ? (
        <button
          type="button"
          aria-label="Ver exercícios anteriores"
          disabled={!podeVoltar}
          onClick={() => mover(-1)}
          className={`${ESTILO_SETA} left-0`}
        >
          <ChevronLeft size={20} />
        </button>
      ) : null}

      <div
        ref={faixa}
        className="flex px-10 py-4 gap-6 overflow-hidden overflow-x-auto snap-x snap-proximity scroll-px-10 scrollbar-oculta"
      >
        {children}
      </div>

      {temOverflow ? (
        <button
          type="button"
          aria-label="Ver próximos exercícios"
          disabled={!podeAvancar}
          onClick={() => mover(1)}
          className={`${ESTILO_SETA} right-0`}
        >
          <ChevronRight size={20} />
        </button>
      ) : null}
    </div>
  );
}

export default CarrosselCards;
