import { useState } from "react";
import ForcaSenha from "./ComponentesCadastro/ForcaSenha";
import { avaliarSenha } from "./ComponentesCadastro/senhaRegras";
import { redefinirSenha } from "../services/authService";

const ESTILO_CAMPO =
  "text-2xl text-white font-light border p-1 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20";

function FormRedefinirSenha({ email, aoConcluir, aoVoltar }) {
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const avaliacao = avaliarSenha(novaSenha);
  const senhasCoincidem = confirmacao.length > 0 && confirmacao === novaSenha;
  const podeEnviar =
    codigo.length === 4 && avaliacao.valida && senhasCoincidem && !enviando;

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      await redefinirSenha(email, codigo, novaSenha);
      aoConcluir();
    } catch (error) {
      setErro(error.mensagem || "Não foi possível redefinir a senha.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3 items-center">
      <h1 className="font-montserrat text-center text-4xl">NOVA SENHA</h1>

      <p className="max-w-sm text-center text-sm text-gray-300">
        Se <span className="font-semibold text-red-200">{email}</span> estiver
        cadastrado, enviamos um código de 4 dígitos. Ele vale por 15 minutos.
      </p>

      <div className="flex flex-col">
        <label htmlFor="codigoRedefinicao" className="text-2xl font-light">
          Código
        </label>
        <input
          type="text"
          id="codigoRedefinicao"
          name="codigoRedefinicao"
          inputMode="numeric"
          maxLength={4}
          value={codigo}
          onChange={(evento) =>
            setCodigo(evento.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="0000"
          className={`${ESTILO_CAMPO} text-center tracking-[0.5em]`}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="novaSenha" className="text-2xl font-light">
          Nova senha
        </label>
        <input
          type="password"
          id="novaSenha"
          name="novaSenha"
          value={novaSenha}
          onChange={(evento) => setNovaSenha(evento.target.value)}
          className={ESTILO_CAMPO}
        />
        {novaSenha.length > 0 && <ForcaSenha avaliacao={avaliacao} />}
      </div>

      <div className="flex flex-col">
        <label htmlFor="confirmacaoSenha" className="text-2xl font-light">
          Confirmar senha
        </label>
        <input
          type="password"
          id="confirmacaoSenha"
          name="confirmacaoSenha"
          value={confirmacao}
          onChange={(evento) => setConfirmacao(evento.target.value)}
          className={ESTILO_CAMPO}
        />
        {confirmacao.length > 0 && !senhasCoincidem && (
          <p className="mt-1 text-sm text-red-500">As senhas não coincidem</p>
        )}
      </div>

      {erro && <p className="text-sm text-center text-red-500">{erro}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={aoVoltar}
          className="rounded-xl border border-gray-700 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={!podeEnviar}
          className="hover:text-white p-4 my-2 bg-red-500 text-red-200 rounded-xl hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? "Salvando..." : "Salvar senha"}
        </button>
      </div>
    </form>
  );
}

export default FormRedefinirSenha;