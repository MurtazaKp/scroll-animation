"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function ScrollVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const video = videoRef.current;
      const container = containerRef.current;
      if (!video || !container) return;

      const setup = async () => {
        try {
          await video.play();
          video.pause();
          video.currentTime = 0.01; // not 0 (important for iOS)
        } catch (e) {
          console.log("Autoplay prevented", e);
        }

        const scrollDistance = window.innerHeight * 3;

        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!video.duration) return;
            video.currentTime = self.progress * video.duration;
          },
        });
      };

      if (video.readyState >= 2) {
        setup();
      } else {
        video.addEventListener("loadeddata", setup);
      }

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef },
  );

  return (
    <main className="bg-black text-white">
      {/* Intro Spacer */}
      <section className="h-[60vh] flex items-center justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:px-4 sm">
          Scroll Down
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
    </main>
  );
}
