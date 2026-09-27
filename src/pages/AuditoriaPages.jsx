import { useCallback, useEffect, useState } from "react";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import EstadoRequisicao from "../components/progress/EstadoRequisicao";
import FiltroAuditoria from "../components/AdminComponents/FiltroAuditoria";
import TabelaAuditoria from "../components/AdminComponents/TabelaAuditoria";
import Paginacao from "../components/AdminComponents/Paginacao";
import {
  EXPORTACAO_DISPONIVEL,
  buscarAuditoria,
  exportarCsv,
  listarAcoes,
} from "../services/auditoriaService";
import { baixarArquivo } from "../utils/csv";

// O contrato define 50 como padrao do back; o front pede o mesmo para a tela
// e o servidor casarem no que e uma pagina.
const TAMANHO_PAGINA = 50;

const FILTROS_VAZIOS = { de: "", ate: "", acao: "" };

function AuditoriaPages() {
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [pagina, setPagina] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [acoes, setAcoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    let ativo = true;

    listarAcoes()
      .then((lista) => {
        if (ativo) setAcoes(lista);
      })
      .catch(() => {
        if (ativo) setAcoes([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    buscarAuditoria({ pagina, tamanho: TAMANHO_PAGINA, ...filtros })
      .then((dados) => {
        if (!ativo) return;
        setResultado(dados);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setResultado(null);
        setErro(err.mensagem || "Não foi possível carregar a auditoria.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [pagina, filtros]);

  const alterarFiltro = useCallback((campo, valor) => {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    setPagina(0);
  }, []);

  function limparFiltros() {
    setFiltros(FILTROS_VAZIOS);
    setPagina(0);
  }

  async function exportar() {
    setExportando(true);

    try {
      const arquivo = await exportarCsv(filtros);
      const dia = new Date().toISOString().slice(0, 10);
      baixarArquivo(`auditoria-${dia}.csv`, arquivo);
    } catch (err) {
      setErro(err.mensagem || "Não foi possível exportar os registros.");
    } finally {
      setExportando(false);
    }
  }

  const registros = resultado?.conteudo ?? [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Administração"
        titulo="Trilha de auditoria"
        descricao="Registro das ações que tocam dados pessoais e conteúdo da plataforma."
      />

      <FiltroAuditoria
        filtros={filtros}
        acoes={acoes}
        aoAlterar={alterarFiltro}
        aoLimpar={limparFiltros}
      />

      <div className="mb-4 flex items-center justify-end gap-3">
        {!EXPORTACAO_DISPONIVEL && (
          <span className="text-sm text-gray-400">
            Exportação disponível quando a API de auditoria estiver no ar.
          </span>
        )}
        <button
          type="button"
          onClick={exportar}
          disabled={!EXPORTACAO_DISPONIVEL || exportando || registros.length === 0}
          className="rounded-md bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportando ? "Exportando..." : "Exportar CSV"}
        </button>
      </div>

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando registros..."
        erro={erro}
        vazio={registros.length === 0}
        mensagemVazio="Nenhum registro encontrado para estes filtros."
      >
        <TabelaAuditoria registros={registros} />
        <Paginacao
          pagina={resultado?.pagina ?? 0}
          totalDePaginas={resultado?.totalDePaginas ?? 1}
          totalDeItens={resultado?.totalDeItens ?? 0}
          aoMudarPagina={setPagina}
        />
      </EstadoRequisicao>
    </div>
  );
}

export default AuditoriaPages;
