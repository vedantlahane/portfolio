import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const subheadRef = useRef(null);

  // Industry-focused narrative with concise highlights
  const rawText = "Started with a \"Hello World\" three years ago. Now building AI‑powered, scalable web apps with real‑world constraints. Currently building SafarSathi (offline‑first safety PWA) and Axon (RAG document intelligence). Shipped ShoeMarkNet (RBAC e‑commerce) end‑to‑end. Solved over 350+ DSA problems and keep refining system design basics. Core stack: React + TypeScript, Node.js, Java with MongoDB/MySQL. Learning Cloud & DevOps (AWS, Docker, CI/CD) and deepening LLM/RAG systems.";

  // Split into words for animation
  const words = rawText.split(" ");

  useGSAP(() => {
    // Reveal text word-by-word on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1, // Smooth scrubbing
      }
    });

    tl.fromTo(
      ".about-word",
      { opacity: 0.1, y: 10 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "none"
      }
    );

    // Sliding Sub-header
    gsap.fromTo(
      subheadRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: true
        }
      }
    );

  }, { scope: containerRef });

  return (
    <motion.section
      ref={containerRef}
      className="bg-black text-white h-full relative"
    >
      <div className="lg:sticky lg:top-0 lg:h-screen w-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col overflow-y-auto no-scrollbar relative">
        {/* Background gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900 pointer-events-none" />

        {/* Section Label */}
        <div className="mb-4 sm:mb-6 lg:mb-8 relative z-10 lg:mt-2">
          <p className="text-xs sm:text-sm text-gray-500 font-mono font-light">03 &nbsp;&nbsp;ABOUT</p>
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-10 max-w-5xl">

          {/* Sliding Sub-header */}
          <div ref={subheadRef} className="mb-4 lg:mb-6 overflow-hidden">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-display font-light text-gray-400 leading-tight">
              Driven by curiosity.
              <br />
              <span className="text-white font-medium">Defined by execution.</span>
            </h2>
          </div>

          {/* Flowing Text - GSAP ScrolLTrigger */}
          <div
            ref={textRef}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-sans font-light leading-relaxed lg:leading-[1.6]"
          >
            {words.map((word, index) => {
              // Re-highlight key terms
              const isHighlight = [
                "scalable", "AI‑powered,", "SafarSathi", "Axon", "ShoeMarkNet",
                "350+", "DSA", "React", "TypeScript,", "Node.js,", "Java",
                "Cloud", "&", "DevOps", "(AWS,", "Docker,", "CI/CD)", "LLM/RAG"
              ].some(term => word.includes(term));

              return (
                <span
                  key={index}
                  className={`about-word inline-block mr-1.5 lg:mr-2 ${isHighlight ? 'text-white font-medium' : 'text-gray-300'}`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {/* Floating CSE text - Responsive */}
        <div className="absolute bottom-6 sm:bottom-10 lg:bottom-16 left-6 sm:left-10 lg:left-16 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light text-gray-800/30 pointer-events-none">
          CSE
        </div>

        {/* Animated code snippet */}
        <div className="absolute top-1/3 right-6 sm:right-10 lg:right-16 text-[10px] sm:text-xs text-gray-700 font-mono hidden sm:block">
          <pre>
            {`function grow() {
  while (learning) {
    build();
    iterate();
    ship();
  }
}`}
          </pre>
        </div>

        {/* Page indicator */}
        <div className="absolute top-6 sm:top-8 lg:top-12 xl:top-16 right-6 sm:right-8 lg:right-12 xl:right-16 text-xs sm:text-sm text-gray-500 font-mono font-light">
          /03
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </motion.section >
  );
};

export default About;