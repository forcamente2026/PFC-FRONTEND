function BarraProgresso({ rotulo, percentual, mensagem }) {
  const largura = Math.min(Math.max(percentual ?? 0, 0), 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-4 text-sm">
        <span className="text-gray-300">{rotulo}</span>
        <span className="text-red-200">{percentual}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
        <div
          className="h-full rounded-full bg-red-500"
          style={{ width: `${largura}%` }}
        ></div>
      </div>

      {mensagem ? (
        <p className="text-gray-300 wrap-break-word">{mensagem}</p>
      ) : null}
    </div>
  );
}

export default BarraProgresso;
