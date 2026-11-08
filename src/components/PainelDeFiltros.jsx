import { useState } from "react";
import { Menu, X } from "lucide-react";

function PainelDeFiltros({ id, rotulo, resumo, children }) {
  const [aberto, setAberto] = useState(false);

  function fechar() {
    setAberto(false);
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((atual) => !atual)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-gray-500 p-3 text-red-200 hover:bg-red-500 hover:text-white xl:hidden"
      >
        <span className="flex items-center gap-2 font-medium">
          {aberto ? <X size={20} /> : <Menu size={20} />}
          {rotulo}
        </span>
        <span className="text-sm">{resumo}</span>
      </button>

      <div id={id} className={`${aberto ? "flex" : "hidden"} flex-col gap-4 xl:flex`}>
        {typeof children === "function" ? children({ fechar }) : children}
      </div>
    </>
  );
}

export default PainelDeFiltros;
