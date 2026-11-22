export const EXPLICACAO_VOLUME =
  "Volume-carga é o peso total deslocado na sessão: séries multiplicadas por repetições e pela carga de cada exercício. Ele não mede a qualidade da execução nem os resultados do treino. A divisão por grupo muscular revela se o treino está equilibrado ou concentrado demais em uma região.";
export const EXPLICACAO_TMB =
  "A taxa metabólica basal estima a energia que seu corpo gasta em repouso para manter funções como respiração, circulação e temperatura. A fórmula foi criada a partir de 498 adultos saudáveis (Mifflin et al., 1990) e, num estudo brasileiro com 40 homens jovens, foi a equação com a menor diferença média em relação ao gasto medido em laboratório (Krüger et al., 2015). O gasto energético total é essa base multiplicada pelo fator do seu nível de atividade e estima quanto você gasta em um dia comum. Os dois números são estimativas e não substituem a avaliação de um nutricionista.";
export const EXPLICACAO_HIDRATACAO =
  "A referência parte de 35 ml de água por quilo de peso corporal e soma 500 ml por hora de treino; a perda real depende do suor e das condições do treino (Quaresma et al., 2025). A água regula a temperatura corporal, transporta nutrientes e sustenta a contração muscular. A meta é uma estimativa para orientar o seu dia, não uma necessidade individual medida.";
export const COMO_CALCULAMOS_VOLUME = {
  formulas: [
    "V = S × R × C",
    "Volume total = soma dos V de todos os exercícios",
    "Volume do grupo = soma dos V dos exercícios do grupo",
    "IM = volume total ÷ total de repetições",
  ],
  variaveis: [
    { simbolo: "V", descricao: "volume de um exercício, em kg (McBride et al., 2009; Uchida et al., 2006)" },
    { simbolo: "S", descricao: "número de séries" },
    { simbolo: "R", descricao: "repetições por série" },
    { simbolo: "C", descricao: "carga, em kg; use 0 para exercícios com o peso do corpo" },
    { simbolo: "Total de repetições", descricao: "soma de S × R de todos os exercícios" },
    { simbolo: "Grupo muscular", descricao: "vem do cadastro de cada exercício" },
    { simbolo: "IM", descricao: "intensidade média, em kg por repetição" },
  ],
  arredondamento: "Os volumes saem com duas casas decimais; a intensidade média sai inteira.",
};

export const COMO_CALCULAMOS_TMB = {
  formulas: [
    "TMB = 10 × P + 6,25 × A − 5 × I + 5 (sexo masculino)",
    "TMB = 10 × P + 6,25 × A − 5 × I − 161 (sexo feminino)",
    "GET = TMB × F",
  ],
  variaveis: [
    { simbolo: "P", descricao: "peso, em kg" },
    { simbolo: "A", descricao: "altura, em cm" },
    { simbolo: "I", descricao: "idade, em anos" },
    { simbolo: "+ 5 / − 161", descricao: "constante da fórmula Mifflin-St Jeor para cada sexo biológico (Mifflin et al., 1990)" },
    { simbolo: "F", descricao: "fator de atividade, escala de uso corrente sem estudo de validação próprio: 1,2 sedentário; 1,375 leve (1 a 2 vezes por semana); 1,55 moderado (3 a 5 vezes); 1,725 intenso (6 a 7 vezes); 1,9 muito intenso (2 treinos por dia)" },
    { simbolo: "TMB", descricao: "taxa metabólica basal, em kcal por dia" },
    { simbolo: "GET", descricao: "gasto energético total, em kcal por dia" },
  ],
  arredondamento: "A TMB é mostrada inteira. O GET usa a TMB sem arredondar e também sai inteiro, por isso pode diferir em 1 kcal da conta feita com a TMB mostrada.",
};

export const COMO_CALCULAMOS_HIDRATACAO = {
  formulas: [
    "Base = 35 × P",
    "Adicional = (M ÷ 60) × 500",
    "Meta = base + adicional",
  ],
  variaveis: [
    { simbolo: "P", descricao: "peso, em kg" },
    { simbolo: "M", descricao: "minutos de treino no dia; 0 em dia de descanso" },
    { simbolo: "35", descricao: "ml por kg de peso corporal ao dia (Lima, Lima e Braggion, 2015; Nascimento e Costa, 2017)" },
    { simbolo: "500", descricao: "ml por hora de treino, simplificação da plataforma; a reposição real depende do suor (Quaresma et al., 2025)" },
  ],
  arredondamento: "A base e o adicional saem inteiros, em ml; a meta em litros sai com duas casas.",
};