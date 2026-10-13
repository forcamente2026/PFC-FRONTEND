export const niveisAtividadeMock = [
  { codigo: "SEDENTARIO", descricao: "Sedentário, sem treino regular" },
  { codigo: "LEVE", descricao: "Leve - 1 a 3 vezes por semana" },
  { codigo: "MODERADO", descricao: "Moderado - 3 a 5 vezes por semana" },
  { codigo: "INTENSO", descricao: "Intenso - 6 a 7 vezes por semana" },
  { codigo: "MUITO_INTENSO", descricao: "Muito intenso - 2 treinos por dia" },
];

export const sexosMock = [
  { codigo: "MASCULINO", descricao: "Masculino" },
  { codigo: "FEMININO", descricao: "Feminino" },
];

const fatoresAtividade = {
  SEDENTARIO: 1.2,
  LEVE: 1.375,
  MODERADO: 1.55,
  INTENSO: 1.725,
  MUITO_INTENSO: 1.9,
};

export const exerciciosMock = [
  {
    id: "e44ea16d-cb14-412c-a683-c240e3ac77d4",
    nome: "Supino reto",
    grupoMuscular: "PEITO",
    descricaoGrupo: "Peito",
  },
  {
    id: "116bc3d9-00e2-4aac-a283-711b62c8d126",
    nome: "Remada curvada",
    grupoMuscular: "COSTAS",
    descricaoGrupo: "Costas",
  },
  {
    id: "9d2f1c40-5a77-4f0e-9b3c-2e8a6d1f4b55",
    nome: "Agachamento livre",
    grupoMuscular: "PERNAS",
    descricaoGrupo: "Pernas",
  },
  {
    id: "3b7c8e21-64d9-4a15-8f2b-7c0e9a3d5612",
    nome: "Desenvolvimento militar",
    grupoMuscular: "OMBROS",
    descricaoGrupo: "Ombros",
  },
  {
    id: "5f1a9d63-2c48-4e7b-a091-6d3f8b2c7e40",
    nome: "Rosca direta",
    grupoMuscular: "BRACOS",
    descricaoGrupo: "Braços",
  },
];

export function gastoEnergeticoMock({
  pesoKg,
  alturaCm,
  idade,
  sexoBiologico,
  nivelAtividade,
}) {
  const base = 10 * pesoKg + 6.25 * alturaCm - 5 * idade;
  const tmb = sexoBiologico === "FEMININO" ? base - 161 : base + 5;
  const fator = fatoresAtividade[nivelAtividade] ?? fatoresAtividade.SEDENTARIO;

  return {
    tmb: Math.round(tmb),
    gastoEnergeticoTotal: Math.round(tmb * fator),
    fatorAtividadeAplicado: fator,
    formulaUtilizada: "Mifflin-St Jeor"
  };
}

export function hidratacaoMock({ pesoKg, minutosTreinoPorDia }) {
  const baseCorporalMl = Math.round(35 * pesoKg);
  const adicionalTreinoMl = Math.round((minutosTreinoPorDia / 60) * 500);
  const mlPorDia = baseCorporalMl + adicionalTreinoMl;

  return {
    mlPorDia,
    litrosPorDia: Number((mlPorDia / 1000).toFixed(2)),
    baseCorporalMl,
    adicionalTreinoMl
  };
}

const CHAVE_CONSUMO = "forcamente:mock:consumo-agua";

function lerRegistrosMock(data) {
  try {
    const bruto = localStorage.getItem(CHAVE_CONSUMO);
    if (!bruto) return [];

    const banco = JSON.parse(bruto);
    return banco[data] ?? [];
  } catch {
    return [];
  }
}

function gravarRegistrosMock(data, registros) {
  try {
    const bruto = localStorage.getItem(CHAVE_CONSUMO);
    const banco = bruto ? JSON.parse(bruto) : {};
    banco[data] = registros;
    localStorage.setItem(CHAVE_CONSUMO, JSON.stringify(banco));
    return true;
  } catch {
    return false;
  }
}

export function consumoAguaMock({
  data,
  quantidadeMl,
  pesoKg,
  minutosTreinoPorDia,
}) {
  const registros = lerRegistrosMock(data);

  if (quantidadeMl) {
    registros.push({
      id: crypto.randomUUID(),
      quantidadeMl,
      registradoEm: new Date().toISOString(),
    });
    gravarRegistrosMock(data, registros);
  }

  const meta = hidratacaoMock({ pesoKg, minutosTreinoPorDia });
  const totalConsumidoMl = registros.reduce(
    (soma, registro) => soma + registro.quantidadeMl,
    0,
  );
  const restanteMl = Math.max(meta.mlPorDia - totalConsumidoMl, 0);
  const percentualDaMeta = Math.round((totalConsumidoMl / meta.mlPorDia) * 100);

  return {
    data,
    totalConsumidoMl,
    metaMl: meta.mlPorDia,
    restanteMl,
    percentualDaMeta,
    registros,
    mensagem: restanteMl
      ? `Atenção: hidratação baixa. Faltam ${restanteMl.toLocaleString("pt-BR")} ml — desidratação derruba seu desempenho.`
      : "Meta atingida. Distribuir a água ao longo do dia funciona melhor do que beber tudo de uma vez.",
  };
}

export function volumeTreinoMock({ series }) {
  const lista = series ?? [];
  const volumePorGrupo = new Map();
  let volumeTotalKg = 0;
  let totalSeries = 0;
  let totalRepeticoes = 0;

  lista.forEach((item) => {
    const volume = item.series * item.repeticoes * item.cargaKg;
    volumeTotalKg += volume;
    totalSeries += item.series;
    totalRepeticoes += item.series * item.repeticoes;

    const exercicio = exerciciosMock.find(
      (opcao) => opcao.id === item.exercicioId,
    );
    const grupoMuscular = exercicio?.grupoMuscular ?? "OUTROS";
    const descricao = exercicio?.descricaoGrupo ?? "Outros";

    const acumulado = volumePorGrupo.get(grupoMuscular) ?? {
      grupoMuscular,
      descricao,
      volumeKg: 0,
    };
    acumulado.volumeKg += volume;
    volumePorGrupo.set(grupoMuscular, acumulado);
  });

  return {
    volumeTotalKg,
    volumePorGrupoMuscular: Array.from(volumePorGrupo.values()),
    totalSeries,
    totalRepeticoes,
    intensidadeMediaKgPorRep: totalRepeticoes
      ? Math.round(volumeTotalKg / totalRepeticoes)
      : 0
  };
}
