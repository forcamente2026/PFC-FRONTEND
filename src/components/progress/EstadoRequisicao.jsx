function EstadoRequisicao({
  carregando,
  mensagemCarregando = "Calculando...",
  erro,
  vazio,
  mensagemVazio,
  children,
}) {
  if (carregando) {
    return <p className="text-sm text-gray-300">{mensagemCarregando}</p>;
  }

  if (erro) {
    return (
      <p className="rounded-md border border-red-500 p-3 text-sm text-red-200">
        {erro}
      </p>
    );
  }

  if (vazio) {
    return <p className="text-sm text-gray-300">{mensagemVazio}</p>;
  }

  return children;
}

export default EstadoRequisicao;
