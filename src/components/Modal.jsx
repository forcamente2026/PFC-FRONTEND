import Dialogo from "./Dialogo";

const ESTILO_TAMANHO_PADRAO = "max-w-2/3 max-h-2/3";
const ESTILO_TAMANHO_LARGO =
  "w-[calc(100%_-_2rem)] max-w-2xl max-h-[85%] [scrollbar-color:var(--color-gray-600)_transparent]";
const ESTILO_CAIXA =
  "px-5 py-2 border bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20";

function Modal({ isOpen, children, setCloseModal, largo = false }) {
  return (
    <Dialogo
      isOpen={isOpen}
      setCloseModal={setCloseModal}
      className={`${ESTILO_CAIXA} ${largo ? ESTILO_TAMANHO_LARGO : ESTILO_TAMANHO_PADRAO}`}
      classeFechar="text-white hover:text-red-200 cursor-pointer"
    >
      {children}
    </Dialogo>
  );
}

export default Modal;
