import { useEffect, useState } from "react";
import {
  calcularGastoEnergetico,
  listarNiveisAtividade,
  listarSexos,
} from "../../services/metricasService";
import useCalculo from "../../hooks/useCalculo";
import SecaoCalculadora from "./SecaoCalculadora";
import CardResultado from "./CardResultado";
import CampoNumero from "./CampoNumero";
import MemoriaCalculo from "./MemoriaCalculo";
import BlocoExplicacao from "./BlocoExplicacao";
import EstadoRequisicao from "./EstadoRequisicao";
import { EXPLICACAO_TMB } from "./explicacoesCalculo";
import { formatarNumero, paraNumero } from "../../utils/formatar";

function CalculadoraTMB({ pesoKg, aoAlterarPeso, consentiu }) {
  const [alturaCm, setAlturaCm] = useState("");
  const [idade, setIdade] = useState("");
  const [sexos, setSexos] = useState([]);
  const [sexoBiologico, setSexoBiologico] = useState("");
  const [niveis, setNiveis] = useState([]);
  const [nivelAtividade, setNivelAtividade] = useState("");
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
  const [erroListas, setErroListas] = useState(null);

  const { resultado, carregando, erro, executar } =
    useCalculo(calcularGastoEnergetico);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarSexos(), listarNiveisAtividade()])
      .then(([listaSexos, listaNiveis]) => {
        if (!ativo) return;
        if (!Array.isArray(listaSexos) || !Array.isArray(listaNiveis)) {
          throw new Error("Resposta inesperada do servidor.");
        }
        setSexos(listaSexos);
        setSexoBiologico(listaSexos[0]?.codigo ?? "");
        setNiveis(listaNiveis);
        setNivelAtividade(listaNiveis[0]?.codigo ?? "");
      })
      .catch((falha) => {
        if (!ativo) return;
        setErroListas(
          falha.mensagem || "Não foi possível carregar as opções de cálculo.",
        );
      })
      .finally(() => {
        if (ativo) setCarregandoOpcoes(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const formularioValido =
    consentiu && pesoKg && alturaCm && idade && sexoBiologico && nivelAtividade;

  function aoEnviar(evento) {
    evento.preventDefault();
    if (!formularioValido) return;

    executar({
      pesoKg: paraNumero(pesoKg),
      alturaCm: paraNumero(alturaCm),
      idade: paraNumero(idade),
      sexoBiologico,
      nivelAtividade,
    });
  }

  const blocoResultado = (
    <EstadoRequisicao
      carregando={carregando}
      erro={erro}
      vazio={!resultado}
      mensagemVazio="Preencha seus dados ao lado e calcule para ver o resultado."
    >
      {resultado ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <CardResultado
              rotulo="SUA TMB"
              valor={resultado.tmb}
              unidade="kcal"
              tamanho="medio"
            />
            <CardResultado
              rotulo="GASTO TOTAL / DIA"
              valor={resultado.gastoEnergeticoTotal}
              unidade="kcal"
              variante="neutro"
              tamanho="medio"
            />
          </div>

          <MemoriaCalculo
            itens={[
              { rotulo: "Fórmula utilizada", valor: resultado.formulaUtilizada },
              {
                rotulo: "Fator de atividade aplicado",
                valor: `×${formatarNumero(resultado.fatorAtividadeAplicado)}`,
              },
            ]}
          />

          <BlocoExplicacao texto={EXPLICACAO_TMB} />
        </div>
      ) : null}
    </EstadoRequisicao>
  );

  return (
    <SecaoCalculadora
      numero="02"
      titulo="TAXA METABÓLICA BASAL"
      conceito={
        <>
          <span className="font-semibold text-white">O que é TMB? </span>É a
          energia que seu corpo consome em repouso, só para manter as funções
          vitais. Calculamos pela fórmula Mifflin-St Jeor a referência para
          montar superávit (ganho) ou déficit (perda).
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
            SEUS DADOS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CampoNumero
            id="peso-tmb"
            rotulo="PESO (KG)"
            valor={pesoKg}
            aoAlterar={aoAlterarPeso}
            decimal
            placeholder="82,5"
          />
          <CampoNumero
            id="altura"
            rotulo="ALTURA (CM)"
            valor={alturaCm}
            aoAlterar={setAlturaCm}
            placeholder="178"
          />
          <CampoNumero
            id="idade"
            rotulo="IDADE"
            valor={idade}
            aoAlterar={setIdade}
            placeholder="27"
          />

          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-widest text-gray-300">
              SEXO BIOLÓGICO
            </span>
            <div className="flex gap-2 border-b border-gray-500 py-1">
              {carregandoOpcoes ? (
                <span className="py-1 text-sm text-gray-300">
                  Carregando...
                </span>
              ) : null}
              {sexos.map((sexo) => (
                <button
                  key={sexo.codigo}
                  type="button"
                  onClick={() => setSexoBiologico(sexo.codigo)}
                  className={`rounded-md px-3 py-1 text-sm cursor-pointer ${
                    sexoBiologico === sexo.codigo
                      ? "bg-red-500 text-white"
                      : "text-gray-300 hover:text-red-200"
                  }`}
                >
                  {sexo.descricao}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-widest text-gray-300">
            NÍVEL DE ATIVIDADE
          </span>
          <ul className="flex flex-col">
            {carregandoOpcoes ? (
              <li className="py-2 text-sm text-gray-300">Carregando...</li>
            ) : null}
            {niveis.map((nivel) => (
              <li key={nivel.codigo}>
                <button
                  type="button"
                  onClick={() => setNivelAtividade(nivel.codigo)}
                  className={`w-full border-b border-gray-700 py-2 text-left text-sm cursor-pointer ${
                    nivelAtividade === nivel.codigo
                      ? "font-semibold text-red-500"
                      : "text-gray-300 hover:text-red-200"
                  }`}
                >
                  {nivel.descricao}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {erroListas ? (
          <p className="rounded-md border border-red-500 p-3 text-sm text-red-200">
            {erroListas}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!formularioValido || carregando}
          className="self-start bg-red-500 py-1 px-4 font-medium text-white hover:bg-red-900 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-300"
        >
          {carregando ? "CALCULANDO..." : "CALCULAR"}
        </button>
      </form>
    </SecaoCalculadora>
  );
}

export default CalculadoraTMB;
