import Cartao from "./Cartao";

function CardCuriosidade({ numero, curiosidade }) {
  const { titulo, texto } = curiosidade;

  return (
    <Cartao className="flex gap-4">
      <span className="font-montserrat text-2xl text-red-500">
        {String(numero).padStart(2, "0")}
      </span>

      <div>
        <h3 className="font-montserrat text-white">{titulo}</h3>
        <p className="mt-1 text-sm text-gray-400">{texto}</p>
      </div>
    </Cartao>
  );
}

export default CardCuriosidade;
