const DESCRIPTIONS = [
  "We're an AI-first digital studio working at the edge of performant and immersive digital experiences, giving 110% to bring projects from idea to reality through branding, visual design & development.",
  "We don't settle, we are intentional about building with surgical precision and creating extraordinary experiences. We go the extra mile, and then walk a couple more, just for fun.",
  "Sometimes size doesn't matter. we work for big & small non-stoppable visionaries. here's love for them all.",
];

export function Hero() {
  return (
    <section data-header-dark className="relative min-h-screen bg-primary text-background">
      <div className="relative z-10 h-screen flex flex-col justify-between pt-24 md:pt-32 pb-6 md:pb-8 px-3 md:px-4">
        {/* Main headline */}
        <div className="flex-1 flex flex-col justify-center -mt-8 md:-mt-12">
          <h1 className="font-serif italic text-[15vw] md:text-[17vw] lg:text-[19vw] leading-[0.82] tracking-tight">
            TECHNOLOGY
          </h1>
          <h1 className="font-pixel text-[6.5vw] md:text-[5.5vw] lg:text-[5vw] leading-[1] my-1 md:my-2 whitespace-nowrap scale-x-[1.4] md:scale-x-[1.65] lg:scale-x-[1.85] origin-left">
            FROM INSIDE
          </h1>
          <h1 className="font-serif italic text-[15vw] md:text-[17vw] lg:text-[19vw] leading-[0.82] tracking-tight">
            THE CULTURE
          </h1>
        </div>

        {/* Bottom descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-auto">
          {DESCRIPTIONS.map((desc, i) => (
            <p key={i} className="font-sans text-xs md:text-sm opacity-70 leading-relaxed">
              {desc}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
