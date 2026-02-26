import { useEffect, useRef } from "react";
import Lenis from "lenis";

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false, // Native scroll on mobile
    });
    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    return () => {      lenis.destroy();
    }
  }, []);

  return children;
};

export default SmoothScroll;
