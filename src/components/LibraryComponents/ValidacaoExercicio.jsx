import { useId, useState } from "react";
import ListaDeErros from "../QuizComponents/ListaDeErros";
import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import { alterarStatusExercicio } from "../../services/exercicioService";
import { estaEmAnalise } from "../../utils/moderacao";

const LIMITE_MOTIVO = 500;

function ValidacaoExercicio({ exercicio, aoAlterarStatus }) {
  const campoMotivo = useId();
  const [rejeitando, setRejeitando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  const emAnalise = estaEmAnalise(exercicio);
  const quemAprovou = exercicio.professoresQueAprovaram ?? [];

  async function alterar(status) {
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      const atualizado = await alterarStatusExercicio(
        exercicio.id,
        status,
        status === "REJEITADO" ? motivo : undefined,
      );
      setRejeitando(false);
      setMotivo("");
      aoAlterarStatus(atualizado);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível alterar a situação.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  function cancelarRejeicao() {
    setRejeitando(false);
    setMotivo("");
    setErro(null);
    setCamposComErro([]);
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
        Validação do administrador
      </p>
      <p className="mt-1 text-sm text-gray-300">
        Situação atual:{" "}
        <span className="font-semibold text-white">
          {STATUS_ARTIGO[exercicio.status]?.descricao ?? exercicio.status}
        </span>
      </p>
      <p className="mt-1 text-sm text-gray-300">
        Aprovações dos professores: {exercicio.aprovacoesDeProfessores} de{" "}
        {exercicio.aprovacoesNecessarias}
        {quemAprovou.length > 0 && ` (${quemAprovou.join(", ")})`}
      </p>

      <div className="mt-2">
        <ListaDeErros erro={erro} campos={camposComErro} />
      </div>

      {emAnalise && !rejeitando && (
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={enviando}
            onClick={() => alterar("APROVADO")}
            className="rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? "Salvando..." : "Aprovar"}
          </button>
          <button
            type="button"
            disabled={enviando}
            onClick={() => setRejeitando(true)}
            className="rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Rejeitar
          </button>
        </div>
      )}

      {emAnalise && rejeitando && (
        <div className="mt-3 flex flex-col gap-2">
          <label htmlFor={campoMotivo} className="text-sm text-red-200">
            Motivo da rejeição
          </label>
          <textarea
            id={campoMotivo}
            value={motivo}
            onChange={(evento) => setMotivo(evento.target.value)}
            rows={3}
            maxLength={LIMITE_MOTIVO}
            placeholder="Explique ao autor o que precisa ser corrigido"
            className="bg-gray-500 rounded-xl p-2 text-white"
          />
          <span className="self-end text-sm text-gray-300">
            {motivo.length}/{LIMITE_MOTIVO}
          </span>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={enviando}
              onClick={cancelarRejeicao}
              className="rounded-md border border-gray-700 py-2 px-4 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={enviando}
              onClick={() => alterar("REJEITADO")}
              className="rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? "Salvando..." : "Confirmar rejeição"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidacaoExercicio;
