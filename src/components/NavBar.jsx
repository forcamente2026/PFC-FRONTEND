import { NavLink } from "react-router-dom";

import { UserKey } from "lucide-react";
import ModalLogin from "./ModalLogin";
import { useState } from "react";

const linkClass = ({ isActive }) =>
  isActive ? "text-2xl px-2 underline transition-all" : "transition-all";

function NavBar() {
  const [openModal, setOpenModaL] = useState(false);
  return (
    <nav className="font-montserrat text-rose-200 w-full">
      <div className="flex items-center px-6 py-4">
        <h1 className="text-3xl p-4">FORÇAMENTE</h1>
        <div className="w-px h-8 bg-gray-300 mx-6"></div>
        <div className="flex font-bold flex-1 justify-center gap-10">
          <NavLink to="/" end className={linkClass}>
            HOME
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            BIBLIOTECA
          </NavLink>
          <NavLink to="/progress" className={linkClass}>
            PROGRESSO
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            QUEM SOMOS
          </NavLink>
        </div>
        <div className="w-px h-8 bg-gray-300 mx-6"></div>
        <button
          onClick={() => setOpenModaL(true)}
          className="bg-red-500 rounded-md py-2 px-4 font-bold flex items-center gap-2 hover:bg-red-900 cursor-pointer"
        >
          Login
          <UserKey />
        </button>
        <ModalLogin
          isOpen={openModal}
          setCloseModal={() => setOpenModaL(!openModal)}
        >
          <form className="flex flex-col gap-3 items-center">
            <div className=" flex font-montserrat text-center text-4xl">
              <h1>LOGIN</h1>
            </div>
            <div className="flex flex-col">
              <label id="usuario" className="text-2xl font-light">
                Usuário
              </label>
              <input
                type="text"
                id="usuario"
                placeholder="Digite usuario"
                className="text-2xl text-white font-light  border  p-1 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20"
              />
            </div>
            <div className="flex flex-col">
              <label id="senha" className="text-2xl font-light">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                placeholder="Digite a senha"
                className="text-2xl text-white font-light border  p-1 bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20 m-2"
              />
            </div>

            <div className="flex text-sm font-medium gap-20">
              <p>Esqueceu a senha?</p>
              <NavLink
                to="/cadastro"
                className="font-light hover:underline hover:text-red-300"
                onClick={()=> openModal(!setOpenModaL)}
              >
                {" "}
                Cadastra-se
              </NavLink>
            </div>
            <div className="flex text-center items-center">
              <button
                type="submit"
                className="hover:text-white p-4 my-2  bg-red-500 text-red-200 rounded-xl hover:bg-red-900 cursor-pointer"
              >
                {" "}
                Entrar
              </button>
            </div>
          </form>
        </ModalLogin>
      </div>

      <div className="w-full h-px bg-gray-300"></div>
    </nav>
  );
}

export default NavBar;
