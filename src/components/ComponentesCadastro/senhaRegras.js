export const REGRAS_SENHA = [
  {
    id: "tamanho",
    descricao: "Pelo menos 8 caracteres",
    testar: (senha) => senha.length >= 8,
  },
  {
    id: "minuscula",
    descricao: "Uma letra minúscula",
    testar: (senha) => /\p{Ll}/u.test(senha),
  },
  {
    id: "maiuscula",
    descricao: "Uma letra maiúscula",
    testar: (senha) => /\p{Lu}/u.test(senha),
  },
  {
    id: "numero",
    descricao: "Um número",
    testar: (senha) => /\p{N}/u.test(senha),
  },
  {
    id: "especial",
    descricao: "Um caractere especial",
    testar: (senha) => /[^\p{L}\p{N}\s]/u.test(senha),
  },
];

const NIVEIS = [
  {
    ate: 0,
    rotulo: "",
    barra: "bg-gray-600",
    texto: "text-gray-400",
    borda: "border-gray-600",
    brilho: "neon-suave-red-500",
  },
  {
    ate: 2,
    rotulo: "Fraca",
    barra: "bg-red-500",
    texto: "text-red-400",
    borda: "border-red-500",
    brilho: "neon-red-500",
  },
  {
    ate: 3,
    rotulo: "Média",
    barra: "bg-amber-400",
    texto: "text-amber-300",
    borda: "border-amber-400",
    brilho: "neon-amber-400",
  },
  {
    ate: 4,
    rotulo: "Boa",
    barra: "bg-lime-500",
    texto: "text-lime-400",
    borda: "border-lime-500",
    brilho: "neon-lime-500",
  },
  {
    ate: 5,
    rotulo: "Forte",
    barra: "bg-green-500",
    texto: "text-green-400",
    borda: "border-green-500",
    brilho: "neon-green-500",
  },
];

export function avaliarSenha(senha) {
  const regras = REGRAS_SENHA.map((regra) => ({
    id: regra.id,
    descricao: regra.descricao,
    atendida: regra.testar(senha),
  }));
  const pontos = regras.filter((regra) => regra.atendida).length;
  const nivel = NIVEIS.find((item) => pontos <= item.ate);

  return {
    regras,
    pontos,
    total: REGRAS_SENHA.length,
    valida: pontos === REGRAS_SENHA.length,
    ...nivel,
  };
}
