import { useState } from "react";
import { aprovarQuiz } from "../../services/quizService";

function AprovarQuiz({ quiz, usuario, aoAprovar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function aprovar() {
    setEnviando(true);
    setErro(null);

    try {
      const atualizado = await aprovarQuiz(quiz.id, usuario);
      aoAprovar(atualizado);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível registrar a aprovação.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
        Aprovação dos professores
      </p>
      <p className="mt-1 text-sm text-gray-300">
        Este quiz tem {quiz.aprovacoesDeProfessores} de {quiz.aprovacoesNecessarias}{" "}
        aprovações. Confira as perguntas e o gabarito abaixo antes de aprovar.
      </p>

      {erro && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {erro}
        </p>
      )}

      <button
        type="button"
        onClick={aprovar}
        disabled={enviando}
        className="mt-3 rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {enviando ? "Aprovando..." : "Aprovar"}
      </button>
    </div>
  );
}

export default AprovarQuiz;
