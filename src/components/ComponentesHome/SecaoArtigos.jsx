import CabecalhoSecao from "./CabecalhoSecao";
import CardArtigo from "./CardArtigo";

function SecaoArtigos({ artigos }) {
  return (
    <section className="py-12">
      <CabecalhoSecao
        rotulo="Acervo"
        titulo="Artigos e revisões"
        descricao="Cada texto indica o desenho do estudo e o nível de confiança das conclusões apresentadas."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {artigos.map((artigo) => (
          <CardArtigo key={artigo.id} artigo={artigo} />
        ))}
      </div>
    </section>
  );
}

export default SecaoArtigos;
