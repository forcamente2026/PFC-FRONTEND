import { useState } from "react";
import CampoSenha from "./CampoSenha";
import ForcaSenha from "./ComponentesCadastro/ForcaSenha";
import { avaliarSenha } from "./ComponentesCadastro/senhaRegras";

const ESTILO_ROTULO = "text-sm text-gray-300";
const ESTILO_CAMPO =
  "w-full rounded-xl border border-gray-600 bg-slate-800 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none";
const ESTILO_BOTAO_PRIMARIO =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function AlterarSenha({ aoAlterar, aoFechar }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);
  const [concluido, setConcluido] = useState(false);

  const avaliacao = avaliarSenha(novaSenha);
  const senhasCoincidem = confirmacao.length > 0 && confirmacao === novaSenha;
  const podeEnviar =
    senhaAtual.length > 0 && avaliacao.valida && senhasCoincidem && !enviando;

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    setCamposComErro([]);

    try {
      await aoAlterar(senhaAtual, novaSenha);
      setConcluido(true);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível alterar a senha.");
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  if (concluido) {
    return (
      <div className="w-full max-w-xl pr-8">
        <h2 className="mb-3 text-xl font-bold text-white">Senha alterada</h2>
        <p role="status" className="text-sm text-gray-300">
          Use a senha nova no próximo login. Esta sessão continua aberta.
        </p>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={aoFechar} className={ESTILO_BOTAO_PRIMARIO}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="w-full max-w-xl pr-8">
      <h2 className="mb-5 text-xl font-bold text-white">Alterar senha</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="senha-atual" className={ESTILO_ROTULO}>
            Senha atual
          </label>
          <CampoSenha
            id="senha-atual"
            name="senhaAtual"
            valor={senhaAtual}
            aoAlterar={(evento) => setSenhaAtual(evento.target.value)}
            autoComplete="current-password"
            className={ESTILO_CAMPO}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="senha-nova" className={ESTILO_ROTULO}>
            Nova senha
          </label>
          <CampoSenha
            id="senha-nova"
            name="novaSenha"
            valor={novaSenha}
            aoAlterar={(evento) => setNovaSenha(evento.target.value)}
            autoComplete="new-password"
            className={ESTILO_CAMPO}
          />
          {novaSenha.length > 0 && <ForcaSenha avaliacao={avaliacao} />}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="senha-confirmacao" className={ESTILO_ROTULO}>
            Repita a nova senha
          </label>
          <CampoSenha
            id="senha-confirmacao"
            name="confirmacao"
            valor={confirmacao}
            aoAlterar={(evento) => setConfirmacao(evento.target.value)}
            autoComplete="new-password"
            className={ESTILO_CAMPO}
          />
          {confirmacao.length > 0 && !senhasCoincidem && (
            <p className="text-sm text-red-400">As senhas não coincidem</p>
          )}
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
          onClick={aoFechar}
          disabled={enviando}
          className={ESTILO_BOTAO_SECUNDARIO}
        >
          Cancelar
        </button>
        <button type="submit" disabled={!podeEnviar} className={ESTILO_BOTAO_PRIMARIO}>
          {enviando ? "Salvando..." : "Alterar senha"}
        </button>
      </div>
    </form>
  );
}

export default AlterarSenha;