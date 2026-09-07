import { useEffect, useRef } from "react";
import Lenis from "lenis";

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // On mobile and touch devices, native momentum scrolling is hardware-accelerated.
    // Bypassing Lenis prevents touch event conflicts, scroll latency, and stutter.
    const isTouchOrMobile = 
      typeof window !== 'undefined' && 
      (('ontouchstart' in window) || window.innerWidth < 1024 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    if (isTouchOrMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;
