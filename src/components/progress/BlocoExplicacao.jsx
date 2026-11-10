function BlocoExplicacao({ texto }) {
  if (!texto) return null;

  return (
    <div className="flex flex-col gap-2 border-l-2 border-red-500 pl-4">
      <span className="text-xs tracking-widest text-red-200">
        ENTENDA O CÁLCULO
      </span>
      <p className="text-gray-300 wrap-break-word">{texto}</p>
    </div>
  );
}

export default BlocoExplicacao;
