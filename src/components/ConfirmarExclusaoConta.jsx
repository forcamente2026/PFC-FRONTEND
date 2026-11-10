import { useState } from "react";

const ESTILO_LISTA = "mt-2 list-disc pl-5 text-sm text-gray-300 space-y-1";
const ESTILO_SUBTITULO = "text-sm font-semibold tracking-[0.25em] text-red-200 uppercase";
const ESTILO_BOTAO_GRAVE =
  "rounded-md bg-red-600 py-2 px-4 font-bold text-white hover:bg-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
const ESTILO_BOTAO_SECUNDARIO =
  "rounded-md border border-gray-600 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function ConfirmarExclusaoConta({ aoConfirmar, aoCancelar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function confirmar() {
    setEnviando(true);
    setErro(null);

    try {
      await aoConfirmar();
    } catch (err) {
      setErro(err.mensagem || "Não foi possível registrar o pedido. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-xl pr-8">
      <h2 className="mb-1 text-xl font-bold text-white">Excluir minha conta</h2>
      <p className="mb-5 text-sm text-gray-400">
        Direito de eliminação previsto no art. 18 da Lei Geral de Proteção de Dados.
      </p>

      <div className="mb-5 rounded-xl border border-red-500 p-4">
        <p className="text-sm text-red-200">
          Depois que um administrador cumprir o pedido, os seus dados pessoais são
          apagados e <strong>não há como recuperá-los</strong>.
        </p>
      </div>

      <h3 className={ESTILO_SUBTITULO}>Como funciona</h3>
      <ul className={ESTILO_LISTA}>
        <li>O pedido fica registrado e um administrador o cumpre.</li>
        <li>Até lá, sua conta continua funcionando normalmente.</li>
        <li>Você pode desistir a qualquer momento antes disso.</li>
      </ul>

      <h3 className={`${ESTILO_SUBTITULO} mt-5`}>O que será apagado</h3>
      <ul className={ESTILO_LISTA}>
        <li>Nome, e-mail e senha</li>
        <li>Data de nascimento</li>
        <li>CREF, formação e endereço profissional</li>
      </ul>

      <h3 className={`${ESTILO_SUBTITULO} mt-5`}>O que permanece</h3>
      <ul className={ESTILO_LISTA}>
        <li>
          O registro de que você aceitou os Termos e a Política, sem os seus dados,
          como prova do consentimento
        </li>
        <li>Os artigos que você publicou, sem identificar o autor</li>
      </ul>

      {erro && <p className="mt-5 text-sm text-red-400">{erro}</p>}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={aoCancelar}
          disabled={enviando}
          className={ESTILO_BOTAO_SECUNDARIO}
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={confirmar}
          disabled={enviando}
          className={ESTILO_BOTAO_GRAVE}
        >
          {enviando ? "Registrando..." : "Confirmar pedido de exclusão"}
        </button>
      </div>
    </div>
  );
}

export default ConfirmarExclusaoConta;
