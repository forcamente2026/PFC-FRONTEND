import { useState } from "react";

function useCalculo(requisicao) {
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function executar(dados) {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await requisicao(dados);
      setResultado(resposta);
      return resposta;
    } catch (falha) {
      setErro(
        falha?.mensagem ??
          "Não foi possível concluir a operação. Tente novamente.",
      );
      setResultado(null);
    } finally {
      setCarregando(false);
    }
  }

  return { resultado, carregando, erro, executar };
}

export default useCalculo;
