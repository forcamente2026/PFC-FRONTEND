import { useState } from "react";
import Modal from "../Modal";
import { excluirQuiz } from "../../services/quizService";

function ExcluirQuiz({ quiz, usuario, aoExcluir }) {
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
      await excluirQuiz(quiz.id, usuario);
      aoExcluir();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível excluir o quiz.");
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
        <div className="max-w-md space-y-4 p-4">
          <h2 className="text-xl font-bold text-white">Excluir quiz</h2>
          <p className="text-sm text-gray-300">
            O quiz "{quiz.titulo}" e as notas de quem já respondeu serão apagados. Esta
            ação não tem volta.
          </p>
          {erro && (
            <p role="alert" className="text-sm text-red-400">
              {erro}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={fecharModal}
              disabled={enviando}
              className="rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarExclusao}
              disabled={enviando}
              className="rounded-md bg-red-600 py-2 px-4 font-bold text-white hover:bg-red-800 cursor-pointer disabled:opacity-50"
            >
              {enviando ? "Excluindo..." : "Excluir quiz"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ExcluirQuiz;
