"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import { Vector2, TextureLoader, CanvasTexture, SRGBColorSpace } from "three";
import { getGpuConfig } from "@/lib/gpu";

// SVG content to render as texture
const SVG_CONTENT = `<svg width="150" height="57" viewBox="0 0 150 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_93_571)">
<path d="M27.3709 11.7587L12.5664 15.085L14.0791 21.8178L28.8837 18.4915L27.3709 11.7587Z" fill="#161616"/>
<path d="M37.86 7.41752L14.2852 12.7144L15.7271 19.132L39.3019 13.8352L37.86 7.41752Z" fill="#161616"/>
<path d="M20.302 9.11043L15.9961 10.0779L16.7353 13.368L21.0412 12.4006L20.302 9.11043Z" fill="#161616"/>
<path d="M34.7671 3.74293L28.1367 5.23267L29.6643 12.0317L36.2948 10.542L34.7671 3.74293Z" fill="#161616"/>
<path d="M37.3661 5.23694L24.5469 8.11719L26.4786 16.7149L39.2978 13.8346L37.3661 5.23694Z" fill="#161616"/>
<path d="M41.0581 11.0003L38.4766 11.5803L42.4063 29.0707L44.9879 28.4907L41.0581 11.0003Z" fill="#161616"/>
<path d="M50.5757 13.6204L37.5898 16.5381L38.9925 22.7811L51.9784 19.8634L50.5757 13.6204Z" fill="#161616"/>
<path d="M53.1011 15.1292L51.0215 15.5964L51.5514 17.9551L53.6311 17.4879L53.1011 15.1292Z" fill="#161616"/>
<path d="M40.7149 17.952L25.1074 21.4587L26.0731 25.7566L41.6806 22.2499L40.7149 17.952Z" fill="#161616"/>
<path d="M25.8833 23.4829L8.30859 27.4316L9.78976 34.0239L27.3645 30.0752L25.8833 23.4829Z" fill="#161616"/>
<path d="M32.7473 23.8687L25.6953 25.4531L26.3308 28.2815L33.3828 26.6971L32.7473 23.8687Z" fill="#161616"/>
<path d="M10.6244 28.9917L4.65039 30.334L5.23041 32.9155L11.2044 31.5732L10.6244 28.9917Z" fill="#161616"/>
<path d="M14.0802 21.6366L11.8359 22.1409L13.0537 27.5608L15.298 27.0566L14.0802 21.6366Z" fill="#161616"/>
<path d="M10.2991 31.7793L7.32812 32.4468L7.78411 34.4763L10.7551 33.8087L10.2991 31.7793Z" fill="#161616"/>
<path d="M16.4378 31.8346L13.9707 32.3889L14.5868 35.131L17.0539 34.5767L16.4378 31.8346Z" fill="#161616"/>
<path d="M29.6144 36.1482L22.4297 37.7625L22.9348 40.0107L30.1196 38.3965L29.6144 36.1482Z" fill="#161616"/>
<path d="M34.0525 39.2783L25.6074 41.1758L26.1126 43.4241L34.5577 41.5266L34.0525 39.2783Z" fill="#161616"/>
<path d="M20.71 30.1047L22.6074 38.5498L24.8557 38.0447L22.9582 29.5996L20.71 30.1047Z" fill="#161616"/>
<path d="M16.7471 34.4245L18.6445 42.8696L20.8928 42.3645L18.9954 33.9194L16.7471 34.4245Z" fill="#161616"/>
<path d="M23.3987 41.6693L20.6426 42.2886L21.7034 47.01L24.4595 46.3907L23.3987 41.6693Z" fill="#161616"/>
<path d="M26.0779 45.4092L23.6309 45.959L24.6497 50.4937L27.0967 49.9439L26.0779 45.4092Z" fill="#161616"/>
<path d="M28.989 47.2071L26.5801 47.7483L27.5809 52.2025L29.9897 51.6613L28.989 47.2071Z" fill="#161616"/>
<path d="M40.0422 47.1949L27.8594 49.9321L28.3302 52.0278L40.5131 49.2906L40.0422 47.1949Z" fill="#161616"/>
<path d="M41.8162 44.3589L39.2246 44.9412L39.8069 47.5327L42.3984 46.9504L41.8162 44.3589Z" fill="#161616"/>
<path d="M43.404 41.6863L40.8125 42.2686L41.3948 44.8601L43.9863 44.2778L43.404 41.6863Z" fill="#161616"/>
<path d="M45.1775 38.9878L42.5859 39.5701L43.1682 42.1616L45.7598 41.5793L45.1775 38.9878Z" fill="#161616"/>
<path d="M47.9412 31.8503L45.3496 32.4326L45.9319 35.0242L48.5234 34.4419L47.9412 31.8503Z" fill="#161616"/>
<path d="M49.5486 29.303L46.957 29.8853L47.5393 32.4768L50.1308 31.8945L49.5486 29.303Z" fill="#161616"/>
<path d="M49.6963 19.9247L47.3496 20.4519L49.4126 29.6337L51.7592 29.1065L49.6963 19.9247Z" fill="#161616"/>
<path d="M45.5849 21.1859L43.2383 21.7131L44.2941 26.4124L46.6408 25.8852L45.5849 21.1859Z" fill="#161616"/>
<path d="M47.0263 18.5821L44.6797 19.1094L45.7355 23.8087L48.0822 23.2814L47.0263 18.5821Z" fill="#161616"/>
<path d="M46.3279 34.3589L43.7363 34.9412L44.7687 39.5361L47.3603 38.9538L46.3279 34.3589Z" fill="#161616"/>
</g>
<path d="M149.451 10.1531V45.8389H145.062V10.1531H149.451Z" fill="#161616"/>
<path d="M142.644 31.6125C142.644 32.4484 142.596 33.3325 142.5 34.2648H121.377C121.538 36.8689 122.422 38.9104 124.03 40.3893C125.669 41.836 127.647 42.5593 129.961 42.5593C131.858 42.5593 133.433 42.1253 134.687 41.2573C135.973 40.3571 136.873 39.1676 137.388 37.6887H142.114C141.406 40.2285 139.992 42.3021 137.87 43.9096C135.748 45.4849 133.112 46.2726 129.961 46.2726C127.454 46.2726 125.203 45.71 123.21 44.5847C121.249 43.4595 119.706 41.8681 118.58 39.8106C117.455 37.7209 116.893 35.3097 116.893 32.577C116.893 29.8443 117.439 27.4491 118.532 25.3916C119.625 23.334 121.152 21.7587 123.113 20.6656C125.107 19.5404 127.389 18.9778 129.961 18.9778C132.469 18.9778 134.687 19.5243 136.616 20.6174C138.545 21.7105 140.024 23.2215 141.053 25.1505C142.114 27.0473 142.644 29.2013 142.644 31.6125ZM138.111 30.6962C138.111 29.0245 137.741 27.5938 137.002 26.4043C136.263 25.1826 135.25 24.2664 133.964 23.6555C132.71 23.0125 131.312 22.691 129.768 22.691C127.55 22.691 125.653 23.3983 124.078 24.8129C122.535 26.2275 121.651 28.1886 121.426 30.6962H138.111Z" fill="#161616"/>
<path d="M92.7321 24.3309C93.6323 22.7556 94.9504 21.4696 96.6865 20.473C98.4226 19.4764 100.4 18.9781 102.618 18.9781C104.997 18.9781 107.135 19.5407 109.032 20.6659C110.929 21.7911 112.424 23.3825 113.517 25.4401C114.61 27.4655 115.156 29.8285 115.156 32.529C115.156 35.1974 114.61 37.5765 113.517 39.6662C112.424 41.7559 110.913 43.3794 108.984 44.5368C107.087 45.6942 104.965 46.2729 102.618 46.2729C100.335 46.2729 98.3261 45.7746 96.5901 44.7779C94.8861 43.7813 93.6002 42.5114 92.7321 40.9682V45.8389H88.3438V10.1531H92.7321V24.3309ZM110.671 32.529C110.671 30.5358 110.27 28.7997 109.466 27.3208C108.662 25.842 107.569 24.7167 106.187 23.9451C104.836 23.1736 103.341 22.7878 101.702 22.7878C100.094 22.7878 98.5994 23.1896 97.217 23.9934C95.8667 24.765 94.7736 25.9063 93.9377 27.4173C93.134 28.8961 92.7321 30.6161 92.7321 32.5772C92.7321 34.5705 93.134 36.3226 93.9377 37.8337C94.7736 39.3125 95.8667 40.4538 97.217 41.2576C98.5994 42.0292 100.094 42.4149 101.702 42.4149C103.341 42.4149 104.836 42.0292 106.187 41.2576C107.569 40.4538 108.662 39.3125 109.466 37.8337C110.27 36.3226 110.671 34.5544 110.671 32.529Z" fill="#161616"/>
<path d="M73.3741 46.2726C70.8986 46.2726 68.6482 45.71 66.6228 44.5847C64.6295 43.4595 63.0542 41.8681 61.8968 39.8106C60.7716 37.7209 60.209 35.3097 60.209 32.577C60.209 29.8764 60.7877 27.4974 61.945 25.4398C63.1346 23.3501 64.742 21.7587 66.7675 20.6656C68.7929 19.5404 71.0594 18.9778 73.567 18.9778C76.0747 18.9778 78.3412 19.5404 80.3666 20.6656C82.392 21.7587 83.9834 23.334 85.1408 25.3916C86.3303 27.4491 86.9251 29.8443 86.9251 32.577C86.9251 35.3097 86.3143 37.7209 85.0926 39.8106C83.9031 41.8681 82.2795 43.4595 80.222 44.5847C78.1644 45.71 75.8818 46.2726 73.3741 46.2726ZM73.3741 42.4147C74.9495 42.4147 76.4283 42.0449 77.8108 41.3055C79.1932 40.5661 80.3023 39.4569 81.1382 37.9781C82.0062 36.4992 82.4403 34.6988 82.4403 32.577C82.4403 30.4551 82.0223 28.6547 81.1864 27.1759C80.3506 25.697 79.2575 24.6039 77.9072 23.8966C76.5569 23.1572 75.0941 22.7875 73.5188 22.7875C71.9113 22.7875 70.4325 23.1572 69.0822 23.8966C67.7641 24.6039 66.7032 25.697 65.8994 27.1759C65.0957 28.6547 64.6938 30.4551 64.6938 32.577C64.6938 34.731 65.0796 36.5474 65.8512 38.0263C66.6549 39.5051 67.7159 40.6143 69.034 41.3537C70.3521 42.061 71.7988 42.4147 73.3741 42.4147Z" fill="#161616"/>
<defs>
<clipPath id="clip0_93_571">
<rect width="50.6027" height="45.706" fill="white" transform="translate(0.410156 11.4624) rotate(-12.663)"/>
</clipPath>
</defs>
</svg>`;

