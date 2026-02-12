"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });
}

export default function ScrollVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const video = videoRef.current;
      const container = containerRef.current;

      if (!video || !container) return;

      let scrollTween: gsap.core.Tween;

      const setupAnimation = () => {
        const isMobile = window.innerWidth < 768;

        // Responsive scroll distance
        const scrollDistance = isMobile
          ? window.innerHeight * 2
          : window.innerHeight * 4;

        scrollTween = gsap.to(video, {
          currentTime: video.duration || 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: `+=${scrollDistance}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      };

      if (video.readyState >= 2) {
        setupAnimation();
      } else {
        video.onloadedmetadata = setupAnimation;
      }

      // Refresh ScrollTrigger on resize
      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (scrollTween) scrollTween.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef },
  );

  return (
    <main className="bg-black text-white">
      {/* Intro Spacer */}
      <section className="h-[60vh] flex items-center justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:px-4 sm">
          Scroll Down to Start Video
        </h1>
      </section>

      {/* Video Section */}
      <section ref={containerRef} className="relative w-full">
        <div className="min-h-screen flex items-center justify-center">
          <video
            ref={videoRef}
            src="video.mp4" // Place video in public folder
            className="
              w-full 
              h-[60vh] 
              sm:h-[70vh] 
              md:h-[80vh] 
              lg:h-screen 
              
            "
            playsInline
            muted
            preload="auto"
            disablePictureInPicture
          />
        </div>
      </section>

      {/* Outro Section */}
      <section className="h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-lg sm:text-xl md:text-2xl">End of Animation</p>
      </section>
    </main>
  );
}
