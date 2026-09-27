import { useState } from "react";
import FormLogin from "./FormLogin";
import FormCodigo from "./FormCodigo";
import FormEsqueciSenha from "./FormEsqueciSenha";
import FormRedefinirSenha from "./FormRedefinirSenha";

const PASSO_CREDENCIAIS = "credenciais";
const PASSO_CODIGO = "codigo";
const PASSO_ESQUECI = "esqueci";
const PASSO_REDEFINIR = "redefinir";

function Autenticacao({ aoFechar, aoEntrar }) {
  const [passo, setPasso] = useState(PASSO_CREDENCIAIS);
  const [email, setEmail] = useState("");
  const [expiraEmSegundos, setExpiraEmSegundos] = useState(0);
  const [aviso, setAviso] = useState(null);

  function irParaCodigo(emailInformado, segundos) {
    setEmail(emailInformado);
    setExpiraEmSegundos(segundos);
    setPasso(PASSO_CODIGO);
  }

  function voltarParaCredenciais() {
    setAviso(null);
    setPasso(PASSO_CREDENCIAIS);
  }

  function irParaEsqueci() {
    setAviso(null);
    setPasso(PASSO_ESQUECI);
  }

  function irParaRedefinir(emailInformado) {
    setEmail(emailInformado);
    setPasso(PASSO_REDEFINIR);
  }

  function senhaRedefinida() {
    setAviso("Senha alterada. Entre com a nova senha.");
    setPasso(PASSO_CREDENCIAIS);
  }

  function concluir(sessao) {
    aoEntrar(sessao);
    aoFechar();
  }

  if (passo === PASSO_CODIGO) {
    return (
      <FormCodigo
        email={email}
        expiraEmSegundos={expiraEmSegundos}
        aoEntrar={concluir}
        aoVoltar={voltarParaCredenciais}
      />
    );
  }

  if (passo === PASSO_ESQUECI) {
    return (
      <FormEsqueciSenha
        aoCodigoEnviado={irParaRedefinir}
        aoVoltar={voltarParaCredenciais}
      />
    );
  }

  if (passo === PASSO_REDEFINIR) {
    return (
      <FormRedefinirSenha
        email={email}
        aoConcluir={senhaRedefinida}
        aoVoltar={voltarParaCredenciais}
      />
    );
  }

  return (
    <>
      {aviso && (
        <p className="mb-2 text-center text-sm text-green-400">{aviso}</p>
      )}
      <FormLogin
        emailInicial={email}
        aoFechar={aoFechar}
        aoCodigoEnviado={irParaCodigo}
        aoEsqueciSenha={irParaEsqueci}
      />
    </>
  );
}

export default Autenticacao;