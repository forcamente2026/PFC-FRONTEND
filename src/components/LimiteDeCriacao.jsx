import { LIMITE_CRIACAO_PROFESSOR, limiteDeCriacao } from "../utils/limiteCriacao";

function LimiteDeCriacao({ itens, usuario, tipo }) {
  if (usuario?.papel !== "PROFESSOR") return null;

  const { quantidade, bloqueado } = limiteDeCriacao(itens, usuario);

  return (
    <section
      aria-label={`Limite de ${tipo}`}
      className={`mx-auto mb-4 w-fit max-w-full rounded-xl border px-5 py-2 text-center text-sm ${
        bloqueado
          ? "border-yellow-500 bg-yellow-500/10 text-yellow-100"
          : "border-gray-700 bg-white/5 text-gray-300"
      }`}
    >
      <p aria-live="polite" className="font-semibold">
        {quantidade} de {LIMITE_CRIACAO_PROFESSOR} {tipo} sem aprovação do administrador
      </p>
      <p className="mt-1">
        {bloqueado
          ? "Limite atingido. Aguarde a aprovação do administrador para criar novamente."
          : "Cada aprovação do administrador libera uma vaga para este tipo de conteúdo."}
      </p>
    </section>
  );
}

export default LimiteDeCriacao;
