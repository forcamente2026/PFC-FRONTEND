import { useEffect } from "react";
import { X } from "lucide-react";

const ESTILO_FUNDO = "fixed inset-0 bg-black/75 z-50";
const ESTILO_CAIXA =
  "max-w-2/3 max-h-2/3 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 overflow-auto border bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20";

function Modal({ isOpen, children, setCloseModal }) {
  useEffect(() => {
    if (!isOpen) return;

    function aoTeclar(evento) {
      if (evento.key === "Escape") setCloseModal();
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [isOpen, setCloseModal]);

  if (!isOpen) return null;

  return (
    <div className={ESTILO_FUNDO}>
      <div role="dialog" aria-modal="true" className={ESTILO_CAIXA}>
        {children}
        <button
          type="button"
          aria-label="Fechar"
          onClick={setCloseModal}
          className="text-white absolute top-4 right-4 hover:text-red-200 cursor-pointer"
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default Modal;
