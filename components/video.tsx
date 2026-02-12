"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollCanvasSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCount = 51;

  const getFrameSrc = (index: number) =>
    `/frames/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas || !containerRef.current) return;
      const context = canvas.getContext("2d");
      if (!context) return;

      const images: HTMLImageElement[] = [];
      const imageSeq = { frame: 0 };

      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        images.push(img);
      }

      const render = () => {
        const img = images[imageSeq.frame];
        if (!img || !img.complete) return;

        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Reset canvas dimensions to match the window
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);

        // ✅ FIX: Use Math.min to ensure the whole image fits on mobile screen
        const scale = Math.min(width / img.width, height / img.height);

        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;

        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      };

      images[0].onload = render;

      gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 0.5,
          pin: true,
          invalidateOnRefresh: true, // Essential for mobile orientation changes
          onUpdate: render,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <main className="bg-black">
      {/* Spacer */}
      <section className="h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl">Scroll to view Plan</h1>
      </section>

      {/* ✅ FIX: Changed h-64 to h-screen for mobile visibility */}
      <section
        ref={containerRef}
        className="w-full h-screen bg-black overflow-hidden "
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </section>
    </main>
  );
}
