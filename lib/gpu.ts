"use client";

import { getGPUTier } from "detect-gpu";

interface GpuConfig {
  pixelCols: number;
  pixelRows: number;
  tier: number;
}

const HIGH: GpuConfig = { pixelCols: 60, pixelRows: 35, tier: 3 };
const MID: GpuConfig = { pixelCols: 45, pixelRows: 26, tier: 2 };
const LOW: GpuConfig = { pixelCols: 30, pixelRows: 18, tier: 1 };

function configForTier(tier: number): GpuConfig {
  if (tier <= 1) return LOW;
  if (tier === 2) return MID;
  return HIGH;
}

// Defaults — high quality. Updated synchronously from cache or async from detect-gpu.
let cachedConfig: GpuConfig = HIGH;

if (typeof window !== "undefined") {
  // Read cached tier from localStorage (instant, no async wait)
  try {
    const cached = localStorage.getItem("gpu-tier");
    if (cached !== null) {
      cachedConfig = configForTier(parseInt(cached, 10));
    }
  } catch {
    // localStorage blocked (incognito, etc.) — use defaults
  }

  // Run async GPU detection in background, cache for next page load
  getGPUTier({ desktopTiers: [0, 15, 30, 60] }).then(({ tier }) => {
    try {
      localStorage.setItem("gpu-tier", String(tier));
    } catch {
      // Ignore storage errors
    }
    cachedConfig = configForTier(tier);
  });
}

/** Returns GPU-adaptive grid config. Synchronous — uses cached tier or defaults. */
export function getGpuConfig(): GpuConfig {
  return cachedConfig;
}
