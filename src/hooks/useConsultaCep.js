import { useEffect, useRef, useState } from "react";
import { buscarEnderecoPorCep } from "../services/enderecoService";
import { formatarCep, somenteDigitos } from "../utils/formatar";

export default function useConsultaCep(setEndereco, cepInicial = "", aoEncontrar) {
  const ultimaConsulta = useRef(0);
  const ultimoCep = useRef(somenteDigitos(cepInicial));
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState(null);

  useEffect(() => () => { ultimaConsulta.current += 1; }, []);

  function limparConsulta() {
    ultimaConsulta.current += 1;
    ultimoCep.current = "";
    setBuscandoCep(false);
    setErroCep(null);
  }

  async function alterarCep(evento) {
    const cep = formatarCep(evento.target.value);
    const limpo = somenteDigitos(cep);
    if (limpo === ultimoCep.current) return;

    ultimoCep.current = limpo;
    const consulta = ++ultimaConsulta.current;
    setEndereco((anterior) => ({
      ...anterior, cep, logradouro: "", bairro: "", cidade: "", estado: "",
    }));
    setErroCep(null);
    setBuscandoCep(limpo.length === 8);
    if (limpo.length !== 8) return;

    try {
      const dados = await buscarEnderecoPorCep(limpo);
      if (consulta !== ultimaConsulta.current) return;
      setEndereco((anterior) => ({
        ...anterior,
        logradouro: dados.logradouro ?? "",
        bairro: dados.bairro ?? "",
        cidade: dados.cidade ?? "",
        estado: dados.estado ?? "",
      }));
      aoEncontrar?.();
    } catch (err) {
      if (consulta !== ultimaConsulta.current) return;
      ultimoCep.current = "";
      setErroCep(err.mensagem || "Não foi possível buscar este CEP.");
    } finally {
      if (consulta === ultimaConsulta.current) setBuscandoCep(false);
    }
  }

  return { alterarCep, buscandoCep, erroCep, limparConsulta };
}
