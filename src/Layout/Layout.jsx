import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import { lerSessao, gravarSessao, limparSessao } from "../utils/sessao";

function Layout () {
  const [usuario, setUsuario] = useState(lerSessao);
  const navigate = useNavigate();

  function entrar(resposta) {
    gravarSessao(resposta);
    setUsuario({ nomeCompleto: resposta.nomeCompleto, papel:resposta.papel});
  }

  function sair () {
    limparSessao();
    setUsuario(null);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <NavBar usuario={usuario} aoEntrar={entrar} aoSair={sair} />
      <main className="flex-1">
        <Outlet context ={{ usuario }} />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
