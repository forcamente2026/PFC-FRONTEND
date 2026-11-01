import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LIMITE_SENHA, LIMITE_SENHA_CADASTRADA } from "../utils/limites";

function CampoSenha({ id, name, valor, aoAlterar, autoComplete, className, ...outras }) {
  const [visivel, setVisivel] = useState(false);
  const senhaNova = autoComplete === "new-password";

  return (
    <>
      <div className="relative">
        <input
          {...outras}
          type={visivel ? "text" : "password"}
          id={id}
          name={name}
          value={valor}
          onChange={aoAlterar}
          autoComplete={autoComplete}
          maxLength={senhaNova ? LIMITE_SENHA : LIMITE_SENHA_CADASTRADA}
          className={`${className} w-full pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisivel((atual) => !atual)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-red-200 cursor-pointer"
        >
          {visivel ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {senhaNova && valor.length >= LIMITE_SENHA && (
        <p role="status" className="mt-1 text-sm text-gray-400">
          A senha pode ter até {LIMITE_SENHA} caracteres.
        </p>
      )}
    </>
  );
}

export default CampoSenha;
