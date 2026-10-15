import { useState } from "react";
import Modal from "../Modal";
import { excluirArtigo } from "../../services/artigoService";

function ExcluirArtigo({ artigo, usuario, aoExcluir }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function fecharModal() {
    setModalAberto(false);
    setErro(null);
  }

  async function confirmarExclusao() {
    setEnviando(true);
    setErro(null);

    try {
      await excluirArtigo(artigo.id, usuario);
      aoExcluir();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível excluir o artigo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalAberto(true)}
        className="rounded-md border border-red-500 py-2 px-4 font-bold text-red-200 hover:bg-red-500 hover:text-white cursor-pointer"
      >
        Excluir
      </button>

      <Modal isOpen={modalAberto} setCloseModal={fecharModal}>
        <div className="p-4 max-w-md space-y-4">
          <h1 className="text-red-200 text-center font-montserrat text-2xl">
            EXCLUIR ARTIGO
          </h1>
          <div className="w-full h-px bg-gray-300"></div>

          <p className="text-white">
            Tem certeza que deseja excluir{" "}
            <span className="text-red-200">{artigo.titulo}</span>? Esta ação não
            pode ser desfeita.
          </p>

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={fecharModal}
              disabled={enviando}
              className="flex-1 rounded-md border border-gray-700 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarExclusao}
              disabled={enviando}
              className="flex-1 rounded-md bg-red-500 py-2 text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ExcluirArtigo;