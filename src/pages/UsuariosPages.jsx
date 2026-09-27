import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import Modal from "../components/Modal";
import FiltroUsuarios from "../components/AdminComponents/FiltroUsuarios";
import TabelaUsuarios from "../components/AdminComponents/TabelaUsuarios";
import FormEdicaoUsuario from "../components/AdminComponents/FormEdicaoUsuario";
import Paginacao from "../components/AdminComponents/Paginacao";
import {
  alterarAtivo,
  atualizarUsuario,
  buscarUsuarios,
  listarFormacoes,
} from "../services/usuarioService";

const TAMANHO_PAGINA = 20;

const FILTROS_VAZIOS = { busca: "", papel: "", ativo: "" };

const ESPERA_DA_BUSCA = 400;

function UsuariosPages() {
  const { usuario } = useOutletContext();

  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [pagina, setPagina] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [formacoes, setFormacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [idEmOperacao, setIdEmOperacao] = useState(null);

  const [versao, setVersao] = useState(0);

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
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [pagina, buscaAplicada, filtros.papel, filtros.ativo, versao]);

  const alterarFiltro = useCallback((campo, valor) => {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));

    if (campo !== "busca") setPagina(0);
  }, []);

  function limparFiltros() {
    setFiltros(FILTROS_VAZIOS);
    setPagina(0);
  }

  async function salvar(dados) {
    await atualizarUsuario(usuarioEmEdicao.id, dados);
    setUsuarioEmEdicao(null);
    setVersao((atual) => atual + 1);
  }

  async function alternarAtivo(usuario) {
    const confirmado = window.confirm(
      usuario.ativo
        ? `Inativar a conta de ${usuario.nomeCompleto}?\n\nA pessoa deixa de conseguir entrar a partir do próximo login. Nenhum dado é apagado — isto não é a exclusão da LGPD.`
        : `Reativar a conta de ${usuario.nomeCompleto}?`,
    );

    if (!confirmado) return;

    setIdEmOperacao(usuario.id);
    setErro(null);

    try {
      await alterarAtivo(usuario.id, !usuario.ativo);
      setVersao((atual) => atual + 1);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível alterar a situação desta conta.");
    } finally {
      setIdEmOperacao(null);
    }
  }

  const usuarios = resultado?.conteudo ?? [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Administração"
        titulo="Gestão de usuários"
        descricao="Consulta, correção de dados e bloqueio de acesso das contas da plataforma."
      />

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
          aoEditar={setUsuarioEmEdicao}
          aoAlternarAtivo={alternarAtivo}
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
    </div>
  );
}

export default UsuariosPages;
