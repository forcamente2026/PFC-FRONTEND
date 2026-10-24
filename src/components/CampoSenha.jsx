import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function CampoSenha({ id, name, valor, aoAlterar, autoComplete, className }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input
        type={visivel ? "text" : "password"}
        id={id}
        name={name}
        value={valor}
        onChange={aoAlterar}
        autoComplete={autoComplete}
        className={`${className} pr-11`}
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
  );
}

export default CampoSenha;