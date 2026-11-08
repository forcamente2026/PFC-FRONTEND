import { Fragment, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import EstadoRequisicao from "../progress/EstadoRequisicao";
import AvisoDeSimulacao from "../LibraryComponents/AvisoDeSimulacao";
import ConteudoExercicio from "../LibraryComponents/ConteudoExercicio";
import ValidacaoExercicio from "../LibraryComponents/ValidacaoExercicio";
import { montarDicionario } from "../LibraryComponents/exercicioCampos";
import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import {
  listarExerciciosPendentes,
  listarGruposMusculares,
  listarNiveis,
  MODERACAO_DE_EXERCICIOS_SIMULADA,
} from "../../services/exercicioService";
import { formatarDataCurta } from "../../utils/formatar";

const ESTILO_CABECALHO = "py-2 pr-4 font-semibold text-red-200 whitespace-nowrap";
const ESTILO_CELULA = "py-2 pr-4 text-gray-300 align-top";
const ESTILO_ETIQUETA = "rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap";
const ESTILO_VER =
  "rounded-md border border-gray-600 px-3 py-1 text-xs text-red-200 hover:bg-white/10 cursor-pointer whitespace-nowrap";

const CORES_DA_SITUACAO = {
  PENDENTE: "border-yellow-500 bg-yellow-500/15 text-yellow-200",
  APROVADO_PELOS_PROFESSORES: "border-green-600 bg-green-600/20 text-green-300",
};

function situacaoDoExercicio(exercicio) {
  const descricao = STATUS_ARTIGO[exercicio.status]?.descricao ?? exercicio.status;
  return `${descricao} · ${exercicio.aprovacoesDeProfessores} de ${exercicio.aprovacoesNecessarias}`;
}

function FilaDeExercicios() {
  const { avisar } = useOutletContext();
  const [exercicios, setExercicios] = useState([]);
  const [grupos, setGrupos] = useState({});
  const [niveis, setNiveis] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [idAberto, setIdAberto] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.all([listarExerciciosPendentes(), listarGruposMusculares(), listarNiveis()])
      .then(([lista, gruposResposta, niveisResposta]) => {
        if (!ativo) return;
        setExercicios(lista);
        setGrupos(montarDicionario(gruposResposta));
        setNiveis(montarDicionario(niveisResposta));
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err.mensagem || "Não foi possível carregar os exercícios pendentes.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  function alternar(id) {
    setIdAberto((atual) => (atual === id ? null : id));
  }

  function retirarDaFila(atualizado) {
    setExercicios((atuais) => atuais.filter((item) => item.id !== atualizado.id));
    setIdAberto(null);
    avisar({
      tipo: "sucesso",
      titulo: atualizado.status === "APROVADO" ? "Exercício aprovado" : "Exercício rejeitado",
      mensagem:
        atualizado.status === "APROVADO"
          ? `"${atualizado.nome}" está publicado no site.`
          : `"${atualizado.nome}" foi rejeitado, e o autor vê o motivo.`,
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold tracking-[0.25em] text-red-200 uppercase">
          Exercícios para revisar
          {!carregando && !erro && ` (${exercicios.length})`}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Exercícios que esperam a decisão do administrador. Em "Ver +" aparecem a técnica e os
          botões de aprovar e rejeitar.
        </p>
      </div>

      {MODERACAO_DE_EXERCICIOS_SIMULADA && <AvisoDeSimulacao />}

      <EstadoRequisicao
        carregando={carregando}
        mensagemCarregando="Carregando exercícios..."
        erro={erro}
        vazio={exercicios.length === 0}
        mensagemVazio="Nenhum exercício aguardando revisão."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className={ESTILO_CABECALHO}>Exercício</th>
                <th className={ESTILO_CABECALHO}>Situação</th>
                <th className={ESTILO_CABECALHO}>Enviado em</th>
                <th className={ESTILO_CABECALHO}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {exercicios.map((exercicio) => {
                const aberto = exercicio.id === idAberto;

                return (
                  <Fragment key={exercicio.id}>
                    <tr className={aberto ? "" : "border-b border-gray-700"}>
                      <td className={`${ESTILO_CELULA} wrap-anywhere`}>
                        <span className="block text-white">{exercicio.nome}</span>
                        <span className="block text-xs text-gray-400">
                          por {exercicio.autorNome}
                        </span>
                      </td>
                      <td className={ESTILO_CELULA}>
                        <span
                          className={`${ESTILO_ETIQUETA} ${
                            CORES_DA_SITUACAO[exercicio.status] ?? "border-gray-600 text-gray-300"
                          }`}
                        >
                          {situacaoDoExercicio(exercicio)}
                        </span>
                      </td>
                      <td className={`${ESTILO_CELULA} whitespace-nowrap`}>
                        {formatarDataCurta(exercicio.criadoEm)}
                      </td>
                      <td className={ESTILO_CELULA}>
                        <button
                          type="button"
                          aria-expanded={aberto}
                          onClick={() => alternar(exercicio.id)}
                          className={ESTILO_VER}
                        >
                          {aberto ? "Ver −" : "Ver +"}
                        </button>
                      </td>
                    </tr>
                    {aberto && (
                      <tr className="border-b border-gray-700">
                        <td colSpan={4} className="pr-4 pb-6">
                          <div className="flex flex-col gap-4 pt-1">
                            <ConteudoExercicio
                              exercicio={exercicio}
                              rotuloGrupo={grupos[exercicio.grupoMuscular] ?? exercicio.grupoMuscular}
                              rotuloNivel={niveis[exercicio.nivel] ?? exercicio.nivel}
                            />
                            <ValidacaoExercicio
                              exercicio={exercicio}
                              aoAlterarStatus={retirarDaFila}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </EstadoRequisicao>
    </section>
  );
}

export default FilaDeExercicios;
