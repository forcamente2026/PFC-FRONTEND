import { useSearchParams } from "react-router-dom";
import CabecalhoPagina from "../components/CabecalhoPagina";
import AbasAdministracao from "../components/AdminComponents/AbasAdministracao";
import FiltroItensPendentes from "../components/AdminComponents/FiltroItensPendentes";
import PedidosDeExclusao from "../components/AdminComponents/PedidosDeExclusao";
import FilaDeArtigos from "../components/AdminComponents/FilaDeArtigos";
import FilaDeQuizzes from "../components/AdminComponents/FilaDeQuizzes";
import FilaDeExercicios from "../components/AdminComponents/FilaDeExercicios";
import VerificacoesCref from "../components/AdminComponents/VerificacoesCref";
import { ICONES_DAS_PAGINAS } from "../utils/iconesDasPaginas";
import { SUBTITULOS_DA_ADMINISTRACAO } from "../utils/subtitulosDasPaginas";

const TIPOS_FILTRADOS = ["artigos", "quizzes", "exercicios", "professores", "exclusoes"];

function ItensPendentesPages() {
  const [parametros, setParametros] = useSearchParams();
  const tipoNoEndereco = parametros.get("tipo");
  const tipo = TIPOS_FILTRADOS.includes(tipoNoEndereco) ? tipoNoEndereco : "todos";

  function mostrar(valor) {
    return tipo === "todos" || tipo === valor;
  }

  function mudarTipo(valor) {
    setParametros(valor === "todos" ? {} : { tipo: valor }, { replace: true });
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-10 lp:pb-16">
      <CabecalhoPagina
        titulo="Itens pendentes"
        subtitulo={SUBTITULOS_DA_ADMINISTRACAO.pendentes}
        icone={ICONES_DAS_PAGINAS.administracao}
      />

      <AbasAdministracao />
      <FiltroItensPendentes tipo={tipo} aoMudar={mudarTipo} />

      <div className="flex flex-col gap-12">
        {mostrar("artigos") && <FilaDeArtigos />}
        {mostrar("quizzes") && <FilaDeQuizzes />}
        {mostrar("exercicios") && <FilaDeExercicios />}
        {mostrar("professores") && <VerificacoesCref />}
        {mostrar("exclusoes") && <PedidosDeExclusao />}
      </div>
    </div>
  );
}

export default ItensPendentesPages;