export function Hero() {
  return (
    <section
      data-header-dark
      className="relative h-screen bg-primary text-background overflow-hidden shadow-[0_2px_0_0_var(--primary)]"
      style={{ height: '100dvh' }}
    >
      {/* Pixel border frame */}
      <img
        src="/images/hero-border.png"
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute top-[calc(var(--header-height)+1vw)] left-[0.8vw] right-[0.8vw] bottom-[0.8vw] w-[calc(100%-1.6vw)] h-[calc(100%-var(--header-height)-1vw-0.8vw)] object-fill pointer-events-none select-none z-0"
      />

      {/* Text content - centered */}
      <div className="absolute top-[calc(var(--header-height)+1vw)] left-[3.8vw] right-[3.8vw] bottom-[0.8vw] flex flex-col items-center justify-center pt-[min(4vw,6.8vh)] z-10">
        <h1 className="font-neuebit text-[min(25vw,40vh)] leading-[0.6] tracking-tight text-center">
          Technology
        </h1>
        <div className="flex items-center gap-[min(8vw,13.6vh)] font-geist-mono text-[max(16px,min(3vw,5vh))] leading-none tracking-[-0.04em] uppercase mb-[min(0.5vw,0.85vh)]">
          <span className="translate-x-[-3.5vw]">from</span>
          <span className="translate-x-[7vw]">inside the</span>
        </div>
        <h1 className="font-neuebit text-[min(37vw,59vh)] leading-[0.6] tracking-tight text-center -mt-[min(4vw,6.8vh)]">
          Culture
        </h1>
      </div>
    </section>
  );
}