// Hook to create texture from SVG
function useSvgTexture(svgContent: string, scale: number = 6) {
  const [texture, setTexture] = useState<CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale up for high DPI
    const width = 150 * scale;
    const height = 57 * scale;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const newTexture = new CanvasTexture(canvas);
      newTexture.colorSpace = SRGBColorSpace;
      newTexture.needsUpdate = true;
      setTexture(newTexture);
    };

    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [svgContent, scale]);

  return texture;
}

// Logo plane with texture
function LogoPlane() {
  const texture = useSvgTexture(SVG_CONTENT, 8);
  const aspectRatio = 150 / 57;

  if (!texture) return null;

  return (
    <mesh>
      <planeGeometry args={[aspectRatio, 1]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
    </mesh>
  );
}

// Glitch effect configuration - more frequent glitches
const glitchDelay = new Vector2(0.5, 2); // Glitch every 0.5-2 seconds (was 2-5)
const glitchDuration = new Vector2(0.1, 0.3); // Slightly longer duration
const glitchStrength = new Vector2(0.05, 0.15);

// Separate component for effects to ensure GL context is ready
// Uses frameloop="demand" — invalidate() triggers renders at GPU-adaptive rate
function GlitchEffects() {
  const { gl, invalidate } = useThree();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (gl) {
      setReady(true);
      invalidate();
    }
  }, [gl, invalidate]);

  // Invalidate at tier-based fps: high=60fps (16ms), mid=30fps (33ms)
  useEffect(() => {
    if (!ready) return;
    const { tier } = getGpuConfig();
    const interval = setInterval(() => invalidate(), tier >= 3 ? 16 : 33);
    return () => clearInterval(interval);
  }, [ready, invalidate]);

  if (!ready) return null;

  return (
    <EffectComposer>
      <Glitch
        delay={glitchDelay}
        duration={glitchDuration}
        strength={glitchStrength}
        mode={GlitchMode.SPORADIC}
        active
        ratio={0.85}
      />
    </EffectComposer>
  );
}

type LogoGlitchProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function LogoGlitch({
  className = "",
  width = 80,
  height = 30,
}: LogoGlitchProps) {
  const [mounted, setMounted] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip WebGL entirely on low-end devices
    if (getGpuConfig().tier <= 1) {
      setIsLowEnd(true);
      return;
    }
    // Defer Canvas mount to next frame so the container is sized
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleError = useCallback((e: ErrorEvent) => {
    // Suppress WebGL context errors — fallback is the static logo in Logo3D
    e.preventDefault?.();
  }, []);

  useEffect(() => {
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [handleError]);

  // Low-end: render static SVG instead of WebGL
  if (isLowEnd) {
    return (
      <div className={className} style={{ width, height }}>
        <img src="/images/logo-wordmark.svg" alt="OBEL" width={width} height={height} style={{ objectFit: "contain" }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={{ width, height }}>
      {mounted && (
        <Canvas
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 2], fov: 30 }}
          frameloop="demand"
          style={{ width: "100%", height: "100%" }}
        >
          <LogoPlane />
          <GlitchEffects />
        </Canvas>
      )}
    </div>
  );
}
