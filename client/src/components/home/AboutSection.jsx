import { useEffect, useRef, useState } from "react";
import GradientSeparator from "./GradientSeparator";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, AcademicCapIcon, CodeBracketIcon, RocketLaunchIcon, CommandLineIcon } from "@heroicons/react/24/outline";

const AboutSection = () => {
  const scrollContainerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: <AcademicCapIcon className="w-6 h-6" />,
      title: "Education",
      content: "I'm a 3rd year Computer Science and Engineering undergrad at Lovely Professional University.",
      highlight: "3rd year CSE undergrad",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <CodeBracketIcon className="w-6 h-6" />,
      title: "Journey",
      content: "During my first semester, I discovered HTML, CSS, and JavaScript and was amazed by the power of web development.",
      highlight: "HTML, CSS, and JavaScript",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <CommandLineIcon className="w-6 h-6" />,
      title: "Competitive Programming",
      content: "I have a keen interest in Data Structures, Algorithms, and Competitive Programming — solving 300+ problems.",
      highlight: "300+ problems solved",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      title: "Current Focus",
      content: "Always eager to learn: currently exploring Docker and Jenkins for DevOps practices.",
      highlight: "Docker and Jenkins",
      color: "from-orange-500 to-red-500"
    },
  ];

  const totalSlides = slides.length;

  const goToSlide = (index) => {
    if (scrollContainerRef.current) {
      const slideIndex = Math.max(0, Math.min(totalSlides - 1, index));
      const slide = scrollContainerRef.current.children[slideIndex];
      if (slide) {
        scrollContainerRef.current.scrollTo({
          left: slide.offsetLeft - 16,
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

    const handleScroll = () => {
      const slides = Array.from(container.children);
      const scrollLeft = container.scrollLeft;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      slides.forEach((slide, i) => {
        const distance = Math.abs(slide.offsetLeft - scrollLeft - 16);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });
      
      setActiveSlide(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gray-300">About </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A passionate developer on a journey to build amazing things
          </p>
        </motion.div>

        {/* Slide Controls */}
        <div className="flex justify-end gap-2 mb-6 max-w-6xl mx-auto">
          <motion.button
            onClick={prevSlide}
            disabled={activeSlide === 0}
            className={`p-2 rounded-full transition-all ${
              activeSlide === 0
                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
            }`}
            whileHover={{ scale: activeSlide === 0 ? 1 : 1.1 }}
            whileTap={{ scale: activeSlide === 0 ? 1 : 0.95 }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            disabled={activeSlide === totalSlides - 1}
            className={`p-2 rounded-full transition-all ${
              activeSlide === totalSlides - 1
    
                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
            }`}
            whileHover={{ scale: activeSlide === totalSlides - 1 ? 1 : 1.1 }}
            whileTap={{ scale: activeSlide === totalSlides - 1 ? 1 : 0.95 }}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Carousel container */}
        <div className="relative overflow-hidden max-w-6xl mx-auto">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 px-4 scrollbar-hide scroll-smooth snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] md:min-w-[350px] flex-shrink-0 snap-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-full p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all group">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${slide.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {slide.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{slide.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {slide.content.split(slide.highlight).map((part, i) => (
                      <span key={i}>
                        {part}
                        {i === 0 && (
                          <span className={`font-semibold bg-gradient-to-r ${slide.color} bg-clip-text text-transparent`}>
                            {slide.highlight}
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              className={`transition-all duration-300 rounded-full ${
                activeSlide === i
                  ? "w-8 h-2 bg-gradient-to-r from-blue-400 to-purple-500"
                  : "w-2 h-2 bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => goToSlide(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 px-6 py-4 rounded-2xl bg-gray-900/50 border border-gray-800">
            <span className="text-lg text-gray-300">Looking for</span>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              internships
            </span>
            <span className="text-lg text-gray-300">and</span>
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              job opportunities
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <GradientSeparator />
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