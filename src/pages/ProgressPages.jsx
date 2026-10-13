import { useState } from "react";
import HeadProgress from "../components/progress/HeadProgress";
import AvisoLegal from "../components/progress/AvisoLegal";
import VolumeTreino from "../components/progress/VolumeTreino";
import CalculadoraTMB from "../components/progress/CalculadoraTMB";
import CalculadoraHidratacao from "../components/progress/CalculadoraHidratacao";
import RodapeProgress from "../components/progress/RodapeProgress";
import ConsentimentoSaude from "../components/progress/ConsentimentoSaude";

const EXIBIR_CALCULADORAS_SEM_BACKEND = false;

function ProgressPages() {
  const [pesoKg, setPesoKg] = useState("");
  const [consentiu, setConsentiu] = useState(false);

  return (
    <div className="my-10 flex flex-col">
      <HeadProgress />
      <AvisoLegal />
      <VolumeTreino />
      {EXIBIR_CALCULADORAS_SEM_BACKEND && (
        <ConsentimentoSaude consentiu={consentiu} aoAlterar={setConsentiu} />
      )}
      {EXIBIR_CALCULADORAS_SEM_BACKEND && (
        <CalculadoraTMB pesoKg={pesoKg} aoAlterarPeso={setPesoKg} consentiu={consentiu} />
      )}
      {EXIBIR_CALCULADORAS_SEM_BACKEND && (
        <CalculadoraHidratacao pesoKg={pesoKg} aoAlterarPeso={setPesoKg} consentiu={consentiu} />
      )}
      <RodapeProgress />
    </div>
  );
}

export default ProgressPages;
