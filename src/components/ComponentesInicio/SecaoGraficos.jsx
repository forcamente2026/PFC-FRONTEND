import { useEffect, useState } from "react";
import CartaoGrafico from "./CartaoGrafico";
import GraficoBarras from "./GraficoBarras";
import GraficoLinha from "./GraficoLinha";
import {
  atividadeNoTempo,
  contasPorPerfil,
  desempenhoDosQuizzes,
  exerciciosPorGrupo,
  meusItensPorSituacao,
  notaMediaPorCategoria,
  notasNoTempo,
} from "./graficosInicio";
import {
  GRAFICOS_SIMULADOS,
  listarAtividadePorDia,
  listarContasPorPapel,
  listarDesempenhoDosMeusQuizzes,
  listarMinhasTentativas,
} from "../../services/graficoService";

const MENSAGEM_INDISPONIVEL = "Este gráfico ainda não está disponível.";
const NOTA_MAXIMA = 100;

function useSerieDoServidor(buscar) {
  const [serie, setSerie] = useState({ dados: [], carregando: true, erro: null });

  useEffect(() => {
    let vivo = true;

    buscar()
      .then((dados) => {
        if (!Array.isArray(dados)) throw new Error("Resposta inesperada do servidor.");
        if (vivo) setSerie({ dados, carregando: false, erro: null });
      })
      .catch(() => {
        if (vivo) setSerie({ dados: [], carregando: false, erro: MENSAGEM_INDISPONIVEL });
      });

    return () => {
      vivo = false;
    };
  }, [buscar]);

  return serie;
}

function GraficosDoAluno({ quizzes, carregando, erro }) {
  const tentativas = useSerieDoServidor(listarMinhasTentativas);
  const dadosDasTentativas = notasNoTempo(tentativas.dados);
  const dadosDasCategorias = notaMediaPorCategoria(quizzes);

  return (
    <>
      <CartaoGrafico
        titulo="Minhas notas ao longo do tempo"
        descricao="A nota de cada tentativa, da mais antiga para a mais recente."
        simulado={GRAFICOS_SIMULADOS}
        carregando={tentativas.carregando}
        erro={tentativas.erro}
        dados={dadosDasTentativas}
        mensagemVazio="Você ainda não respondeu a nenhum quiz."
        colunas={["Data", "Nota", "Quiz"]}
        sufixo="%"
      >
        <GraficoLinha dados={dadosDasTentativas} sufixo="%" maximo={NOTA_MAXIMA} />
      </CartaoGrafico>

      <CartaoGrafico
        titulo="Minha nota média por categoria"
        descricao="A média das suas melhores notas em cada categoria, da menor para a maior."
        carregando={carregando}
        erro={erro}
        dados={dadosDasCategorias}
        mensagemVazio="Você ainda não respondeu a nenhum quiz."
        colunas={["Categoria", "Nota média", "Quizzes feitos"]}
        sufixo="%"
      >
        <GraficoBarras dados={dadosDasCategorias} sufixo="%" maximo={NOTA_MAXIMA} />
      </CartaoGrafico>
    </>
  );
}

function GraficosDoProfessor({ artigos, quizzes, carregando, erro }) {
  const desempenho = useSerieDoServidor(listarDesempenhoDosMeusQuizzes);
  const dadosDasSituacoes = meusItensPorSituacao(artigos, quizzes);
  const dadosDoDesempenho = desempenhoDosQuizzes(desempenho.dados);

  return (
    <>
      <CartaoGrafico
        titulo="Meus artigos e quizzes por situação"
        descricao="Tudo o que você enviou, pela situação de cada item."
        carregando={carregando}
        erro={erro}
        dados={dadosDasSituacoes}
        mensagemVazio="Você ainda não enviou artigos nem quizzes."
        colunas={["Situação", "Itens"]}
      >
        <GraficoBarras dados={dadosDasSituacoes} />
      </CartaoGrafico>

      <CartaoGrafico
        titulo="Desempenho dos alunos nos meus quizzes"
        descricao="A nota média de quem respondeu cada quiz seu, do mais difícil para o mais fácil."
        simulado={GRAFICOS_SIMULADOS}
        carregando={desempenho.carregando}
        erro={desempenho.erro}
        dados={dadosDoDesempenho}
        mensagemVazio="Seus quizzes ainda não foram respondidos."
        colunas={["Quiz", "Nota média", "Tentativas"]}
        sufixo="%"
      >
        <GraficoBarras dados={dadosDoDesempenho} sufixo="%" maximo={NOTA_MAXIMA} detalheNoRotulo />
      </CartaoGrafico>
    </>
  );
}

function GraficosDoAdministrador({ exercicios, grupos, carregando, erro }) {
  const atividade = useSerieDoServidor(listarAtividadePorDia);
  const contas = useSerieDoServidor(listarContasPorPapel);
  const dadosDaAtividade = atividadeNoTempo(atividade.dados);
  const dadosDasContas = contasPorPerfil(contas.dados);
  const dadosDosGrupos = exerciciosPorGrupo(exercicios, grupos);

  return (
    <>
      <CartaoGrafico
        titulo="Atividade por dia"
        descricao="Ações registradas na trilha de auditoria nos últimos 7 dias, sem contar as leituras."
        simulado={GRAFICOS_SIMULADOS}
        carregando={atividade.carregando}
        erro={atividade.erro}
        dados={dadosDaAtividade}
        mensagemVazio="Ainda não há atividade para mostrar."
        colunas={["Dia", "Ações"]}
        largo
      >
        <GraficoLinha dados={dadosDaAtividade} />
      </CartaoGrafico>

      <CartaoGrafico
        titulo="Contas por perfil"
        descricao="Quantas contas a plataforma tem em cada perfil."
        simulado={GRAFICOS_SIMULADOS}
        carregando={contas.carregando}
        erro={contas.erro}
        dados={dadosDasContas}
        mensagemVazio="Ainda não há contas para mostrar."
        colunas={["Perfil", "Contas"]}
      >
        <GraficoBarras dados={dadosDasContas} />
      </CartaoGrafico>

      <CartaoGrafico
        titulo="Exercícios por grupo muscular"
        descricao="Quantos exercícios a biblioteca tem em cada grupo."
        carregando={carregando}
        erro={erro}
        dados={dadosDosGrupos}
        mensagemVazio="A biblioteca ainda não tem exercícios."
        colunas={["Grupo", "Exercícios"]}
      >
        <GraficoBarras dados={dadosDosGrupos} />
      </CartaoGrafico>
    </>
  );
}

function SecaoGraficos({ papel, dados, carregando, erro, estiloTitulo }) {
  const estado = { carregando, erro };

  return (
    <section className="mb-12">
      <h2 className={estiloTitulo}>Dashboard</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {papel === "ADMINISTRADOR" && (
          <GraficosDoAdministrador
            exercicios={dados?.exercicios ?? []}
            grupos={dados?.grupos ?? []}
            {...estado}
          />
        )}
        {papel === "PROFESSOR" && (
          <GraficosDoProfessor
            artigos={dados?.artigos ?? []}
            quizzes={dados?.quizzes ?? []}
            {...estado}
          />
        )}
        {papel === "ALUNO" && <GraficosDoAluno quizzes={dados?.quizzes ?? []} {...estado} />}
      </div>
    </section>
  );
}

export default SecaoGraficos;
