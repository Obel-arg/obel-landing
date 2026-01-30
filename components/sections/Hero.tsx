const DESCRIPTION_COLUMNS = [
  "We're a boutique studio of ambitious creatives working at the edge of performant and immersive digital experiences, giving 110% to bring projects from a realm of ideas to reality through branding, visual design & development of the highest quality.",
  "We don't settle, we are intentional about building with surgical precision and creating extraordinary experiences. We go the extra mile, and then walk a couple more, just for fun.",
];

export function Hero() {
  return (
    <section data-header-dark className="relative min-h-screen bg-primary text-background">
      <div className="relative z-10 h-screen flex flex-col justify-between pt-32 pb-8 px-4">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-baseline w-full">
            <h1 className="font-serif text-[17vw] leading-none tracking-tighter">WE</h1>
            <h1 className="font-serif text-[17vw] leading-none tracking-tighter">CREATE</h1>
          </div>
          <h1 className="font-pixel text-[10vw] text-center leading-none my-4">
            COOL SHIT
          </h1>
          <div className="flex justify-between items-baseline w-full">
            <h1 className="font-serif text-[17vw] leading-none tracking-tighter">THAT</h1>
            <h1 className="font-serif text-[17vw] leading-none tracking-tighter">PERFORMS</h1>
          </div>
        </div>

        {/* Subtitles */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-start mt-8">
          <p className="font-sans text-xs md:text-sm opacity-70 leading-relaxed">
            {DESCRIPTION_COLUMNS[0]}
          </p>
          <span className="text-lg md:text-xl opacity-70">→</span>
          <p className="font-sans text-xs md:text-sm opacity-70 leading-relaxed">
            {DESCRIPTION_COLUMNS[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
