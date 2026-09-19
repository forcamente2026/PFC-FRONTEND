export const PAPEIS_EDITORES = ["PROFESSOR", "ADMINISTRADOR"];
export const PAPEIS_VALIDADORES = ["ADMINISTRADOR"];

export function podeEditar(usuario) {
  return PAPEIS_EDITORES.includes(usuario?.papel);
}

export function podeValidar(usuario) {
  return PAPEIS_VALIDADORES.includes(usuario?.papel);
}
