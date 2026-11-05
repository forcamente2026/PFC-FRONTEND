import { Menu, Pencil, Trash2 } from "lucide-react";
import ImagemExercicio from "./ImagemExercicio";
import { etiquetaDoArtigo } from "../ArticlesComponents/artigoCampos";

const ESTILO_ITEM_MENU =
  "flex w-full items-center gap-2 px-3 py-2 text-sm text-red-200 hover:bg-red-500 hover:text-white cursor-pointer";

function CardExercicio({
  exercicio,
  rotuloGrupo,
  rotuloNivel,
  menuAberto,
  aoAlternarMenu,
  aoEditar,
  aoExcluir,
  aoVerTecnica,
  podeEditar,
}) {
  const { nome, gifUrl, equipamento } = exercicio;
  const etiquetaDaSituacao = etiquetaDoArtigo(exercicio);

  return (
    <div
      className="box-border flex flex-col relative w-full md:w-[calc((100%_-_1.5rem)/2)] lp:w-[calc((100%_-_3rem)/3)] lg:w-[calc((100%_-_4.5rem)/4)] h-[26rem] rounded-xl
      p-4 snap-start border border-gray-700 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/20 gap-2 flex-none flex-nowrap overflow-hidden"
    >
      {podeEditar && (
      <div
        className="absolute top-3 left-3 z-20"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuAberto}
          aria-label={`Ações de ${nome}`}
          onClick={aoAlternarMenu}
          className="rounded-md p-1 text-red-200 hover:bg-red-500 hover:text-white cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {menuAberto && (
          <div
            role="menu"
            className="absolute left-0 top-9 w-36 overflow-hidden rounded-md border border-gray-700 bg-gray-900 shadow-lg shadow-black/40"
          >
            <button
              type="button"
              role="menuitem"
              onClick={aoEditar}
              className={ESTILO_ITEM_MENU}
            >
              <Pencil size={16} />
              Alterar
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={aoExcluir}
              className={ESTILO_ITEM_MENU}
            >
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        )}
      </div>
    )}
      <div className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white self-end">
        <span>{rotuloGrupo}</span>
      </div>

      <div className="relative">
        <ImagemExercicio src={gifUrl} alt={nome} />
        {etiquetaDaSituacao && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
            {etiquetaDaSituacao}
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
        <span className="font-montserrat text-red-200 wrap-break-word">
          {nome}
        </span>
        <span className="font-semibold text-white">{equipamento}</span>
        <span className="font-semibold text-1xl text-red-200">Dificuldade</span>
        <span className="font-semibold text-white">{rotuloNivel}</span>
      </div>

      <div className="mt-auto shrink-0 text-center">
        <button
          type="button"
          aria-label={`Ver técnica de ${nome}`}
          onClick={aoVerTecnica}
          className="bg-red-500 py-1 px-4 font-medium text-white max-w-2/3 hover:bg-red-900 cursor-pointer"
        >
          VER TÉCNICA
        </button>
      </div>
    </div>
  );
}

export default CardExercicio;
