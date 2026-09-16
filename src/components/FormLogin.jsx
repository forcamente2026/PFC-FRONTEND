import { NavLink } from "react-router-dom";

const ESTILO_CAMPO =
  "text-2xl text-white font-light border p-1 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20";

function FormLogin({ aoFechar }) {
  return (
    <form className="flex flex-col gap-3 items-center">
      <h1 className="font-montserrat text-center text-4xl">LOGIN</h1>

      <div className="flex flex-col">
        <label htmlFor="usuario" className="text-2xl font-light">
          Usuário
        </label>
        <input
          type="text"
          id="usuario"
          placeholder="Digite usuario"
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

      <button
        type="submit"
        className="hover:text-white p-4 my-2 bg-red-500 text-red-200 rounded-xl hover:bg-red-900 cursor-pointer"
      >
        Entrar
      </button>
    </form>
  );
}

export default FormLogin;
