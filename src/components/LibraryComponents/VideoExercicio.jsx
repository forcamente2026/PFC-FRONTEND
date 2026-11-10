import { useState } from "react";
import { Play } from "lucide-react";

const ENDERECO_DO_PLAYER = "https://www.youtube-nocookie.com/embed/";
const ESTILO_TITULO = "font-montserrat text-lg text-red-200";

function VideoExercicio({ videoYoutubeId, nome }) {
  const [tocando, setTocando] = useState(false);

  if (!videoYoutubeId?.trim()) return null;

  const id = videoYoutubeId.trim();

  if (!tocando) {
    return (
      <section>
        <h3 className={ESTILO_TITULO}>Vídeo</h3>
        <button
          type="button"
          onClick={() => setTocando(true)}
          className="mt-1 flex h-56 w-full items-center justify-center gap-3 rounded-md border border-gray-700 bg-white/5 text-red-200 hover:bg-red-500 hover:text-white md:h-72"
        >
          <Play size={32} />
          <span className="font-semibold">Assistir à demonstração</span>
        </button>
        <p className="mt-1 text-sm text-gray-400">
          O vídeo só é carregado do YouTube quando você clica. A partir daí, o
          YouTube recebe dados do seu acesso.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h3 className={ESTILO_TITULO}>Vídeo</h3>
      <div className="mt-1 aspect-video w-full">
        <iframe
          src={`${ENDERECO_DO_PLAYER}${id}?autoplay=0&rel=0`}
          title={`Demonstração de ${nome}`}
          allow="clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full rounded-md"
        ></iframe>
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${id}`}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-block text-sm text-red-200 underline"
      >
        Abrir no YouTube, caso o vídeo não apareça aqui
      </a>
    </section>
  );
}

export default VideoExercicio;
