import { useEffect, useRef, useState } from "react";
import GradientSeparator from "./GradientSeparator";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1400, once: true });
  }, []);

  const scrollContainerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 4;

  const goToSlide = (index) => {
    if (scrollContainerRef.current) {
      const slideIndex = Math.max(0, Math.min(totalSlides - 1, index));
      const slide = scrollContainerRef.current.children[slideIndex];
      if (slide) {
        scrollContainerRef.current.scrollTo({
          left: slide.offsetLeft,
          behavior: "smooth",
        });
        setActiveSlide(slideIndex);
      }
    }
  };

  const nextSlide = () => goToSlide(activeSlide + 1);
  const prevSlide = () => goToSlide(activeSlide - 1);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const slides = Array.from(container.children);
        const scrollLeft = container.scrollLeft;

        let closestIndex = 0;
        let minDistance = Infinity;
        slides.forEach((slide, i) => {
          const distance = Math.abs(slide.offsetLeft - scrollLeft);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        });

        setActiveSlide(Math.max(0, Math.min(totalSlides - 1, closestIndex)));
      }, 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [totalSlides]);

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
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Me
          </span>
        </motion.h2>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Greeting */}
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

          {/* Slide Controls */}
          <div className="flex justify-end space-x-2 mb-4">
            <button
              onClick={prevSlide}
              disabled={activeSlide === 0}
              className={`p-2 rounded-full border ${
                activeSlide === 0
                  ? "border-gray-700/30 text-gray-600"
                  : "border-gray-700 hover:border-blue-400 text-gray-400 hover:text-blue-400"
              } transition-all`}
              aria-label="Previous slide"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              disabled={activeSlide === totalSlides - 1}
              className={`p-2 rounded-full border ${
                activeSlide === totalSlides - 1
                  ? "border-gray-700/30 text-gray-600"
                  : "border-gray-700 hover:border-purple-400 text-gray-400 hover:text-purple-400"
              } transition-all`}
              aria-label="Next slide"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Carousel container */}
          <div className="relative overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth snap-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Slide 1 */}
              <div className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] flex-shrink-0 p-6 border border-gray-700/50 rounded-xl snap-start">
                <p className="text-xl text-gray-400">
                  I'm a <span className="text-blue-400 font-semibold">3rd year Computer Science and Engineering undergrad</span> at Lovely Professional University.
                </p>
              </div>

              {/* Slide 2 */}
              <div className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] flex-shrink-0 p-6 border border-gray-700/50 rounded-xl snap-start">
                <p className="text-xl text-gray-400">
                  During my first semester, I discovered <span className="text-purple-400 font-semibold">HTML, CSS, and JavaScript</span> and was amazed by the power of web development. JavaScript was a bit tough at first, but I persevered and started building projects.
                </p>
              </div>

              {/* Slide 3 */}
              <div className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] flex-shrink-0 p-6 border border-gray-700/50 rounded-xl snap-start">
                <p className="text-xl text-gray-400">
                  I also have a keen interest in <span className="text-green-400 font-semibold">Data Structures, Algorithms</span>, and <span className="text-yellow-300 font-semibold">Competitive Programming</span> — solving 300+ problems on platforms like LeetCode and GeeksforGeeks.
                </p>
              </div>

              {/* Slide 4 */}
              <div className="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] flex-shrink-0 p-6 border border-gray-700/50 rounded-xl snap-start">
                <p className="text-xl text-gray-400">
                  Always eager to learn: currently exploring <span className="text-blue-400 font-semibold">Docker</span> and <span className="text-purple-400 font-semibold">Jenkins</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center space-x-3 mt-6">
            {[...Array(totalSlides)].map((_, i) => (
              <button
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === i
                    ? "w-6 h-2 bg-blue-400"
                    : "w-2 h-2 bg-gray-700 hover:bg-blue-400/50"
                }`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeSlide === i ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        <hr className="border-t border-gray-700 my-12" />

        {/* Call to Action */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-xl sm:text-2xl text-gray-300">
            Looking for <span className="text-blue-400">internships</span> and{" "}
            <span className="text-purple-400">job opportunities</span> to learn and gain real-world experience.
          </p>
        </motion.div>
      </div>

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
      `}</style>
    </section>
  );
};

export default AboutSection;
