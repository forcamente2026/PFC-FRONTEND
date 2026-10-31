const TAMANHO_MINIMO_SENHA = 8;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAMPOS_ENDERECO = ["cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado"];

let emailPendente = null;

function falhar(status, mensagem, campos = []) {
  throw { status, mensagem, campos };
}

function vazio(valor) {
  return !valor || !String(valor).trim();
}

function exigir(campos, valor, campo, mensagem) {
  if (vazio(valor)) campos.push({ campo, mensagem });
}

function senhaAtendePolitica(senha) {
  return (
    /\p{Ll}/u.test(senha) &&
    /\p{Lu}/u.test(senha) &&
    /\p{N}/u.test(senha) &&
    /[^\p{L}\p{N}\s]/u.test(senha)
  );
}

export function atualizarMinhaContaMock(dados, contaAtual) {
  const professor = contaAtual.papel === "PROFESSOR";
  const trouxeEndereco = CAMPOS_ENDERECO.some((campo) => !vazio(dados[campo]));

  if (!professor && trouxeEndereco) {
    falhar(400, "Somente a conta de professor tem endereco profissional");
  }

  const campos = [];
  exigir(campos, dados.nomeCompleto, "nomeCompleto", "O nome completo e obrigatorio");

  if (professor) {
    exigir(campos, dados.logradouro, "logradouro", "O logradouro e obrigatorio");
    exigir(campos, dados.numero, "numero", "O numero e obrigatorio");
    exigir(campos, dados.bairro, "bairro", "O bairro e obrigatorio");
    exigir(campos, dados.cidade, "cidade", "A cidade e obrigatoria");
    exigir(campos, dados.estado, "estado", "O estado e obrigatorio");
    if (!/^\d{8}$/.test(dados.cep ?? "")) {
      campos.push({ campo: "cep", mensagem: "O CEP deve conter 8 dígitos, apenas números" });
    }
  }

  if (campos.length > 0) falhar(400, "Dados invalidos", campos);

  const atualizada = { ...contaAtual, nomeCompleto: dados.nomeCompleto.trim() };
  if (professor) {
    CAMPOS_ENDERECO.forEach((campo) => {
      atualizada[campo] = dados[campo]?.trim() || null;
    });
  }
  return atualizada;
}

export function alterarMinhaSenhaMock(senhaAtual, novaSenha) {
  const campos = [];
  exigir(campos, senhaAtual, "senhaAtual", "A senha atual e obrigatoria");
  exigir(campos, novaSenha, "novaSenha", "A nova senha e obrigatoria");

  if (!vazio(novaSenha)) {
    if (novaSenha.length < TAMANHO_MINIMO_SENHA) {
      campos.push({ campo: "novaSenha", mensagem: "A senha deve ter no minimo 8 caracteres" });
    }
    if (!senhaAtendePolitica(novaSenha)) {
      campos.push({
        campo: "novaSenha",
        mensagem: "A senha deve ter letra minuscula, maiuscula, numero e caractere especial",
      });
    }
  }

  if (campos.length > 0) falhar(400, "Dados invalidos", campos);
}

export function solicitarTrocaDeEmailMock(novoEmail, senhaAtual, contaAtual) {
  const campos = [];
  exigir(campos, novoEmail, "novoEmail", "O e-mail e obrigatorio");
  if (!vazio(novoEmail) && !FORMATO_EMAIL.test(novoEmail.trim())) {
    campos.push({ campo: "novoEmail", mensagem: "E-mail em formato invalido" });
  }
  exigir(campos, senhaAtual, "senhaAtual", "A senha atual e obrigatoria");

  if (campos.length > 0) falhar(400, "Dados invalidos", campos);

  const email = novoEmail.trim().toLowerCase();
  if (email === contaAtual.email?.toLowerCase()) {
    falhar(400, "O novo e-mail e igual ao atual");
  }

  emailPendente = email;
}

export function confirmarTrocaDeEmailMock(codigo, contaAtual) {
  const campos = [];
  exigir(campos, codigo, "codigo", "O codigo e obrigatorio");
  if (!vazio(codigo) && !/^\d{4}$/.test(codigo)) {
    campos.push({ campo: "codigo", mensagem: "O codigo deve ter 4 digitos" });
  }

  if (campos.length > 0) falhar(400, "Dados invalidos", campos);
  if (!emailPendente) falhar(400, "Nenhuma troca de e-mail pendente");

  const atualizada = { ...contaAtual, email: emailPendente };
  emailPendente = null;
  return atualizada;
}