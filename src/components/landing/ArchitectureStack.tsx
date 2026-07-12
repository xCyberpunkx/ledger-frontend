"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// A real 3D object built from the actual stack, not a decorative
// icosahedron floating for its own sake. Five planes in a CSS 3D scene,
// isometrically tilted, that separate into an exploded view on scroll —
// the depth *is* the content: it shows requests passing through layers.
const layers = [
  { label: "Next.js — App Router", detail: "Vercel", tone: "bg-paper text-ink" },
  { label: "API layer", detail: "REST, JSON", tone: "bg-gold text-ink" },
  { label: "NestJS", detail: "Guards · DI · modules", tone: "bg-moss text-paper" },
  { label: "Prisma", detail: "type-safe queries", tone: "bg-moss-dark text-paper" },
  { label: "PostgreSQL", detail: "Neon", tone: "bg-paper-dim text-ink border border-border" },
];

export function ArchitectureStack() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(".arch-layer", {
        z: (i) => -i * 8,
      });

      if (reduceMotion) return;

      gsap.to(".arch-layer", {
        z: (i) => i * 46,
        y: (i) => i * 6,
        stagger: 0.05,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sceneRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 0.8,
        },
      });

      // A slow ambient rotation once assembled — reads as "alive" without
      // being a spinning-logo gimmick, and pauses on hover.
      const rotate = gsap.to(sceneRef.current, {
        rotateY: 8,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      sceneRef.current?.addEventListener("mouseenter", () => rotate.pause());
      sceneRef.current?.addEventListener("mouseleave", () => rotate.play());
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="mx-auto flex h-[340px] w-full max-w-sm items-center justify-center"
      style={{ perspective: "1400px" }}
    >
      <div
        ref={sceneRef}
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(55deg) rotateZ(-35deg)",
        }}
      >
        {layers.map((layer, i) => (
          <div
            key={layer.label}
            className="arch-layer absolute flex h-16 w-56 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-xl text-center shadow-lifted"
            style={{
              left: "50%",
              top: "50%",
              zIndex: layers.length - i,
              transformStyle: "preserve-3d",
            }}
          >
            <div className={`flex h-full w-full flex-col items-center justify-center rounded-xl ${layer.tone}`}>
              <span className="text-xs font-semibold">{layer.label}</span>
              <span className="font-mono text-[10px] opacity-70">{layer.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
