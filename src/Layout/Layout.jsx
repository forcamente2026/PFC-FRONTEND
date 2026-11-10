import { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import AvisoCrefNoLogin from "../components/AvisoCrefNoLogin";
import AvisoDeAcao from "../components/AvisoDeAcao";
import Footer from "./Footer";
import { lerSessao, gravarSessao, limparSessao, atualizarNomeDaSessao, EVENTO_SESSAO_EXPIRADA } from "../utils/sessao";
import { buscarMinhaConta } from "../services/usuarioService";

const SITUACOES_COM_AVISO = ["PENDENTE", "REJEITADO"];

function Layout () {
  const [usuario, setUsuario] = useState(lerSessao);
  const [avisoCref, setAvisoCref] = useState(null);
  const [avisoDeAcao, setAvisoDeAcao] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    function aoExpirar() {
      setUsuario(null);
      setAvisoCref(null);
      setAvisoDeAcao({
        tipo: "erro", titulo: "Sessão expirada",
        mensagem: "Entre novamente para continuar usando sua conta.",
      });
      navigate("/", { replace: true });
    }

    function sincronizarSessao(evento) {
      if (evento.key === null || evento.key === "forcamente:usuario" || evento.key === "token") {
        setUsuario(lerSessao());
      }
    }

    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    window.addEventListener("storage", sincronizarSessao);
    return () => {
      window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
      window.removeEventListener("storage", sincronizarSessao);
    };
  }, [navigate]);

  function conferirVerificacaoDoCref() {
    buscarMinhaConta()
      .then((conta) => {
        if (conta.papel === "PROFESSOR" && SITUACOES_COM_AVISO.includes(conta.situacaoCref)) {
          setAvisoCref({ situacao: conta.situacaoCref, motivo: conta.motivoRejeicaoCref });
        }
      })
      .catch(() => {});
  }

  function entrar(resposta, destino) {
    gravarSessao(resposta);
    setUsuario({ id: resposta.id, nomeCompleto: resposta.nomeCompleto, papel: resposta.papel });
    if (resposta.papel === "ALUNO") conferirVerificacaoDoCref();
    navigate(destino ?? "/inicio");
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
        <Suspense fallback={<p role="status" className="p-8 text-center text-gray-300">Carregando página...</p>}>
          <Outlet context ={{ usuario, aoRenomear: renomear, avisar: setAvisoDeAcao }} />
        </Suspense>
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

      <Modal isOpen={avisoDeAcao !== null} setCloseModal={() => setAvisoDeAcao(null)}>
        {avisoDeAcao && (
          <AvisoDeAcao {...avisoDeAcao} aoFechar={() => setAvisoDeAcao(null)} />
        )}
      </Modal>
    </div>
  );
}

export default Layout;
