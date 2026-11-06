import { useState } from "react";
import { ImageOff } from "lucide-react";

function ImagemExercicio({ src, alt, altura = "h-40" }) {
  const [quebrada, setQuebrada] = useState(false);

  if (!src || quebrada) {
    return (
      <div className={`${altura} flex w-full items-center justify-center text-gray-500`}>
        <ImageOff size={32} />
      </div>
    );
  }

  return (
    <div className={`${altura} w-full`}>
      <img
        src={src}
        alt={alt}
        onError={() => setQuebrada(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default ImagemExercicio;
