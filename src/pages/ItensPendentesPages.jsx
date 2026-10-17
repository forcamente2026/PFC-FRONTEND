import CabecalhoSecao from "../components/ComponentesHome/CabecalhoSecao";
import AbasAdministracao from "../components/AdminComponents/AbasAdministracao";

function ItensPendentesPages() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 lp:py-16">
      <CabecalhoSecao
        rotulo="Administração"
        titulo="Itens pendentes"
        descricao="O que espera a decisão do administrador: artigos e pedidos de exclusão de conta."
      />

      <AbasAdministracao />
    </div>
  );
}

export default ItensPendentesPages;