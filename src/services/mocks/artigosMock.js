//Mock feito para teste da página artigos logo após será desfeito com a integração do backend.

export const categoriasMock = [
  { codigo: "FISIOLOGIA", descricao: "Fisiologia" },
  { codigo: "BIOMECANICA", descricao: "Biomecânica" },
  { codigo: "PERIODIZACAO", descricao: "Periodização" },
  { codigo: "NUTRICAO", descricao: "Nutrição" },
];

const AUTOR_MOCK = { id: "a1b2c3d4-0000-0000-0000-000000000001", nomeCompleto: "Prof. Carlos Andrade" };

export const artigosMock = [
  {
    id: "tensao-mecanica",
    titulo: "Tensão mecânica como principal motor da hipertrofia",
    categoria: { codigo: "FISIOLOGIA", descricao: "Fisiologia" },
    resumo:
      "Revisão dos mecanismos de sinalização mTOR e do papel relativo do estresse metabólico no ganho de massa.",
    conteudo:
      "A tensão mecânica é hoje considerada o estímulo primário para a hipertrofia muscular. Quando a fibra é submetida a carga sob alongamento e contração, mecanorreceptores na membrana ativam a via mTOR, que coordena a síntese proteica.\n\nO estresse metabólico, associado ao acúmulo de metabólitos em séries longas, contribui de forma secundária. Estudos que igualam o volume total mostram ganhos semelhantes entre cargas altas e moderadas, desde que as séries cheguem perto da falha.\n\nNa prática, isso significa que a proximidade da falha importa mais do que o número exato de repetições. Séries de 6 a 20 repetições produzem hipertrofia comparável quando o esforço é equivalente.",
    tipoEstudo: "Rev. sistemática",
    ano: 2024,
    minutosLeitura: 12,
    autor: AUTOR_MOCK,
    status: "APROVADO",
    criadoEm: "2026-09-01T10:00:00",
  },
  {
    id: "amplitude-movimento",
    titulo: "Amplitude de movimento e adaptação regional do músculo",
    categoria: { codigo: "BIOMECANICA", descricao: "Biomecânica" },
    resumo:
      "Comparação entre amplitudes parciais e completas e o efeito sobre o crescimento em diferentes regiões do músculo.",
    conteudo:
      "A amplitude de movimento altera o comprimento em que o músculo é mais exigido. Treinar em posições alongadas tende a produzir mais hipertrofia, especialmente na porção distal.\n\nAmplitudes parciais na posição encurtada não são inúteis, mas mostram ganhos menores quando comparadas em estudos com volume igualado.\n\nA recomendação prática é priorizar a amplitude completa e, quando houver limitação, preferir a metade alongada do movimento.",
    tipoEstudo: "Ensaio clínico",
    ano: 2023,
    minutosLeitura: 9,
    autor: AUTOR_MOCK,
    status: "APROVADO",
    criadoEm: "2026-09-03T10:00:00",
  },
  {
    id: "volume-semanal",
    titulo: "Volume semanal: existe um teto de séries produtivas?",
    categoria: { codigo: "PERIODIZACAO", descricao: "Periodização" },
    resumo:
      "Análise da relação dose-resposta entre número de séries semanais por grupo muscular e ganho de massa.",
    conteudo:
      "A relação entre volume e hipertrofia é positiva, mas com retornos decrescentes. Entre 10 e 20 séries semanais por grupo muscular concentra-se a maior parte dos ganhos observados.\n\nAcima disso, a resposta continua positiva em alguns estudos, mas com custo de recuperação alto e risco de o desempenho cair ao longo do ciclo.\n\nO teto é individual. Iniciantes respondem bem a volumes baixos; avançados precisam de mais, distribuídos em mais sessões.",
    tipoEstudo: "Meta-análise",
    ano: 2024,
    minutosLeitura: 15,
    autor: AUTOR_MOCK,
    status: "APROVADO",
    criadoEm: "2026-09-05T10:00:00",
  },
  {
    id: "distribuicao-proteica",
    titulo: "Distribuição proteica e síntese muscular ao longo do dia",
    categoria: { codigo: "NUTRICAO", descricao: "Nutrição" },
    resumo:
      "Efeito de dividir a proteína diária em refeições regulares sobre a taxa de síntese proteica muscular.",
    conteudo:
      "A síntese proteica muscular responde a doses de cerca de 0,4 g/kg por refeição, com um platô a partir desse ponto.\n\nDistribuir a proteína diária em 3 a 5 refeições mostra síntese acumulada maior do que concentrar em uma ou duas, com o mesmo total.\n\nO total diário continua sendo o fator mais importante; a distribuição é um refinamento para quem já atinge a meta.",
    tipoEstudo: "Rev. narrativa",
    ano: 2022,
    minutosLeitura: 8,
    autor: AUTOR_MOCK,
    status: "PENDENTE",
    criadoEm: "2026-09-18T10:00:00",
  },
];

// Sempre devolve uma cópia, como um GET real: quem chama não pode enxergar o array interno.
export function filtrarPorPapel(lista, papel) {
  if (papel === "ALUNO") return lista.filter((artigo) => artigo.status === "APROVADO");
  return [...lista];
}

// Imita o POST /api/artigos: autor vem do usuário logado, status nasce PENDENTE.
export function criarArtigoMock(dados, usuario) {
  const categoria = categoriasMock.find((item) => item.codigo === dados.categoria);
  const novo = {
    id: `artigo-${Date.now()}`,
    titulo: dados.titulo,
    categoria,
    resumo: dados.resumo,
    conteudo: dados.conteudo,
    tipoEstudo: dados.tipoEstudo,
    ano: Number(dados.ano),
    minutosLeitura: Number(dados.minutosLeitura),
    autor: { id: "mock-autor", nomeCompleto: usuario?.nomeCompleto ?? "Professor" },
    status: "PENDENTE",
    criadoEm: new Date().toISOString(),
  };
  artigosMock.push(novo);
  return novo;
}

// Imita o PATCH /api/artigos/{id}/status (só administrador). Devolve cópia do artigo atualizado.
export function alterarStatusMock(id, status) {
  const artigo = artigosMock.find((item) => item.id === id);
  if (!artigo) return null;
  artigo.status = status;
  return { ...artigo };
}