function diaHa(quantidadeDeDias) {
  const data = new Date();
  data.setDate(data.getDate() - quantidadeDeDias);
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

const TENTATIVAS = [
  { quiz: "Princípios da hipertrofia", acertos: 2, total: 5, diasAtras: 26 },
  { quiz: "Princípios da hipertrofia", acertos: 3, total: 5, diasAtras: 21 },
  { quiz: "Volume e frequência de treino", acertos: 3, total: 4, diasAtras: 15 },
  { quiz: "Princípios da hipertrofia", acertos: 4, total: 5, diasAtras: 11 },
  { quiz: "Nutrição para o treino", acertos: 3, total: 6, diasAtras: 6 },
  { quiz: "Nutrição para o treino", acertos: 5, total: 6, diasAtras: 2 },
];

const CONTAS = [
  { papel: "ALUNO", total: 42 },
  { papel: "PROFESSOR", total: 11 },
  { papel: "ADMINISTRADOR", total: 2 },
];

const ATIVIDADE = [18, 25, 21, 34, 29, 12, 27];

const DESEMPENHO = [
  { quiz: "Princípios da hipertrofia", tentativas: 24, notaMedia: 81 },
  { quiz: "Volume e frequência de treino", tentativas: 17, notaMedia: 64 },
  { quiz: "Periodização para quem está começando", tentativas: 9, notaMedia: 48 },
];

export function tentativasMock() {
  return TENTATIVAS.map(({ quiz, acertos, total, diasAtras }) => ({
    quiz,
    acertos,
    total,
    percentual: Math.round((acertos / total) * 100),
    feitaEm: `${diaHa(diasAtras)}T10:00:00`,
  }));
}

export function contasPorPapelMock() {
  return CONTAS;
}

export function desempenhoMock() {
  return DESEMPENHO;
}

export function atividadePorDiaMock() {
  return ATIVIDADE.map((total, indice) => ({
    dia: diaHa(ATIVIDADE.length - 1 - indice),
    total,
  }));
}
