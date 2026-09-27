import { useEffect, useState } from "react";
import { verificarCodigo } from "../services/authService";

const ESTILO_CAMPO =
  "text-2xl text-white font-light border p-1 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20";

function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
}

function FormCodigo({ email, expiraEmSegundos, aoEntrar, aoVoltar }) {
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [segundos, setSegundos] = useState(expiraEmSegundos);

  useEffect(() => {
    const relogio = setInterval(() => {
      setSegundos((atual) => (atual <= 0 ? 0 : atual - 1));
    }, 1000);

    return () => clearInterval(relogio);
  }, []);

  const expirou = segundos <= 0;

  async function confirmar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      const sessao = await verificarCodigo(email, codigo);
      aoEntrar(sessao);
    } catch (error) {
      setErro(error.mensagem || "Não foi possível verificar o código.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={confirmar} className="flex flex-col gap-3 items-center">
      <h1 className="font-montserrat text-center text-4xl">VERIFICAÇÃO</h1>

      <p className="max-w-sm text-center text-sm text-gray-300">
        Enviamos um código de 4 dígitos para{" "}
        <span className="font-semibold text-red-200">{email}</span>
      </p>

      <div className="flex flex-col">
        <label htmlFor="codigo" className="text-2xl font-light">
          Código
        </label>
        <input
          type="text"
          id="codigo"
          name="codigo"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          value={codigo}
          onChange={(evento) =>
            setCodigo(evento.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="0000"
          className={`${ESTILO_CAMPO} text-center tracking-[0.5em]`}
        />
      </div>

      <p className={`text-sm ${expirou ? "text-red-500" : "text-gray-300"}`}>
        {expirou
          ? "O código expirou. Volte e entre novamente."
          : `Expira em ${formatarTempo(segundos)}`}
      </p>

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
          disabled={enviando || expirou || codigo.length < 4}
          className="hover:text-white p-4 my-2 bg-red-500 text-red-200 rounded-xl hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? "Verificando..." : "Confirmar"}
        </button>
      </div>
    </form>
  );
}

export default FormCodigo;