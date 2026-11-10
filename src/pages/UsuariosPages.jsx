import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CabecalhoPagina from "../components/CabecalhoPagina";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import Modal from "../components/Modal";
import FiltroUsuarios from "../components/AdminComponents/FiltroUsuarios";
import TabelaUsuarios from "../components/AdminComponents/TabelaUsuarios";
import FormEdicaoUsuario from "../components/AdminComponents/FormEdicaoUsuario";
import ConfirmarAnonimizacao from "../components/AdminComponents/ConfirmarAnonimizacao";
import ConfirmarSituacao from "../components/AdminComponents/ConfirmarSituacao";
import Paginacao from "../components/AdminComponents/Paginacao";
import AbasAdministracao from "../components/AdminComponents/AbasAdministracao";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import { SUBTITULOS_DA_ADMINISTRACAO } from "../utils/subtitulosDasPaginas";
import {
  alterarAtivo,
  anonimizarUsuario,
  atualizarUsuario,
  buscarDadosCompletos,
  buscarUsuarios,
  listarFormacoes,
} from "../services/usuarioService";

const TAMANHO_PAGINA = 20;

const FILTROS_VAZIOS = { busca: "", papel: "", ativo: "" };

const ESPERA_DA_BUSCA = 400;

function UsuariosPages() {
  const { usuario, avisar } = useOutletContext();

  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [pagina, setPagina] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [formacoes, setFormacoes] = useState([]);
  const [consultaConcluida, setConsultaConcluida] = useState(null);
  const [erro, setErro] = useState(null);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [usuarioEmAnonimizacao, setUsuarioEmAnonimizacao] = useState(null);
  const [usuarioEmAlteracao, setUsuarioEmAlteracao] = useState(null);
  const [idEmOperacao, setIdEmOperacao] = useState(null);

  const [versao, setVersao] = useState(0);
  const consultaAtual = JSON.stringify([pagina, buscaAplicada, filtros.papel, filtros.ativo, versao]);
  const carregando = consultaAtual !== consultaConcluida || filtros.busca.trim() !== buscaAplicada;

  useEffect(() => {
    let ativo = true;

    listarFormacoes()
      .then((lista) => {
        if (ativo) setFormacoes(lista);
      })
      .catch(() => {
        if (ativo) setFormacoes([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    const relogio = setTimeout(() => {
      setBuscaAplicada(filtros.busca.trim());
      setPagina(0);
    }, ESPERA_DA_BUSCA);

    return () => clearTimeout(relogio);
  }, [filtros.busca]);

  useEffect(() => {
    let ativo = true;

    buscarUsuarios({
      pagina,
      tamanho: TAMANHO_PAGINA,
      busca: buscaAplicada,
      papel: filtros.papel,
      ativo: filtros.ativo,
    })
      .then((dados) => {
        if (!ativo) return;
        setResultado(dados);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setResultado(null);
        setErro(err.mensagem || "Não foi possível carregar os usuários.");
      })
      .finally(() => {
        if (ativo) setConsultaConcluida(consultaAtual);
      });

    return () => {
      ativo = false;
    };
  }, [pagina, buscaAplicada, filtros.papel, filtros.ativo, versao, consultaAtual]);

  function alterarFiltro(campo, valor) {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));

    if (campo !== "busca") setPagina(0);
  }

  function limparFiltros() {
    setFiltros(FILTROS_VAZIOS);
    setPagina(0);
  }

  async function abrirEdicao(usuarioDaLista) {
    setIdEmOperacao(usuarioDaLista.id);
    try {
      setUsuarioEmEdicao(await buscarDadosCompletos(usuarioDaLista.id));
    } catch (err) {
      avisar({
        tipo: "erro",
        titulo: "Não foi possível abrir a edição",
        mensagem: err.mensagem || "Tente novamente.",
      });
    } finally {
      setIdEmOperacao(null);
    }
  }

  async function salvar(dados) {
    await atualizarUsuario(usuarioEmEdicao.id, dados);
    avisar({
      tipo: "sucesso",
      titulo: "Dados salvos",
      mensagem: `Os dados de ${usuarioEmEdicao.nomeCompleto} foram atualizados.`,
    });
    setUsuarioEmEdicao(null);
    setVersao((atual) => atual + 1);
  }

  async function anonimizar() {
    await anonimizarUsuario(usuarioEmAnonimizacao.id);
    avisar({
      tipo: "sucesso",
      titulo: "Conta anonimizada",
      mensagem: `Os dados pessoais de ${usuarioEmAnonimizacao.nomeCompleto} foram apagados.`,
    });
    setUsuarioEmAnonimizacao(null);
    setVersao((atual) => atual + 1);
  }

  async function alterarSituacao() {
    setIdEmOperacao(usuarioEmAlteracao.id);

    try {
      await alterarAtivo(usuarioEmAlteracao.id, !usuarioEmAlteracao.ativo);
      avisar(
        usuarioEmAlteracao.ativo
          ? {
              tipo: "sucesso",
              titulo: "Conta inativada",
              mensagem: `${usuarioEmAlteracao.nomeCompleto} não consegue mais entrar a partir do próximo login.`,
            }
          : {
              tipo: "sucesso",
              titulo: "Conta reativada",
              mensagem: `${usuarioEmAlteracao.nomeCompleto} já pode entrar de novo.`,
            },
      );
      setUsuarioEmAlteracao(null);
      setVersao((atual) => atual + 1);
    } finally {
      setIdEmOperacao(null);
    }
  }

  const usuarios = resultado?.conteudo ?? [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-10 lp:pb-16">
      <CabecalhoPagina
        titulo="Gestão de usuários"
        subtitulo={SUBTITULOS_DA_ADMINISTRACAO.usuarios}
        icone={ICONES_DAS_PAGINAS.administracao}
      />

      <AbasAdministracao />

      <p className="mb-6 rounded-md border border-gray-700 p-3 text-sm text-gray-400">
        <strong className="text-gray-300">Inativar não é excluir.</strong> Inativar
        tranca o acesso e preserva os dados; a exclusão do art. 18 da LGPD é a
        anonimização, é irreversível e nasce de um pedido da própria pessoa.
      </p>

      <FiltroUsuarios
        filtros={filtros}
        aoAlterar={alterarFiltro}
        aoLimpar={limparFiltros}
      />

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando usuários..."
        erro={erro}
        vazio={usuarios.length === 0}
        mensagemVazio="Nenhum usuário encontrado para estes filtros."
      >
        <TabelaUsuarios
          usuarios={usuarios}
          formacoes={formacoes}
          aoEditar={abrirEdicao}
          aoAlternarAtivo={setUsuarioEmAlteracao}
          aoAnonimizar={setUsuarioEmAnonimizacao}
          idEmOperacao={idEmOperacao}
          idDoLogado={usuario?.id}
        />
        <Paginacao
          pagina={resultado?.pagina ?? 0}
          totalDePaginas={resultado?.totalDePaginas ?? 1}
          totalDeItens={resultado?.totalDeItens ?? 0}
          aoMudarPagina={setPagina}
        />
      </EstadoRequisicao>

      <Modal
        isOpen={usuarioEmEdicao !== null}
        setCloseModal={() => setUsuarioEmEdicao(null)}
      >
        {usuarioEmEdicao && (
          <FormEdicaoUsuario
            key={usuarioEmEdicao.id}
            usuario={usuarioEmEdicao}
            formacoes={formacoes}
            aoSalvar={salvar}
            aoCancelar={() => setUsuarioEmEdicao(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={usuarioEmAnonimizacao !== null}
        setCloseModal={() => setUsuarioEmAnonimizacao(null)}
      >
        {usuarioEmAnonimizacao && (
          <ConfirmarAnonimizacao
            key={usuarioEmAnonimizacao.id}
            usuario={usuarioEmAnonimizacao}
            aoConfirmar={anonimizar}
            aoCancelar={() => setUsuarioEmAnonimizacao(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={usuarioEmAlteracao !== null}
        setCloseModal={() => setUsuarioEmAlteracao(null)}
      >
        {usuarioEmAlteracao && (
          <ConfirmarSituacao
            key={usuarioEmAlteracao.id}
            usuario={usuarioEmAlteracao}
            aoConfirmar={alterarSituacao}
            aoCancelar={() => setUsuarioEmAlteracao(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default UsuariosPages;
