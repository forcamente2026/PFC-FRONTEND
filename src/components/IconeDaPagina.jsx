function IconeDaPagina({ icone: Icone }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full bg-red-500/15 text-red-400 md:h-14 md:w-14">
      <Icone size={28} aria-hidden="true" />
    </span>
  );
}

export default IconeDaPagina;
