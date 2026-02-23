"use client";

import { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

interface AccordionItem {
  label: string;
  content: string;
}

export function ProjectAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-0">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => toggle(index)}
            className="w-full text-left cursor-pointer"
          >
            <div className="flex items-center justify-between py-2.5 sm:py-3">
              <span className="font-sans text-base sm:text-lg text-foreground tracking-[-0.03em]">
                {item.label}
              </span>
              <IconChevronDown
                size={18}
                stroke={1.5}
                className="text-foreground shrink-0 ml-4 transition-transform duration-300 sm:[&]:size-5"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </div>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-foreground/60 pb-3 sm:pb-4">
                  {item.content}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
