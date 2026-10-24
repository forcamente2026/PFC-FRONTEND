const ESTILO_AVISO = "mt-4 rounded-xl border p-4 text-sm";

function AvisoCref({ situacao, motivo }) {
  if (situacao === "PENDENTE") {
    return (
      <div className={`${ESTILO_AVISO} border-yellow-500 bg-yellow-500/10 text-yellow-100`}>
        <p className="font-semibold text-yellow-200">Verificação do CREF pendente</p>
        <p className="mt-1">
          Até um administrador conferir o seu CREF, sua conta tem as permissões de
          aluno. Depois da aprovação, as permissões de professor valem a partir do
          próximo login.
        </p>
      </div>
    );
  }

  if (situacao === "REJEITADO") {
    return (
      <div className={`${ESTILO_AVISO} border-red-500 bg-red-500/10 text-red-100`}>
        <p className="font-semibold text-red-200">Verificação do CREF rejeitada</p>
        {motivo && <p className="mt-1">Motivo: {motivo}</p>}
        <p className="mt-1">
          Sua conta continua com as permissões de aluno. Para corrigir o CREF ou a
            formação, use o botão "Atualizar CREF" em Minha conta.
        </p>
      </div>
    );
  }

  return null;
}

export default AvisoCref;