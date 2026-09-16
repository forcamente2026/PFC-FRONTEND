import CabecalhoSecao from "./CabecalhoSecao";
import CardCuriosidade from "./CardCuriosidade";

function SecaoCuriosidades({ curiosidades }) {
  return (
    <section className="py-12">
      <CabecalhoSecao
        rotulo="Você sabia"
        titulo="Curiosidades sobre os exercícios"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {curiosidades.map((curiosidade, indice) => (
          <CardCuriosidade
            key={curiosidade.id}
            numero={indice + 1}
            curiosidade={curiosidade}
          />
        ))}
      </div>
    </section>
  );
}

export default SecaoCuriosidades;
