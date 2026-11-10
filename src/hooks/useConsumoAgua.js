import { useState } from "react";
import { resumirConsumoAgua } from "../services/metricasService";
import {
  dataDeHoje,
  lerCacheConsumo,
  gravarCacheConsumo,
} from "../utils/cacheConsumoAgua";

function useConsumoAgua() {
  const data = dataDeHoje();
  const [resumo, setResumo] = useState(() => lerCacheConsumo(data));
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState(null);

  async function enviar(dados, quantidadeMl) {
    setProcessando(true);
    setErro(null);

    try {
      const resposta = await resumirConsumoAgua({
        ...dados,
        totalConsumidoMl: resumo?.totalConsumidoMl ?? 0,
        quantidadeMl,
      });
      setResumo(resposta);
      gravarCacheConsumo(data, resposta);
      return resposta;
    } catch (falha) {
      setErro(
        falha?.mensagem ??
          "Não foi possível atualizar seu consumo de água. Tente novamente.",
      );
    } finally {
      setProcessando(false);
    }
  }

  function carregar(dados) {
    return enviar(dados, 0);
  }

  function registrar(dados, quantidadeMl) {
    return enviar(dados, quantidadeMl);
  }

  return { resumo, processando, erro, carregar, registrar };
}

export default useConsumoAgua;
