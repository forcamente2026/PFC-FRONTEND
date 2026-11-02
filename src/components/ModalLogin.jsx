import { useEffect } from "react";
import { X } from "lucide-react";

function ModalLogin({ isOpen, children, setCloseModal }) {
  const BackEstilo = "fixed inset-0 bg-black/75 z-50";
  const modalEstilo =
    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-400-50 px-5 py-2 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20 border";

  useEffect(() => {
    if (!isOpen) return;

    function aoTeclar(evento) {
      if (evento.key === "Escape") setCloseModal();
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [isOpen, setCloseModal]);

  if (isOpen) {
    return (
      <div className={BackEstilo}>
        <div role="dialog" aria-modal="true" className={modalEstilo}>
          {children}
          <button
            type="button"
            aria-label="Fechar"
            onClick={setCloseModal}
            className="absolute top-4 right-4 hover:text-white hover:bg-red-200 cursor-pointer text-4xl"
          >
            <X />
          </button>
        </div>
      </div>
    );
  }
  return null;
}

export default ModalLogin;
