import { NavLink } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/authService";

const ESTILO_CAMPO =
  "text-2xl text-white font-light border p-1 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20";

const LOGIN_VAZIO = { email: "", senha: ""};

function FormLogin({ aoFechar, aoEntrar }) {
  const [form, setForm] = useState(LOGIN_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  async function entrar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      const resposta = await login(form.email, form.senha);
      aoEntrar(resposta);
      aoFechar();
    } catch (error) {
      setErro(error.mensagem || "Não foi possivel entrar. Tente novamente");
    } finally {
      setEnviando(false);
    }
  }
  return (
    <form onSubmit={entrar} className="flex flex-col gap-3 items-center">
      <h1 className="font-montserrat text-center text-4xl">LOGIN</h1>

      <div className="flex flex-col">
        <label htmlFor="email" className="text-2xl font-light">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="nome@example.com"
          className={ESTILO_CAMPO}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="senha" className="text-2xl font-light">
          Senha
        </label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={form.senha}
          onChange={handleChange}
          required
          placeholder="Digite a senha"
          className={`${ESTILO_CAMPO} m-2`}
        />
      </div>

      <div className="flex text-sm font-medium gap-20">
        <p>Esqueceu a senha?</p>
        <NavLink
          to="/cadastro"
          className="font-light hover:underline hover:text-red-300"
          onClick={aoFechar}
        >
          Cadastra-se
        </NavLink>
      </div>

      {erro && <p className="text-sm text-center text-red-500">{erro}</p>}

      <button
        type="submit"
        disabled = {enviando}
        className="hover:text-white p-4 my-2 bg-red-500 text-red-200 rounded-xl hover:bg-red-900 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default FormLogin;
