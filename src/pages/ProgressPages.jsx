import { useState } from "react";
import HeadProgress from "../components/progress/HeadProgress";
import AvisoLegal from "../components/progress/AvisoLegal";
import VolumeTreino from "../components/progress/VolumeTreino";
import CalculadoraTMB from "../components/progress/CalculadoraTMB";
import CalculadoraHidratacao from "../components/progress/CalculadoraHidratacao";
import RodapeProgress from "../components/progress/RodapeProgress";

const EXIBIR_CALCULADORAS_SEM_BACKEND = false;

function ProgressPages() {
  const [pesoKg, setPesoKg] = useState("");

  return (
    <div className="my-10 flex flex-col">
      <HeadProgress />
      <AvisoLegal />
      <VolumeTreino />
      {EXIBIR_CALCULADORAS_SEM_BACKEND && (
        <CalculadoraTMB pesoKg={pesoKg} aoAlterarPeso={setPesoKg} />
      )}
      {EXIBIR_CALCULADORAS_SEM_BACKEND && (
        <CalculadoraHidratacao pesoKg={pesoKg} aoAlterarPeso={setPesoKg} />
      )}
      <RodapeProgress />
    </div>
  );
}

export default ProgressPages;
