import { useState } from "react";
import { formatarCref } from "../utils/formatar";

const ESTILO_ROTULO = "text-sm text-gray-300";
const ESTILO_CAMPO =
  "w-full rounded-xl border border-gray-600 bg-slate-800 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none";
const ESTILO_BOTAO_PRIMARIO =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function RenovarCref({ crefAtual, formacaoAtual, formacoes, aoRenovar, aoCancelar }) {
  const [cref, setCref] = useState(crefAtual ?? "");
  const [formacao, setFormacao] = useState(formacaoAtual ?? "");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);
    try {
      await aoRenovar(cref, formacao || null);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível enviar o CREF para verificação.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="w-full max-w-xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Atualizar CREF</h2>
      <p className="mb-5 text-sm text-gray-400">
        Use quando o seu registro ou a sua formação mudarem, ou para pedir uma nova
        verificação.
      </p>

      <div className="mb-5 rounded-xl border border-yellow-500 bg-yellow-500/10 p-4 text-sm text-yellow-100">
        Ao enviar, a verificação volta para pendente. A partir do próximo login, sua
        conta fica com as permissões de aluno até um administrador conferir o CREF
        de novo.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="renovacao-cref" className={ESTILO_ROTULO}>
            CREF
          </label>
          <input
            type="text"
            id="renovacao-cref"
            value={cref}
            onChange={(evento) => setCref(formatarCref(evento.target.value))}
            maxLength={11}
            placeholder="000000-G/UF"
            className={ESTILO_CAMPO}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="renovacao-formacao" className={ESTILO_ROTULO}>
            Formação
          </label>
          <select
            id="renovacao-formacao"
            value={formacao}
            onChange={(evento) => setFormacao(evento.target.value)}
            className={ESTILO_CAMPO}
          >
            <option value="">Selecione uma formação</option>
            {formacoes.map((opcao) => (
              <option key={opcao.codigo} value={opcao.codigo}>
                {opcao.descricao}
              </option>
            ))}
          </select>
        </div>
      </div>

      {erro && (
        <p role="alert" className="mt-4 text-sm text-red-400">
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

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={aoCancelar}
          disabled={enviando}
          className={ESTILO_BOTAO_SECUNDARIO}
        >
          Cancelar
        </button>
        <button type="submit" disabled={enviando} className={ESTILO_BOTAO_PRIMARIO}>
          {enviando ? "Enviando..." : "Enviar para verificação"}
        </button>
      </div>
    </form>
  );
}

export default RenovarCref;