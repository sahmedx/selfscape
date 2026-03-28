"use client";

import { useRef, useEffect, useCallback } from "react";

interface ScrollWheelProps {
  items: { value: number; label: string }[];
  selectedValue: number;
  onChange: (value: number) => void;
}

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

function ChevronButton({ direction, onClick }: { direction: "up" | "down"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer border-none bg-transparent px-3 py-1 text-gold/30 transition-colors hover:text-gold/70"
      aria-label={direction === "up" ? "Previous" : "Next"}
    >
      <svg
        width="20"
        height="12"
        viewBox="0 0 20 12"
        fill="none"
        className={direction === "down" ? "rotate-180" : undefined}
      >
        <path d="M2 10L10 3L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function ScrollWheel({ items, selectedValue, onChange }: ScrollWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isUserScrolling = useRef(false);

  const scrollToValue = useCallback((value: number, smooth = false) => {
    const container = containerRef.current;
    if (!container) return;
    const index = items.findIndex((item) => item.value === value);
    if (index === -1) return;
    const targetScroll = index * ITEM_HEIGHT;
    container.scrollTo({
      top: targetScroll,
      behavior: smooth ? "smooth" : "instant",
    });
  }, [items]);

  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollToValue(selectedValue);
    }
  }, [selectedValue, scrollToValue]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    isUserScrolling.current = true;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      const item = items[clampedIndex];
      if (item && item.value !== selectedValue) {
        onChange(item.value);
      }
      isUserScrolling.current = false;
    }, 100);
  }, [items, selectedValue, onChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const scrollByOne = (direction: "up" | "down") => {
    const container = containerRef.current;
    if (!container) return;
    const offset = direction === "up" ? -ITEM_HEIGHT : ITEM_HEIGHT;
    container.scrollBy({ top: offset, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center">
      <ChevronButton direction="up" onClick={() => scrollByOne("up")} />

      <div className="relative" style={{ height: CONTAINER_HEIGHT }}>
        <div
          className="pointer-events-none absolute left-0 right-0 z-10 border-t border-b border-gold/30"
          style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }}
        />
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-20"
          style={{
            height: ITEM_HEIGHT * 2,
            background: "linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-0 right-0 bottom-0 z-20"
          style={{
            height: ITEM_HEIGHT * 2,
            background: "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
          }}
        />
        <div
          ref={containerRef}
          className="hide-scrollbar h-full overflow-y-auto"
          style={{
            scrollSnapType: "y mandatory",
            paddingTop: ITEM_HEIGHT * 2,
            paddingBottom: ITEM_HEIGHT * 2,
          }}
          onScroll={handleScroll}
        >
          {items.map((item) => {
            const isSelected = item.value === selectedValue;
            return (
              <div
                key={item.value}
                className="flex items-center justify-center transition-all duration-150"
                style={{
                  height: ITEM_HEIGHT,
                  scrollSnapAlign: "center",
                  opacity: isSelected ? 1 : 0.35,
                  transform: isSelected ? "scale(1.1)" : "scale(0.9)",
                }}
              >
                <span className={`text-lg ${isSelected ? "text-gold font-semibold" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ChevronButton direction="down" onClick={() => scrollByOne("down")} />
    </div>
  );
}
