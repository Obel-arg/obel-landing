export function Hero() {
  return (
    <section
      data-header-dark
      className="relative h-screen bg-primary text-background overflow-hidden shadow-[0_2px_0_0_var(--primary)]"
    >
      {/* Pixel border frame */}
      <img
        src="/images/hero-border.png"
        alt=""
        aria-hidden="true"
        className="absolute top-[calc(var(--header-height)+1vw)] left-[0.8vw] right-[0.8vw] bottom-[0.8vw] w-[calc(100%-1.6vw)] h-[calc(100%-var(--header-height)-1vw-0.8vw)] object-fill pointer-events-none select-none z-0"
      />

      {/* Text content - centered */}
      <div
        className="absolute top-[calc(var(--header-height)+1vw)] left-[0.8vw] right-[0.8vw] bottom-[0.8vw] flex flex-col items-center justify-center pt-[4vw] z-10"
        style={{ clipPath: 'inset(4vw)' }}
      >
        <h1 className="font-neuebit text-[min(27.8vw,459px)] leading-[0.6] tracking-tight text-center">
          Technology
        </h1>
        <div className="flex items-center gap-[8vw] font-geist-mono text-[min(3.5vw,58px)] leading-none tracking-[-0.04em] uppercase mb-[0.5vw]">
          <span className="ml-[-3.5vw]">from</span>
          <span className="translate-x-[7vw]">inside the</span>
        </div>
        <h1 className="font-neuebit text-[min(40.8vw,673px)] leading-[0.6] tracking-tight text-center -mt-[4vw]">
          Culture
        </h1>
      </div>
    </section>
  );
}
