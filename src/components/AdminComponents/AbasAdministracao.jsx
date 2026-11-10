import { NavLink } from "react-router-dom";

const GUIAS = [
  { para: "/admin/usuarios", rotulo: "Usuários" },
  { para: "/admin/pendentes", rotulo: "Itens pendentes" },
  { para: "/admin/auditoria", rotulo: "Auditoria" },
];

const ESTILO_GUIA =
  "rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em]";

function AbasAdministracao() {
  return (
    <nav
      aria-label="Guias da administração"
      className="mb-8 flex flex-wrap gap-2 border-b border-gray-700 pb-3"
    >
      {GUIAS.map((guia) => (
        <NavLink
          key={guia.para}
          to={guia.para}
          className={({ isActive }) =>
            `${ESTILO_GUIA} ${
              isActive
                ? "bg-red-500 text-white"
                : "text-gray-300 hover:bg-white/10 hover:text-red-200"
            }`
          }
        >
          {guia.rotulo}
        </NavLink>
      ))}
    </nav>
  );
}

export default AbasAdministracao;