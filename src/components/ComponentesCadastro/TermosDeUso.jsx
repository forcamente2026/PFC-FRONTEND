const SECOES_TERMOS = [
  { titulo: "1. Objeto", texto: "Texto a definir." },
  { titulo: "2. Cadastro e conta", texto: "Texto a definir." },
  { titulo: "3. Uso da plataforma", texto: "Texto a definir." },
  { titulo: "4. Privacidade e dados", texto: "Texto a definir." },
  { titulo: "5. Responsabilidades", texto: "Texto a definir." },
];

function TermosDeUso({ aoFechar, aoAceitar }) {
  return (
    <div className="max-w-2xl space-y-6 p-4 text-white">
      <h2 className="text-center font-montserrat text-3xl text-red-200">
        Termos de Uso
      </h2>
      <div className="h-px w-full bg-gray-300"></div>

      {SECOES_TERMOS.map((secao) => (
        <section key={secao.titulo} className="space-y-2">
          <h3 className="font-semibold text-red-200">{secao.titulo}</h3>
          <p className="text-gray-300">{secao.texto}</p>
        </section>
      ))}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={aoFechar}
          className="rounded-md border border-gray-700 px-4 py-2 text-red-200 hover:bg-white/10 cursor-pointer"
        >
          Fechar
        </button>
        <button
          type="button"
          onClick={aoAceitar}
          className="rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-900 cursor-pointer"
        >
          Aceitar e fechar
        </button>
      </div>
    </div>
  );
}

export default TermosDeUso;
