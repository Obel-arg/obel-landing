"use client";

import { useState } from "react";
import { IconLink } from "@tabler/icons-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2 sm:gap-2.5 bg-primary text-background font-sans text-base sm:text-lg tracking-[-0.03em] py-3 sm:py-3.5 rounded-[9px] transition-opacity duration-300 hover:opacity-85 cursor-pointer"
    >
      <IconLink size={18} stroke={1.5} />
      {copied ? "Link copied!" : "Share this project"}
    </button>
  );
}
