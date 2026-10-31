import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import AvisoCrefNoLogin from "../components/AvisoCrefNoLogin";
import Footer from "./Footer";
import { lerSessao, gravarSessao, limparSessao, atualizarNomeDaSessao } from "../utils/sessao";
import { buscarMinhaConta } from "../services/usuarioService";

const SITUACOES_COM_AVISO = ["PENDENTE", "REJEITADO"];

function Layout () {
  const [usuario, setUsuario] = useState(lerSessao);
  const [avisoCref, setAvisoCref] = useState(null);
  const navigate = useNavigate();

  function conferirVerificacaoDoCref() {
    buscarMinhaConta()
      .then((conta) => {
        if (conta.papel === "PROFESSOR" && SITUACOES_COM_AVISO.includes(conta.situacaoCref)) {
          setAvisoCref({ situacao: conta.situacaoCref, motivo: conta.motivoRejeicaoCref });
        }
      })
      .catch(() => {});
  }

  function entrar(resposta) {
    gravarSessao(resposta);
    setUsuario({ id: resposta.id, nomeCompleto: resposta.nomeCompleto, papel: resposta.papel });
    if (resposta.papel === "ALUNO") conferirVerificacaoDoCref();
  }

  function renomear(nomeCompleto) {
    atualizarNomeDaSessao(nomeCompleto);
    setUsuario((atual) => (atual ? { ...atual, nomeCompleto } : atual));
  }

  function sair () {
    limparSessao();
    setUsuario(null);
    navigate("/");
  }

  function verMinhaConta() {
    setAvisoCref(null);
    navigate("/minha-conta");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <NavBar usuario={usuario} aoEntrar={entrar} aoSair={sair} />
      <main className="flex-1">
        <Outlet context ={{ usuario, aoRenomear: renomear }} />
      </main>
      <Footer />

      <Modal isOpen={avisoCref !== null} setCloseModal={() => setAvisoCref(null)}>
        {avisoCref && (
          <AvisoCrefNoLogin
            situacao={avisoCref.situacao}
            motivo={avisoCref.motivo}
            aoVerConta={verMinhaConta}
            aoFechar={() => setAvisoCref(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default Layout;