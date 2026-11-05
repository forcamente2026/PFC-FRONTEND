import { STATUS_ARTIGO } from "../ArticlesComponents/artigoCampos";
import { estaPublicado } from "../../utils/moderacao";
import { rotuloDoPapel } from "../../utils/papeis";

function doMaiorParaOMenor(dados) {
  return [...dados].sort((a, b) => b.valor - a.valor);
}

function doMenorParaOMaior(dados) {
  return [...dados].sort((a, b) => a.valor - b.valor);
}

function contarPor(itens, rotuloDe) {
  const contagem = new Map();

  for (const item of itens) {
    const rotulo = rotuloDe(item);
    contagem.set(rotulo, (contagem.get(rotulo) ?? 0) + 1);
  }

  return doMaiorParaOMenor(
    [...contagem].map(([rotulo, valor]) => ({ rotulo, valor })),
  );
}

function diaEMes(valor) {
  const [, mes, dia] = valor.slice(0, 10).split("-");
  return `${dia}/${mes}`;
}

export function notaMediaPorCategoria(quizzes) {
  const porCategoria = new Map();

  for (const quiz of quizzes) {
    if (!quiz.melhorTentativa) continue;

    const categoria = quiz.categoria?.descricao ?? "Sem categoria";
    const notas = porCategoria.get(categoria) ?? [];
    porCategoria.set(categoria, [...notas, quiz.melhorTentativa.percentual]);
  }

  return doMenorParaOMaior(
    [...porCategoria].map(([rotulo, notas]) => ({
      rotulo,
      valor: Math.round(notas.reduce((soma, nota) => soma + nota, 0) / notas.length),
      detalhe: notas.length === 1 ? "1 quiz feito" : `${notas.length} quizzes feitos`,
    })),
  );
}

export function notasNoTempo(tentativas) {
  return [...tentativas]
    .sort((a, b) => a.feitaEm.localeCompare(b.feitaEm))
    .map((tentativa) => ({
      rotulo: diaEMes(tentativa.feitaEm),
      valor: tentativa.percentual,
      detalhe: tentativa.quiz,
    }));
}

export function meusItensPorSituacao(artigos, quizzes) {
  return contarPor(
    [...artigos, ...quizzes].filter((item) => item.podeEditar),
    (item) => STATUS_ARTIGO[item.status]?.descricao ?? item.status,
  );
}

export function desempenhoDosQuizzes(quizzes) {
  return doMenorParaOMaior(
    quizzes.map(({ quiz, tentativas, notaMedia }) => ({
      rotulo: quiz,
      valor: notaMedia,
      detalhe: tentativas === 1 ? "1 tentativa" : `${tentativas} tentativas`,
    })),
  );
}

export function atividadeNoTempo(dias) {
  return dias.map(({ dia, total }) => ({
    rotulo: diaEMes(dia),
    valor: total,
  }));
}

export function contasPorPerfil(contas) {
  return doMaiorParaOMenor(
    contas.map(({ papel, total }) => ({
      rotulo: rotuloDoPapel(papel),
      valor: total,
    })),
  );
}

export function exerciciosPorGrupo(exercicios, grupos) {
  const nomes = Object.fromEntries(
    grupos.map((grupo) => [grupo.codigo, grupo.descricao]),
  );

  return contarPor(
    exercicios.filter(estaPublicado),
    (exercicio) => nomes[exercicio.grupoMuscular] ?? exercicio.grupoMuscular,
  );
}
