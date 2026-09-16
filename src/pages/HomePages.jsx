import SecaoArtigos from "../components/ComponentesHome/SecaoArtigos";
import SecaoCuriosidades from "../components/ComponentesHome/SecaoCuriosidades";
import SecaoProposta from "../components/ComponentesHome/SecaoProposta";
import {
  artigos,
  curiosidades,
  proposta,
} from "../components/ComponentesHome/dadosHome";

function HomePages() {
  return (
    <div className="flex flex-col items-center p-1">
      <img src="/images/logo_ofcial.png" alt="Logo" />

      <div className="text-center font-montserrat text-white text-5xl">
        <h1>
          Mais que músculos, <span className="text-red-500">conhecimento</span>.
        </h1>
        <p className="text-lg mt-4 text-red-200">
          Treine com propósito. Estude com disciplina. Evolua com conhecimento.
        </p>
      </div>

      <div className="w-full max-w-6xl px-4 divide-y divide-gray-800">
        <SecaoArtigos artigos={artigos} />
        <SecaoCuriosidades curiosidades={curiosidades} />
        <SecaoProposta proposta={proposta} />
      </div>
    </div>
  );
}

export default HomePages;
