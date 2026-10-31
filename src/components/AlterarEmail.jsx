import { useState } from "react";
import CampoSenha from "./CampoSenha";

const ESTILO_ROTULO = "text-sm text-gray-300";
const ESTILO_CAMPO =
  "w-full rounded-xl border border-gray-600 bg-slate-800 p-2 text-white neon-suave-red-500 focus:border-red-500 focus:neon-red-500 focus:outline-none";
const ESTILO_BOTAO_PRIMARIO =
  "rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function AlterarEmail({ emailAtual, aoSolicitar, aoConfirmar, aoFechar }) {
  const [passo, setPasso] = useState("pedido");
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [camposComErro, setCamposComErro] = useState([]);

  function limparErros() {
    setErro(null);
    setCamposComErro([]);
  }

  async function executar(acao, mensagemPadrao) {
    setEnviando(true);
    limparErros();
    try {
      await acao();
    } catch (err) {
      setErro(err.mensagem || mensagemPadrao);
      setCamposComErro(err.campos ?? []);
    } finally {
      setEnviando(false);
    }
  }

  function pedirCodigo(evento) {
    evento.preventDefault();
    executar(async () => {
      await aoSolicitar(novoEmail, senhaAtual);
      setCodigo("");
      setPasso("codigo");
    }, "Não foi possível enviar o código.");
  }

  function confirmar(evento) {
    evento.preventDefault();
    executar(async () => {
      await aoConfirmar(codigo);
      setPasso("concluido");
    }, "Não foi possível confirmar o código.");
  }

  function voltar() {
    limparErros();
    setSenhaAtual("");
    setPasso("pedido");
  }

  const mensagens = (
    <>
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
    </>
  );

  if (passo === "concluido") {
    return (
      <div className="w-full max-w-xl pr-8">
        <h2 className="mb-3 text-xl font-bold text-white">E-mail alterado</h2>
        <p role="status" className="text-sm text-gray-300">
          Use o e-mail novo no próximo login. Esta sessão continua aberta, e o
          e-mail antigo recebe um aviso da troca.
        </p>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={aoFechar} className={ESTILO_BOTAO_PRIMARIO}>
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (passo === "codigo") {
    return (
      <form onSubmit={confirmar} className="w-full max-w-xl pr-8">
        <h2 className="mb-1 text-xl font-bold text-white">Confirme o e-mail novo</h2>
        <p className="mb-5 text-sm text-gray-400">
          Enviamos um código de 4 dígitos para{" "}
          <span className="font-semibold text-red-200">{novoEmail.trim()}</span>. A troca
          só acontece depois da confirmação.
        </p>

        <div className="flex flex-col gap-1">
          <label htmlFor="email-codigo" className={ESTILO_ROTULO}>
            Código
          </label>
          <input
            type="text"
            id="email-codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            value={codigo}
            onChange={(evento) => setCodigo(evento.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="0000"
            className={`${ESTILO_CAMPO} text-center tracking-[0.5em]`}
          />
        </div>

        {mensagens}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={voltar}
            disabled={enviando}
            className={ESTILO_BOTAO_SECUNDARIO}
          >
            Voltar
          </button>
          <button type="submit" disabled={enviando} className={ESTILO_BOTAO_PRIMARIO}>
            {enviando ? "Confirmando..." : "Confirmar"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={pedirCodigo} className="w-full max-w-xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Alterar e-mail</h2>
      <p className="mb-5 text-sm text-gray-400">
        O e-mail é o seu login. Vamos enviar um código para o e-mail novo, e a troca
        só acontece depois que você confirmar.
      </p>

      <div className="mb-4 rounded-xl border border-gray-700 p-3 text-sm">
        <span className="block text-xs text-gray-400">E-mail atual</span>
        <span className="block text-white">{emailAtual}</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email-novo" className={ESTILO_ROTULO}>
            E-mail novo
          </label>
          <input
            type="text"
            id="email-novo"
            inputMode="email"
            autoComplete="email"
            value={novoEmail}
            onChange={(evento) => setNovoEmail(evento.target.value)}
            className={ESTILO_CAMPO}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email-senha-atual" className={ESTILO_ROTULO}>
            Senha atual
          </label>
          <CampoSenha
            id="email-senha-atual"
            name="senhaAtual"
            valor={senhaAtual}
            aoAlterar={(evento) => setSenhaAtual(evento.target.value)}
            autoComplete="current-password"
            className={ESTILO_CAMPO}
          />
        </div>
      </div>

      {mensagens}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={aoFechar}
          disabled={enviando}
          className={ESTILO_BOTAO_SECUNDARIO}
        >
          Cancelar
        </button>
        <button type="submit" disabled={enviando} className={ESTILO_BOTAO_PRIMARIO}>
          {enviando ? "Enviando..." : "Enviar código"}
        </button>
      </div>
    </form>
  );
}

export default AlterarEmail;