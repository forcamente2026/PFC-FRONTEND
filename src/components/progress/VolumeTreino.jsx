import { useEffect, useState } from "react";
import {
  calcularVolumeTreino,
  listarExerciciosParaVolume,
} from "../../services/metricasService";
import useCalculo from "../../hooks/useCalculo";
import { formatarNumero } from "../../utils/formatar";
import SecaoCalculadora from "./SecaoCalculadora";
import CardResultado from "./CardResultado";
import LinhaSerie from "./LinhaSerie";
import GraficoGrupoMuscular from "./GraficoGrupoMuscular";
import BlocoExplicacao from "./BlocoExplicacao";
import EstadoRequisicao from "./EstadoRequisicao";
import { EXPLICACAO_VOLUME } from "./explicacoesCalculo";


const GRADE = "grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]";

function linhaVazia() {
  return {
    id: crypto.randomUUID(),
    exercicioId: "",
    series: "",
    repeticoes: "",
    cargaKg: "",
  };
}

function VolumeTreino() {
  const [linhas, setLinhas] = useState(() => [linhaVazia()]);
  const [exercicios, setExercicios] = useState([]);
  const [carregandoExercicios, setCarregandoExercicios] = useState(true);
  const [erroExercicios, setErroExercicios] = useState(null);

  const { resultado, carregando, erro, executar } =
    useCalculo(calcularVolumeTreino);

  useEffect(() => {
    let ativo = true;

    listarExerciciosParaVolume()
      .then((lista) => {
        if (!ativo) return;
        if (!Array.isArray(lista)) {
          throw new Error("Resposta inesperada do servidor.");
        }
        setExercicios(lista);
      })
      .catch((falha) => {
        if (!ativo) return;
        setErroExercicios(
          falha.mensagem || "Não foi possível carregar os exercícios.",
        );
      })
      .finally(() => {
        if (ativo) setCarregandoExercicios(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function alterarLinha(id, campo, valor) {
    setLinhas((atual) =>
      atual.map((linha) =>
        linha.id === id ? { ...linha, [campo]: valor } : linha,
      ),
    );
  }

  function adicionarLinha() {
    setLinhas((atual) => [...atual, linhaVazia()]);
  }

  function removerLinha(id) {
    setLinhas((atual) => atual.filter((linha) => linha.id !== id));
  }

  const linhasPreenchidas = linhas.filter(
    (linha) =>
      linha.exercicioId && linha.series && linha.repeticoes && linha.cargaKg,
  );

  function aoEnviar(evento) {
    evento.preventDefault();
    if (!linhasPreenchidas.length) return;

    executar({
      series: linhasPreenchidas.map((linha) => ({
        exercicioId: linha.exercicioId,
        series: Number(linha.series),
        repeticoes: Number(linha.repeticoes),
        cargaKg: Number(linha.cargaKg),
      })),
    });
  }

  const blocoResultado = (
    <EstadoRequisicao
      carregando={carregando}
      erro={erro}
      vazio={!resultado}
      mensagemVazio="Monte sua sessão ao lado e calcule para ver o volume."
    >
      {resultado ? (
        <div className="flex flex-col gap-6">
          <CardResultado
            rotulo="VOLUME TOTAL DA SESSÃO"
            valor={resultado.volumeTotalKg}
            unidade="kg"
            rodape={
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <span>{formatarNumero(resultado.totalSeries)} séries</span>
                {resultado.totalRepeticoes === undefined ? null : (
                  <span>
                    {formatarNumero(resultado.totalRepeticoes)} reps totais
                  </span>
                )}
                {resultado.intensidadeMediaKgPorRep === undefined ? null : (
                  <span>
                    Intensidade média:{" "}
                    <span className="text-red-200">
                      {formatarNumero(resultado.intensidadeMediaKgPorRep)}{" "}
                      kg/rep
                    </span>
                  </span>
                )}
              </div>
            }
          />

          <GraficoGrupoMuscular grupos={resultado.volumePorGrupoMuscular} />

          <BlocoExplicacao texto={EXPLICACAO_VOLUME} />
        </div>
      ) : null}
    </EstadoRequisicao>
  );

  return (
    <SecaoCalculadora
      numero="01"
      titulo="VOLUME DE TREINO"
      conceito={
        <>
          <span className="font-semibold text-white">O que é volume? </span>É o
          peso total que você moveu na sessão: séries × repetições × carga. É a
          principal métrica de sobrecarga progressiva subir o volume ao longo
          das semanas é o que faz o músculo crescer.
        </>
      }
      resultado={blocoResultado}
    >
      <form
        onSubmit={aoEnviar}
        className="flex flex-col gap-6 p-7 border bg-white/5 backdrop-blur-xl border-gray-700 rounded-xl shadow-lg shadow-black/20"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span className="text-xs tracking-widest text-gray-300">
            SUA SESSÃO DE HOJE
          </span>
        </div>

        <div className={`${GRADE} hidden md:grid`}>
          <span className="text-xs tracking-widest text-gray-300">
            EXERCÍCIO
          </span>
          <span className="text-xs tracking-widest text-gray-300">SÉRIES</span>
          <span className="text-xs tracking-widest text-gray-300">REPS</span>
          <span className="text-xs tracking-widest text-gray-300">
            CARGA (KG)
          </span>
          <span className="w-[18px]"></span>
        </div>

        <div className="flex flex-col gap-6 md:gap-3">
          {linhas.map((linha) => (
            <LinhaSerie
              key={linha.id}
              grade={GRADE}
              linha={linha}
              exercicios={exercicios}
              carregandoExercicios={carregandoExercicios}
              aoAlterar={(campo, valor) => alterarLinha(linha.id, campo, valor)}
              aoRemover={() => removerLinha(linha.id)}
              podeRemover={linhas.length > 1}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={adicionarLinha}
          className="self-start text-red-200 border border-gray-500 p-2 rounded-md hover:bg-red-500 hover:text-white cursor-pointer"
        >
          + ADICIONAR EXERCÍCIO
        </button>

        {erroExercicios ? (
          <p className="rounded-md border border-red-500 p-3 text-sm text-red-200">
            {erroExercicios}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!linhasPreenchidas.length || carregando}
          className="self-start bg-red-500 py-1 px-4 font-medium text-white hover:bg-red-900 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-300"
        >
          {carregando ? "CALCULANDO..." : "CALCULAR"}
        </button>
      </form>
    </SecaoCalculadora>
  );
}

export default VolumeTreino;
