import { descreverCampo } from "./quizCampos";

function ListaDeErros({ erro, campos }) {
  if (!erro && campos.length === 0) return null;

  return (
    <div role="alert" className="text-sm text-red-400">
      {erro && <p>{erro}</p>}
      {campos.length > 0 && (
        <ul className="mt-1 list-disc pl-6">
          {campos.map((campo) => {
            const rotulo = descreverCampo(campo.campo);
            return (
              <li key={`${campo.campo}-${campo.mensagem}`}>
                {rotulo ? `${rotulo}: ${campo.mensagem}` : campo.mensagem}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ListaDeErros;
