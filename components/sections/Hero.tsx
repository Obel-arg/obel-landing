"use client";

function scrollToAbout() {
  const lenis = (
    window as unknown as {
      lenis?: {
        scrollTo: (
          target: string | number,
          opts?: { offset?: number; duration?: number }
        ) => void;
      };
    }
  ).lenis;
  if (lenis) {
    const target = document.querySelector("#about");
    const distance = target
      ? Math.abs(target.getBoundingClientRect().top)
      : window.innerHeight;
    const duration = Math.min(4.5, Math.max(1.5, distance / 1200));
    lenis.scrollTo("#about", { offset: -72, duration });
  }
}

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
        <div className="flex items-center gap-[min(6vw,10.2vh)] font-geist-mono text-[min(3.7vw,6.2vh)] leading-none tracking-[-0.04em] uppercase mt-[min(1.5vw,2.5vh)] md:-translate-y-[6px]">
          <span className="translate-x-[1vw]">from</span>
          <span className="translate-x-[7vw]">inside the</span>
        </div>
        <h1 className="font-neuebit text-[min(37vw,59vh)] leading-[0.6] tracking-tight text-center mt-0 md:-mt-[min(4vw,6.8vh)]">
          Culture
        </h1>

        {/* Ornament swirl — mobile only (desktop has hero-border.png) */}
        <img
          src="/images/hero-ornament.svg"
          alt=""
          aria-hidden="true"
          className="md:hidden w-[80%] max-w-[308px] h-auto mt-[min(3vw,5vh)] rotate-180 pointer-events-none select-none"
        />
      </div>

      {/* Bouncing scroll arrow */}
      <button
        onClick={scrollToAbout}
        className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer p-3"
        aria-label="Scroll down"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
