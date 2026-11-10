function RodapeProgress() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-4">
      <div className="flex flex-col gap-6 lp:flex-row lp:gap-12">
        <div className="lp:w-2/5">
          <span className="text-xs tracking-widest text-gray-300">
            CALCULADORAS PESSOAIS // CONCEITOS AO LADO DE CADA NÚMERO
          </span>
        </div>

        <div className="lp:w-3/5">
          <p className="text-sm text-gray-300 wrap-break-word">
            <span className="font-semibold text-white">Como usar? </span>
            Atualize os números a cada sessão de treino. Para ajustes finos,
            consulte um profissional.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RodapeProgress;
