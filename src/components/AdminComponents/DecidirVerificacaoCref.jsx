import { useState } from "react";
import { formatarDataCurta } from "../../utils/formatar";

const LIMITE_MOTIVO = 500;

const ESTILO_BOTAO_APROVAR =
  "rounded-md bg-green-600 py-2 px-4 font-bold text-white hover:bg-green-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_GRAVE =
  "rounded-md bg-red-600 py-2 px-4 font-bold text-white hover:bg-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function DecidirVerificacaoCref({ professor, formacao, aoDecidir, aoCancelar }) {
  const [rejeitando, setRejeitando] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  async function decidir(status) {
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);
    try {
      await aoDecidir(status, status === "REJEITADO" ? motivo : undefined);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível registrar a decisão.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  function voltar() {
    setRejeitando(false);
    setMotivo("");
    setErro(null);
    setCamposComErro([]);
  }

  return (
    <div className="w-full max-w-xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Verificar CREF</h2>
      <p className="mb-5 text-sm text-gray-400">
        Confira o registro no conselho antes de decidir. A aprovação vale a partir
        do próximo login do professor; até lá, ele continua com as permissões de aluno.
      </p>

      <div className="mb-5 rounded-xl border border-gray-700 p-4">
        <span className="block text-white">{professor.nomeCompleto}</span>
        <span className="block text-sm text-gray-400">{professor.email}</span>
        <span className="mt-3 block text-sm text-gray-300">
          CREF: <strong className="text-white">{professor.cref}</strong>
        </span>
        <span className="block text-sm text-gray-300">Formação: {formacao}</span>
        <span className="mt-2 block text-xs text-gray-400">
          Cadastro em {formatarDataCurta(professor.criadoEm)}
        </span>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-red-400">
          {erro}
        </p>
      )}
      {camposComErro.length > 0 && (
        <ul className="mt-1 list-disc pl-6 text-sm text-red-400">
          {camposComErro.map((campo) => (
            <li key={`${campo.campo}-${campo.mensagem}`}>{campo.mensagem}</li>
          ))}
        </ul>
      )}

      {rejeitando ? (
        <div className="mt-4 flex flex-col gap-2">
          <label htmlFor="motivo-rejeicao-cref" className="text-sm text-red-200">
            Motivo da rejeição
          </label>
          <textarea
            id="motivo-rejeicao-cref"
            value={motivo}
            onChange={(evento) => setMotivo(evento.target.value)}
            rows={3}
            maxLength={LIMITE_MOTIVO}
            placeholder="Explique ao professor o que precisa ser corrigido"
            className="bg-gray-500 rounded-xl p-2 text-white"
          />
          <span className="self-end text-sm text-gray-300">
            {motivo.length}/{LIMITE_MOTIVO}
          </span>
          <div className="mt-2 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={voltar}
              disabled={enviando}
              className={ESTILO_BOTAO_SECUNDARIO}
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => decidir("REJEITADO")}
              disabled={enviando}
              className={ESTILO_BOTAO_GRAVE}
            >
              {enviando ? "Salvando..." : "Confirmar rejeição"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={aoCancelar}
            disabled={enviando}
            className={ESTILO_BOTAO_SECUNDARIO}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => setRejeitando(true)}
            disabled={enviando}
            className={ESTILO_BOTAO_GRAVE}
          >
            Rejeitar
          </button>
          <button
            type="button"
            onClick={() => decidir("APROVADO")}
            disabled={enviando}
            className={ESTILO_BOTAO_APROVAR}
          >
            {enviando ? "Salvando..." : "Aprovar"}
          </button>
        </div>
      )}
    </div>
  );
}

export default DecidirVerificacaoCref;