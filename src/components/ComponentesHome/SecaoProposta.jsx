import { Link } from "react-router-dom";
import Cartao from "./Cartao";

function SecaoProposta({ proposta }) {
  const { titulo, texto } = proposta;

  return (
    <section className="py-12">
      <Cartao className="bg-linear-to-br from-red-950/60 to-transparent p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
          Proposta comercial
        </p>
        <h2 className="mt-1 font-montserrat text-3xl text-white md:text-4xl">
          {titulo}
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">
          {texto}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/cadastro"
            className="rounded-full bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-900"
          >
            Começar agora
          </Link>
          <Link
            to="/library"
            className="rounded-full border border-gray-600 px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            Conhecer o acervo
          </Link>
        </div>
      </Cartao>
    </section>
  );
}

export default SecaoProposta;
