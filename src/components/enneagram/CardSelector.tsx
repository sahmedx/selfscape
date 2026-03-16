"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface SelectionCard {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
}

interface CardSelectorProps {
  heading: string;
  subheading: string;
  cards: SelectionCard[];
  onSelect: (id: string) => void;
}

export default function CardSelector({
  heading,
  subheading,
  cards,
  onSelect,
}: CardSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string) {
    if (selected) return; // prevent double-tap
    setSelected(id);
    setTimeout(() => onSelect(id), 400); // brief delay for selection animation
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 w-full max-w-md mx-auto">
      <h2 className="text-sm uppercase tracking-widest text-gold/60">
        {heading}
      </h2>
      <p className="text-foreground/40 text-sm mb-4 text-center">
        {subheading}
      </p>

      <div className="flex flex-col gap-4 w-full">
        {cards.map((card, i) => {
          const isSelected = selected === card.id;
          const isDimmed = selected !== null && !isSelected;

          return (
            <motion.button
              key={card.id}
              onClick={() => handleSelect(card.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isDimmed ? 0.2 : 1,
                y: 0,
                scale: isSelected ? 1.02 : 1,
              }}
              transition={{
                delay: i * 0.1,
                duration: 0.4,
                ease: "easeOut",
              }}
              className={`cursor-pointer w-full text-left rounded-2xl border p-6 backdrop-blur-sm transition-colors ${
                isSelected
                  ? "border-gold/60 bg-gold/10"
                  : "border-gold/20 bg-background/80 hover:border-gold/40"
              }`}
            >
              {card.subtitle && (
                <p className="text-xs uppercase tracking-widest text-gold/50 mb-2">
                  {card.subtitle}
                </p>
              )}
              <h3 className="text-xl font-serif text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {card.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
