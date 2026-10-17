import { useOutletContext, useSearchParams } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import AbasAdministracao from "../components/AdminComponents/AbasAdministracao";
import FiltroItensPendentes from "../components/AdminComponents/FiltroItensPendentes";
import PedidosDeExclusao from "../components/AdminComponents/PedidosDeExclusao";
import FilaDeArtigos from "../components/AdminComponents/FilaDeArtigos";

const TIPOS_FILTRADOS = ["artigos", "exclusoes"];

function ItensPendentesPages() {
  const { usuario } = useOutletContext();
  const [parametros, setParametros] = useSearchParams();

  const tipoNoEndereco = parametros.get("tipo");
  const tipo = TIPOS_FILTRADOS.includes(tipoNoEndereco) ? tipoNoEndereco : "todos";

  function mudarTipo(valor) {
    setParametros(valor === "todos" ? {} : { tipo: valor }, { replace: true });
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Administração"
        titulo="Itens pendentes"
        descricao="O que espera a decisão do administrador: artigos e pedidos de exclusão de conta."
      />

      <AbasAdministracao />
      <FiltroItensPendentes tipo={tipo} aoMudar={mudarTipo} />

      <div className="flex flex-col gap-12">
        {tipo !== "exclusoes" && <FilaDeArtigos usuario={usuario} />}
        {tipo !== "artigos" && <PedidosDeExclusao />}
      </div>
    </div>
  );
}

export default ItensPendentesPages;