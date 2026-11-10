import { useState } from "react";
import { aprovarExercicio } from "../../services/exercicioService";

function AprovarExercicio({ exercicio, aoAprovar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function aprovar() {
    setEnviando(true);
    setErro(null);

    try {
      const atualizado = await aprovarExercicio(exercicio.id);
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
        Este exercício tem {exercicio.aprovacoesDeProfessores} de{" "}
        {exercicio.aprovacoesNecessarias} aprovações. Confira a técnica acima antes de aprovar.
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

export default AprovarExercicio;
