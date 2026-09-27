import { useState } from "react";
import { esqueciSenha } from "../services/authService";

const ESTILO_CAMPO =
  "text-2xl text-white font-light border p-1 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20";

function FormEsqueciSenha({ aoCodigoEnviado, aoVoltar }) {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      await esqueciSenha(email);
      aoCodigoEnviado(email);
    } catch (error) {
      setErro(error.mensagem || "Não foi possível enviar o código.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3 items-center">
      <h1 className="font-montserrat text-center text-4xl">RECUPERAR SENHA</h1>

      <p className="max-w-sm text-center text-sm text-gray-300">
        Informe o e-mail da sua conta e enviaremos um código para você criar uma
        nova senha.
      </p>

      <div className="flex flex-col">
        <label htmlFor="emailRecuperacao" className="text-2xl font-light">
          E-mail
        </label>
        <input
          type="email"
          id="emailRecuperacao"
          name="emailRecuperacao"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          required
          placeholder="nome@example.com"
          className={ESTILO_CAMPO}
        />
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
          disabled={enviando}
          className="hover:text-white p-4 my-2 bg-red-500 text-red-200 rounded-xl hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? "Enviando..." : "Enviar código"}
        </button>
      </div>
    </form>
  );
}

export default FormEsqueciSenha;