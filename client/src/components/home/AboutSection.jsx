import { useEffect, useRef, useState, useCallback } from "react";
import GradientSeparator from "./GradientSeparator";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GAP_WIDTH = 24; // gap between slides in px
const TOTAL_SLIDES = 4;

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1400, once: true });
  }, []);

  const scrollContainerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = useCallback((index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideIndex = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
      const slideWidth = container.offsetWidth;
      const scrollPosition = slideIndex * (slideWidth + GAP_WIDTH);

      container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setActiveSlide(slideIndex);
    }
  }, []);

  const nextSlide = () => goToSlide(activeSlide + 1);
  const prevSlide = () => goToSlide(activeSlide - 1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const slideWidth = container.offsetWidth;
        const newIndex = Math.round(container.scrollLeft / (slideWidth + GAP_WIDTH));
        setActiveSlide(Math.max(0, Math.min(TOTAL_SLIDES - 1, newIndex)));
      }, 150);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="about" className="py-16 md:py-24 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gray-300">About </span>
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Me</span>
        </motion.h2>

        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-4"
          >
            <h1 className="flex items-center text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent">hello</span>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ml-2">again,</span>
            </h1>
          </motion.div>

          <div className="flex justify-end space-x-2 mb-4">
            <button 
              onClick={prevSlide} 
              disabled={activeSlide === 0}
              className={`p-2 rounded-full border ${
                activeSlide === 0 
                  ? 'border-gray-700/30 text-gray-600' 
                  : 'border-gray-700 hover:border-blue-400 text-gray-400 hover:text-blue-400'
              } transition-all`}
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={nextSlide} 
              disabled={activeSlide === TOTAL_SLIDES - 1}
              className={`p-2 rounded-full border ${
                activeSlide === TOTAL_SLIDES - 1 
                  ? 'border-gray-700/30 text-gray-600' 
                  : 'border-gray-700 hover:border-purple-400 text-gray-400 hover:text-purple-400'
              } transition-all`}
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Carousel */}
          <div className="relative overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                "I'm a 3rd year Computer Science and Engineering undergrad at Lovely Professional University.",
                "During my first semester, I discovered HTML, CSS, and JavaScript and was amazed by the power of web development. JavaScript was a bit tough at first, but I persevered and started building projects.",
                "I also have a keen interest in Data Structures, Algorithms, and Competitive Programming—solving 300+ problems on platforms like LeetCode and GeeksforGeeks.",
                "Always eager to learn: currently exploring Docker and Jenkins.",
              ].map((text, index) => (
                <div
                  key={index}
                  className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] flex-shrink-0 p-6 border border-gray-700/50 rounded-xl snap-start"
                >
                  <p className="text-xl text-gray-400">
                    {text
                      .replace("Computer Science and Engineering undergrad", 
                        <span className="text-blue-400 font-semibold">Computer Science and Engineering undergrad</span>
                      )
                      .replace("HTML, CSS, and JavaScript", 
                        <span className="text-purple-400 font-semibold">HTML, CSS, and JavaScript</span>
                      )
                      .replace("Data Structures, Algorithms", 
                        <span className="text-green-400 font-semibold">Data Structures, Algorithms</span>
                      )
                      .replace("Competitive Programming", 
                        <span className="text-yellow-300 font-semibold">Competitive Programming</span>
                      )
                      .replace("Docker", 
                        <span className="text-blue-400 font-semibold">Docker</span>
                      )
                      .replace("Jenkins", 
                        <span className="text-purple-400 font-semibold">Jenkins</span>
                      )
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-3 mt-6">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button 
                key={i} 
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === i 
                    ? 'w-6 h-2 bg-blue-400' 
                    : 'w-2 h-2 bg-gray-700 hover:bg-blue-400/50'
                }`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeSlide === i ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        <hr className="border-t border-gray-700 my-12" />

        {/* CTA */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-xl sm:text-2xl text-gray-300">
            Looking for <span className="text-blue-400">internships</span> and <span className="text-purple-400">job opportunities</span> to learn and gain real-world experience.
          </p>
        </motion.div>
      </div>

      {/* Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 md:mt-24"
      >
        <GradientSeparator data-aos="fade-up" />
      </motion.div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
