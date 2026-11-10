import { formatarNumero } from "../../utils/formatar";

function GraficoGrupoMuscular({ grupos }) {
  if (!grupos || !grupos.length) return null;

  const maiorVolume = Math.max(...grupos.map((grupo) => grupo.volumeKg));

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs tracking-widest text-gray-300">
        VOLUME POR GRUPO MUSCULAR
      </span>

      <ul className="flex flex-col gap-3">
        {grupos.map((grupo) => (
          <li key={grupo.grupoMuscular} className="flex flex-col gap-1">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-300">{grupo.descricao}</span>
              <span className="text-red-200">
                {formatarNumero(grupo.volumeKg)} kg
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-red-500"
                style={{
                  width: maiorVolume
                    ? `${(grupo.volumeKg / maiorVolume) * 100}%`
                    : "0%",
                }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GraficoGrupoMuscular;
