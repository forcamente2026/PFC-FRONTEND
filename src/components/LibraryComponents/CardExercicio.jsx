import { useState } from "react";
import { ImageOff, Menu, Pencil, Trash2 } from "lucide-react";

const ESTILO_ITEM_MENU =
  "flex w-full items-center gap-2 px-3 py-2 text-sm text-red-200 hover:bg-red-500 hover:text-white cursor-pointer";


const ESTILO_CAIXA_IMAGEM = "h-40 w-full";

function ImagemExercicio({ src, alt }) {
  const [quebrada, setQuebrada] = useState(false);

  if (!src || quebrada) {
    return (
      <div
        className={`${ESTILO_CAIXA_IMAGEM} flex items-center justify-center text-gray-500`}
      >
        <ImageOff size={32} />
      </div>
    );
  }

  return (
    <div className={ESTILO_CAIXA_IMAGEM}>
      <img
        src={src}
        alt={alt}
        onError={() => setQuebrada(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function CardExercicio({
  exercicio,
  rotuloGrupo,
  rotuloNivel,
  menuAberto,
  aoAlternarMenu,
  aoEditar,
  aoExcluir,
}) {
  const { nome, gifUrl, equipamento } = exercicio;

  return (
    <div
      className="box-border flex flex-col relative w-full md:w-[calc((100%_-_1.5rem)/2)] lp:w-[calc((100%_-_3rem)/3)] lg:w-[calc((100%_-_4.5rem)/4)] h-[26rem] rounded-xl
      p-4 snap-start border border-gray-700 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/20 gap-2 flex-none flex-nowrap overflow-hidden"
    >
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

      <div className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white self-end">
        <span>{rotuloGrupo}</span>
      </div>

      <ImagemExercicio src={gifUrl} alt={nome} />

      <div className="flex flex-col gap-1">
        <span className="font-montserrat text-red-200 wrap-break-word">
          {nome}
        </span>
        <span className="font-semibold text-white">{equipamento}</span>
        <span className="font-semibold text-1xl text-red-200">Dificuldade</span>
        <span className="font-semibold text-white">{rotuloNivel}</span>
      </div>

      <div className="mt-auto text-center">
        <button className="bg-red-500 py-1 px-4 font-medium text-white max-w-2/3 hover:bg-red-900 cursor-pointer">
          VER TÉCNICA
        </button>
      </div>
    </div>
  );
}

export default CardExercicio;
