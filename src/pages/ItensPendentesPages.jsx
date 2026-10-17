import { useOutletContext } from "react-router-dom";
import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import AbasAdministracao from "../components/AdminComponents/AbasAdministracao";
import PedidosDeExclusao from "../components/AdminComponents/PedidosDeExclusao";
import FilaDeArtigos from "../components/AdminComponents/FilaDeArtigos";

function ItensPendentesPages() {
  const { usuario } = useOutletContext();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Administração"
        titulo="Itens pendentes"
        descricao="O que espera a decisão do administrador: artigos e pedidos de exclusão de conta."
      />

      <AbasAdministracao />
      
    <div className="flex flex-col gap-12">
      <FilaDeArtigos usuario={usuario} />
      <PedidosDeExclusao />
    </div>
    </div>
  );
}

export default ItensPendentesPages;