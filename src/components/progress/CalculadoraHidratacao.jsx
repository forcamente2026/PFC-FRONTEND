import { useState } from "react";
import { calcularHidratacao } from "../../services/metricasService";
import useCalculo from "../../hooks/useCalculo";
import useConsumoAgua from "../../hooks/useConsumoAgua";
import { formatarNumero } from "../../utils/formatar";
import SecaoCalculadora from "./SecaoCalculadora";
import CardResultado from "./CardResultado";
import CampoNumero from "./CampoNumero";
import BarraComposicao from "./BarraComposicao";
import BlocoExplicacao from "./BlocoExplicacao";
import EstadoRequisicao from "./EstadoRequisicao";
import TrackerAgua from "./TrackerAgua";
import { EXPLICACAO_HIDRATACAO } from "./explicacoesCalculo";

function CalculadoraHidratacao({ pesoKg, aoAlterarPeso }) {
  const [minutosTreinoPorDia, setMinutosTreinoPorDia] = useState("");

  const { resultado, carregando, erro, executar } =
    useCalculo(calcularHidratacao);

  const {
    resumo,
    processando,
    erro: erroConsumo,
    carregar,
    registrar,
  } = useConsumoAgua();

  const formularioValido = pesoKg && minutosTreinoPorDia !== "";

  function dadosDoDia() {
    return {
      pesoKg: Number(pesoKg),
      minutosTreinoPorDia: Number(minutosTreinoPorDia),
    };
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    if (!formularioValido) return;

    await executar(dadosDoDia());
    carregar(dadosDoDia());
  }

  function aoRegistrarConsumo(quantidadeMl) {
    registrar({ ...dadosDoDia(), quantidadeMl });
  }

  const blocoResultado = (
    <div className="flex flex-col gap-6">
      <EstadoRequisicao
        carregando={carregando}
        erro={erro}
        vazio={!resultado}
        mensagemVazio="Informe seu peso e o tempo de treino ao lado para ver sua meta."
      >
        {resultado ? (
          <div className="flex flex-col gap-6">
            <CardResultado
              rotulo="SUA META DIÁRIA"
              valor={resultado.litrosPorDia}
              unidade="litros"
              rodape={`${formatarNumero(resultado.mlPorDia)} ml por dia`}
            />

            <BarraComposicao
              titulo="COMPOSIÇÃO DA META"
              total={resultado.mlPorDia}
              segmentos={[
                {
                  rotulo: "Base corporal (peso)",
                  valor: resultado.baseCorporalMl,
                  texto: `${formatarNumero(resultado.baseCorporalMl)} ml`,
                  cor: "bg-red-500",
                },
                {
                  rotulo: "Adicional de treino",
                  valor: resultado.adicionalTreinoMl,
                  texto: `${formatarNumero(resultado.adicionalTreinoMl)} ml`,
                  cor: "bg-red-200",
                },
              ]}
            />

            <BlocoExplicacao texto={EXPLICACAO_HIDRATACAO} />
          </div>
        ) : null}
      </EstadoRequisicao>

      {resumo ? (
        <CardResultado
          rotulo="ÁGUA CONSUMIDA HOJE"
          valor={resumo.totalConsumidoMl}
          unidade="ml"
          variante="neutro"
          rodape={`Faltam ${formatarNumero(resumo.restanteMl)} ml para a meta de ${formatarNumero(resumo.metaMl)} ml.`}
        />
      ) : null}
    </div>
  );

  return (
    <SecaoCalculadora
      numero="03"
      titulo="META DE HIDRATAÇÃO"
      conceito={
        <>
          <span className="font-semibold text-white">O que é a meta? </span>É
          quanta água seu corpo precisa em um dia: uma parte vem do seu peso
          corporal e outra do tempo que você treina. Água regula a temperatura,
          transporta nutrientes e sustenta a contração muscular treinar
          desidratado custa força.
        </>
      }
      resultado={blocoResultado}
    >
      <div className="flex flex-col gap-6">
        <form
          onSubmit={aoEnviar}
          className="flex flex-col gap-6 p-7 border bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span className="text-xs tracking-widest text-gray-300">
              SEU DIA DE TREINO
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <CampoNumero
                id="peso-hidratacao"
                rotulo="PESO (KG)"
                valor={pesoKg}
                aoAlterar={aoAlterarPeso}
                min="1"
                step="0.1"
                placeholder="82.5"
              />
              <span className="text-xs text-gray-300">
                É o mesmo peso da calculadora de TMB.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <CampoNumero
                id="minutos-treino"
                rotulo="TREINO POR DIA (MIN)"
                valor={minutosTreinoPorDia}
                aoAlterar={setMinutosTreinoPorDia}
                min="0"
                placeholder="60"
              />
              <span className="text-xs text-gray-300">
                Use 0 se for dia de descanso.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!formularioValido || carregando}
            className="self-start bg-red-500 py-1 px-4 font-medium text-white hover:bg-red-900 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-300"
          >
            {carregando ? "CALCULANDO..." : "CALCULAR"}
          </button>
        </form>

        <TrackerAgua
          habilitado={Boolean(formularioValido && resultado)}
          resumo={resumo}
          processando={processando}
          erro={erroConsumo}
          aoRegistrar={aoRegistrarConsumo}
        />
      </div>
    </SecaoCalculadora>
  );
}

export default CalculadoraHidratacao;
