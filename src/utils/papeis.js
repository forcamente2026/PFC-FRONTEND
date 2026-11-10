export const PAPEIS_EDITORES = ["PROFESSOR", "ADMINISTRADOR"];
export const PAPEIS_VALIDADORES = ["ADMINISTRADOR"];

export const PAPEIS = [
  { codigo: "ALUNO", rotulo: "Aluno" },
  { codigo: "PROFESSOR", rotulo: "Professor" },
  { codigo: "ADMINISTRADOR", rotulo: "Administrador" },
];

export function rotuloDoPapel(codigo) {
  return PAPEIS.find((papel) => papel.codigo === codigo)?.rotulo ?? codigo ?? "—";
}

export function podeEditar(usuario) {
  return PAPEIS_EDITORES.includes(usuario?.papel);
}

export function podeValidar(usuario) {
  return PAPEIS_VALIDADORES.includes(usuario?.papel);
}
