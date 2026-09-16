import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, UserKey, X } from "lucide-react";
import ModalLogin from "./ModalLogin";
import FormLogin from "./FormLogin";

const LINKS = [
  { para: "/", rotulo: "HOME", exato: true },
  { para: "/library", rotulo: "BIBLIOTECA" },
  { para: "/progress", rotulo: "PROGRESSO" },
  { para: "/about", rotulo: "QUEM SOMOS" },
];

const linkClass = ({ isActive }) =>
  isActive ? "text-2xl px-2 underline transition-all" : "transition-all";

const ESTILO_DIVISOR = "hidden lp:block w-px h-8 bg-gray-300 mx-4";

function NavBar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (!menuAberto) return;

    function fechar() {
      setMenuAberto(false);
    }

    function aoTeclar(evento) {
      if (evento.key === "Escape") setMenuAberto(false);
    }

    document.addEventListener("mousedown", fechar);
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.removeEventListener("mousedown", fechar);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [menuAberto]);

  function fecharMenu() {
    setMenuAberto(false);
  }

  function abrirLogin() {
    setMenuAberto(false);
    setModalAberto(true);
  }

  function fecharLogin() {
    setModalAberto(false);
  }

  return (
    <nav className="font-montserrat text-rose-200 w-full">
      <div
        className="flex flex-wrap items-center px-6 py-4 lp:flex-nowrap"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <h1 className="text-3xl p-4">FORÇAMENTE</h1>

        <button
          type="button"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((atual) => !atual)}
          className="ml-auto rounded-md p-2 hover:bg-red-500 hover:text-white cursor-pointer lp:hidden"
        >
          {menuAberto ? <X /> : <Menu />}
        </button>

        <div className={ESTILO_DIVISOR}></div>

        <div
          id="menu-principal"
          className={`${menuAberto ? "flex" : "hidden"} w-full flex-col gap-4 pt-4 lp:flex lp:w-auto lp:flex-1 lp:flex-row lp:items-center lp:pt-0`}
        >
          <div className="flex flex-col gap-4 font-bold lp:flex-1 lp:flex-row lp:justify-center lp:gap-6">
            {LINKS.map(({ para, rotulo, exato }) => (
              <NavLink
                key={para}
                to={para}
                end={exato}
                className={linkClass}
                onClick={fecharMenu}
              >
                {rotulo}
              </NavLink>
            ))}
          </div>

          <div className={ESTILO_DIVISOR}></div>

          <button
            type="button"
            onClick={abrirLogin}
            className="bg-red-500 rounded-md py-2 px-4 font-bold flex items-center justify-center gap-2 hover:bg-red-900 cursor-pointer"
          >
            Login
            <UserKey />
          </button>
        </div>
      </div>

      <ModalLogin isOpen={modalAberto} setCloseModal={fecharLogin}>
        <FormLogin aoFechar={fecharLogin} />
      </ModalLogin>

      <div className="w-full h-px bg-gray-300"></div>
    </nav>
  );
}

export default NavBar;
