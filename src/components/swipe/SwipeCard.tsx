"use client";

import {
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "motion/react";
import { SwipeCardData, SwipeDirection } from "@/lib/types";

interface SwipeCardProps {
  card: SwipeCardData;
  onSwipe: (direction: SwipeDirection) => void;
  draggable: boolean;
}

export interface SwipeCardHandle {
  triggerSwipe: (direction: SwipeDirection) => void;
}

const SWIPE_OFFSET_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 500;
const MAX_ROTATION = 10;
const EXIT_X = 300;

const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(
  function SwipeCard({ card, onSwipe, draggable }, ref) {
    const x = useMotionValue(0);
    const controls = useAnimation();

    const rotate = useTransform(x, [-200, 0, 200], [-MAX_ROTATION, 0, MAX_ROTATION]);
    const leftLabelOpacity = useTransform(x, [-150, -50, 0], [1, 0.4, 0]);
    const rightLabelOpacity = useTransform(x, [0, 50, 150], [0, 0.4, 1]);

    function animateOff(direction: SwipeDirection) {
      const dirX = direction === "right" ? EXIT_X : -EXIT_X;
      const dirRotate = direction === "right" ? MAX_ROTATION : -MAX_ROTATION;
      controls
        .start({
          x: dirX,
          rotate: dirRotate,
          opacity: 0,
          transition: { duration: 0.3 },
        })
        .then(() => onSwipe(direction));
    }

    function handleDragEnd(_: unknown, info: PanInfo) {
      const { x: offsetX } = info.offset;
      const { x: velocityX } = info.velocity;

      if (offsetX > SWIPE_OFFSET_THRESHOLD || velocityX > SWIPE_VELOCITY_THRESHOLD) {
        animateOff("right");
      } else if (offsetX < -SWIPE_OFFSET_THRESHOLD || velocityX < -SWIPE_VELOCITY_THRESHOLD) {
        animateOff("left");
      }
    }

    useImperativeHandle(ref, () => ({
      triggerSwipe: animateOff,
    }));

    return (
      <motion.div
        className="absolute w-[80vw] max-w-[320px] aspect-[5/7] rounded-2xl border border-gold/20 bg-background/80 backdrop-blur-sm shadow-lg cursor-grab active:cursor-grabbing select-none"
        style={{
          x,
          rotate,
          transformOrigin: "bottom center",
          willChange: "transform",
          touchAction: "pan-y",
        }}
        drag={draggable ? "x" : false}
        dragSnapToOrigin
        animate={controls}
        onDragEnd={handleDragEnd}
      >
        {/* Direction indicator labels */}
        <motion.div
          className="absolute top-6 left-6 text-gold font-serif text-lg font-bold -rotate-12 border-2 border-gold rounded-md px-2 py-1 pointer-events-none"
          style={{ opacity: leftLabelOpacity }}
        >
          ← {card.leftDragLabel ?? "Left"}
        </motion.div>
        <motion.div
          className="absolute top-6 right-6 text-gold font-serif text-lg font-bold rotate-12 border-2 border-gold rounded-md px-2 py-1 pointer-events-none"
          style={{ opacity: rightLabelOpacity }}
        >
          {card.rightDragLabel ?? "Right"} →
        </motion.div>

        {/* Card content */}
        <div className="flex flex-col items-center justify-center h-full px-6 gap-6">
          {card.prompt && (
            <p className="text-foreground/60 text-base text-center font-serif italic">
              {card.prompt}
            </p>
          )}
          <div className="flex gap-4 w-full">
            <div className="flex-1 text-center">
              <p className="text-foreground/40 text-xs uppercase tracking-wider mb-2">
                ← Swipe left
              </p>
              <p className="text-foreground font-serif text-base leading-relaxed">
                {card.leftLabel}
              </p>
            </div>
            <div className="w-px bg-gold/20" />
            <div className="flex-1 text-center">
              <p className="text-foreground/40 text-xs uppercase tracking-wider mb-2">
                Swipe right →
              </p>
              <p className="text-foreground font-serif text-base leading-relaxed">
                {card.rightLabel}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default SwipeCard;
