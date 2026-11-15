import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Menu, UserKey, X } from "lucide-react";
import ModalLogin from "./ModalLogin";
import Autenticacao from "./Autenticacao";
import AvisoLogin from "./AvisoLogin";
import { PAPEIS_EDITORES, PAPEIS_VALIDADORES } from "../utils/papeis";

const LINKS = [
  { para: "/", rotulo: "HOME", exato: true },
  { para: "/articles", rotulo: "ARTIGOS", protegida: true },
  { para: "/quiz", rotulo: "QUIZ", protegida: true },
  { para: "/library", rotulo: "BIBLIOTECA", protegida: true },
  { para: "/progress", rotulo: "CALCULADORAS", protegida: true },
  { para: "/meu-acervo", rotulo: "MEU ACERVO", protegida: true, papeis: PAPEIS_EDITORES },
  { para: "/about", rotulo: "QUEM SOMOS" },
  { para: "/admin", rotulo: "ADMINISTRAÇÃO", protegida: true, papeis: PAPEIS_VALIDADORES,},
];

const ESTILO_LINK =
  "w-full border-b border-gray-700 py-3 text-center transition-all xl:w-auto xl:border-0 xl:py-0 xl:whitespace-nowrap";
const linkClass = ({ isActive }) =>
  isActive ? `${ESTILO_LINK} text-2xl px-2 underline` : ESTILO_LINK;
const ESTILO_BOTAO_CONTORNO =
  "flex-1 rounded-md border-2 border-red-500 py-2 px-4 font-bold text-center whitespace-nowrap hover:bg-red-500 hover:text-white xl:flex-none xl:py-1.5 xl:px-3 xl:text-sm";
const ESTILO_BOTAO_CHEIO =
  "flex-1 bg-red-500 rounded-md py-2 px-4 font-bold flex items-center justify-center gap-2 whitespace-nowrap hover:bg-red-900 cursor-pointer xl:flex-none xl:py-1.5 xl:px-3 xl:text-sm";
const ESTILO_DIVISOR = "hidden xl:block w-px h-8 bg-gray-300 mx-2";

function primeiroEUltimoNome(nomeCompleto) {
  const partes = nomeCompleto.trim().split(/\s+/);
  return partes.length > 2 ? `${partes[0]} ${partes[partes.length - 1]}` : nomeCompleto;
}

function NavBar({ usuario, aoEntrar, aoSair }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [avisoAberto, setAvisoAberto] = useState(false);
  const [destinoDoLogin, setDestinoDoLogin] = useState(null);

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
    setDestinoDoLogin(null);
    setModalAberto(true);
  }

  function fecharLogin() {
    setModalAberto(false);
  }

  function irParaLogin() {
    setAvisoAberto(false);
    setModalAberto(true);
  }

  function fecharAviso() {
    setAvisoAberto(false);
  }

  function aoClicarLink(evento, protegida, para) {
    if (protegida && !usuario) {
      evento.preventDefault();
      setDestinoDoLogin(para);
      setAvisoAberto(true);
      return;
    }
    fecharMenu();
  }

  return (
    <nav className="font-montserrat text-rose-200 w-full">
      <div
        className="flex flex-wrap items-center px-6 py-4 xl:flex-nowrap xl:px-4"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <p className="text-3xl p-4 xl:pl-0 xl:pr-2">FORÇAMENTE</p>

        <button
          type="button"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((atual) => !atual)}
          className="ml-auto rounded-md p-2 hover:bg-red-500 hover:text-white cursor-pointer xl:hidden"
        >
          {menuAberto ? <X /> : <Menu />}
        </button>

        <div className={ESTILO_DIVISOR}></div>

        <div
          id="menu-principal"
          className={`${menuAberto ? "flex" : "hidden"} w-full flex-col gap-4 pt-4 xl:flex xl:w-auto xl:flex-1 xl:flex-row xl:items-center xl:gap-2 xl:pt-0`}
        >
          <div className="flex flex-col border-t border-gray-700 font-bold xl:flex-1 xl:flex-row xl:justify-center xl:gap-3 xl:border-0">
            {LINKS.filter(
              ({ papeis }) => !papeis || papeis.includes(usuario?.papel),
            ).map(({ para, rotulo, exato, protegida }) => (
              <NavLink
                key={para}
                to={para === "/" && usuario ? "/inicio" : para}
                end={exato}
                className={linkClass}
                onClick={(evento) => aoClicarLink(evento, protegida, para)}
              >
                {rotulo}
              </NavLink>
            ))}
          </div>

          <div className={ESTILO_DIVISOR}></div>

          {usuario ? (
            <div className="flex flex-col items-center gap-3 xl:flex-row xl:gap-2">
              <span
                title={usuario.nomeCompleto}
                className="max-w-full text-center font-bold wrap-anywhere xl:max-w-36 xl:truncate xl:text-sm xl:max-[106.25rem]:hidden"
              >
                <span className="xl:hidden">{usuario.nomeCompleto}</span>
                <span className="hidden xl:inline">{primeiroEUltimoNome(usuario.nomeCompleto)}</span>
              </span>
              <div className="flex w-full gap-3 xl:w-auto xl:gap-2">
                <NavLink to="/minha-conta" onClick={fecharMenu} className={ESTILO_BOTAO_CONTORNO}>
                  Meus Dados
                </NavLink>
                <button type="button" onClick={aoSair} className={ESTILO_BOTAO_CHEIO}>
                  Sair
                  <LogOut />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full gap-3 xl:w-auto">
              <NavLink to="/cadastro" onClick={fecharMenu} className={ESTILO_BOTAO_CONTORNO}>
                Cadastre-se
              </NavLink>
              <button type="button" onClick={abrirLogin} className={ESTILO_BOTAO_CHEIO}>
                Login
                <UserKey />
              </button>
            </div>
          )}
        </div>
      </div>

      <ModalLogin isOpen={modalAberto} setCloseModal={fecharLogin}>
        <Autenticacao
          aoFechar={fecharLogin}
          aoEntrar={(sessao) => aoEntrar(sessao, destinoDoLogin)}
        />
      </ModalLogin>

      <ModalLogin isOpen={avisoAberto} setCloseModal={fecharAviso}>
        <AvisoLogin aoFazerLogin={irParaLogin} />
      </ModalLogin>

      <div className="w-full h-px bg-gray-300"></div>
    </nav>
  );
}

export default NavBar;
