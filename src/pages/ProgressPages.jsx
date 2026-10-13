import { useState } from "react";
import HeadProgress from "../components/progress/HeadProgress";
import AvisoLegal from "../components/progress/AvisoLegal";
import VolumeTreino from "../components/progress/VolumeTreino";
import CalculadoraTMB from "../components/progress/CalculadoraTMB";
import CalculadoraHidratacao from "../components/progress/CalculadoraHidratacao";
import RodapeProgress from "../components/progress/RodapeProgress";
import ConsentimentoSaude from "../components/progress/ConsentimentoSaude";

function ProgressPages() {
  const [pesoKg, setPesoKg] = useState("");
  const [consentiu, setConsentiu] = useState(false);

  return (
    <div className="my-10 flex flex-col">
      <HeadProgress />
      <AvisoLegal />
      <VolumeTreino />
      <ConsentimentoSaude consentiu={consentiu} aoAlterar={setConsentiu} />
      <CalculadoraTMB pesoKg={pesoKg} aoAlterarPeso={setPesoKg} consentiu={consentiu} />
      <CalculadoraHidratacao pesoKg={pesoKg} aoAlterarPeso={setPesoKg} consentiu={consentiu} />
      <RodapeProgress />
    </div>
  );
}

export default ProgressPages;
