import { Menu, Pencil, Trash2 } from "lucide-react";
import ImagemExercicio from "./ImagemExercicio";
import { etiquetaDoArtigo } from "../ArticlesComponents/artigoCampos";

export const ESTILO_CAIXA_CARROSSEL =
  "w-full md:w-[calc((100%_-_1.5rem)/2)] lp:w-[calc((100%_-_3rem)/3)] lg:w-[calc((100%_-_4.5rem)/4)] h-[26rem] flex-none snap-start";

const ESTILO_ITEM_MENU =
  "flex w-full items-center gap-2 px-3 py-2 text-sm text-[#df1028] hover:bg-[#df1028] hover:text-white cursor-pointer";

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
  estiloCaixa = ESTILO_CAIXA_CARROSSEL,
  alturaImagem,
}) {
  const { nome, gifUrl, equipamento } = exercicio;
  const etiquetaDaSituacao = etiquetaDoArtigo(exercicio);

  return (
    <article
      className={`box-border flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-gray-700 bg-[#121725] shadow-lg shadow-black/20 ${estiloCaixa}`}
    >
      <header className="flex shrink-0 flex-col gap-2 border-b border-gray-700 bg-[#181d2c] px-4 py-3">
        <div className="flex h-6 items-center justify-between">
          <span aria-hidden="true" className="h-[3px] w-7 rounded-full bg-[#df1028]" />
          {podeEditar && (
            <div
              className="relative z-20"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuAberto}
                aria-label={`Ações de ${nome}`}
                onClick={aoAlternarMenu}
                className="rounded-md p-1 text-[#df1028] hover:bg-[#df1028] hover:text-white cursor-pointer"
              >
                <Menu size={20} aria-hidden="true" />
              </button>

              {menuAberto && (
                <div
                  role="menu"
                  className="absolute right-0 top-9 w-36 overflow-hidden rounded-md border border-gray-700 bg-gray-900 shadow-lg shadow-black/40"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={aoEditar}
                    className={ESTILO_ITEM_MENU}
                  >
                    <Pencil size={16} aria-hidden="true" />
                    Alterar
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={aoExcluir}
                    className={ESTILO_ITEM_MENU}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="rounded-full bg-red-500/10 px-2 py-1 font-semibold text-[#ff4b49]">
            {rotuloGrupo}
          </span>
          <span className="text-gray-300">{rotuloNivel}</span>
        </div>
        <h3 className="line-clamp-2 font-montserrat text-lg leading-tight text-white wrap-anywhere">
          {nome}
        </h3>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pt-2 pb-3">
        <div className="relative shrink-0">
          <ImagemExercicio src={gifUrl} alt={nome} altura={alturaImagem} />
          {etiquetaDaSituacao && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs font-medium text-gray-200">
              {etiquetaDaSituacao}
            </span>
          )}
        </div>
        {equipamento && (
          <p className="line-clamp-2 text-sm text-gray-300 wrap-anywhere">
            <strong className="block font-montserrat font-black text-white">Equipamento:</strong>
            {equipamento}
          </p>
        )}

        <button
          type="button"
          aria-label={`Ver técnica de ${nome}`}
          onClick={aoVerTecnica}
          className="mt-auto inline-flex min-h-11 max-w-full shrink-0 items-center justify-center self-center rounded-lg bg-[#df1028] px-5 py-1.5 text-center text-base font-bold text-white transition-colors hover:bg-white hover:text-[#df1028] cursor-pointer"
        >
          Ver técnica
        </button>
      </div>
    </article>
  );
}

export default CardExercicio;
