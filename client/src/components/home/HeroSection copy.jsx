import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import vedantImg from "/src/assets/vedant.png";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  const [showStory, setShowStory] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);

useEffect(() => {
    const handleScroll = () => {
        if (!isScrollLocked) {
            setShowStory(window.scrollY > 0);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrollLocked]);

  useEffect(() => {
    if (showStory) {
      document.body.style.overflow = 'hidden';
      setIsScrollLocked(true);
    } else {
      document.body.style.overflow = 'auto';
      setIsScrollLocked(false);
    }
  }, [showStory]);

  
  return (
    <section 
      id="hero"
      className="relative min-h-screen pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl h-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 h-full">
          {/* Left Column */}
          <div className="flex-1 lg:w-3/5 h-[600px] relative">
            <AnimatePresence>
              {!showStory ? (
                <motion.div
                  key="content"
                  className="space-y-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div className="flex items-center gap-4">
                    <span className="text-xl md:text-2xl font-medium text-blue-300">
                      Hi there
                    </span>
                    <motion.img
                      src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
                      className="h-10 w-10"
                      alt="wave"
                      animate={{ rotate: [0, 20, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  </motion.div>

                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold">
                      <span className="text-gray-300">I'm </span>
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Vedant Lahane
                      </span>
                    </h1>
                    
                    <TypeAnimation
                      sequence={[
                        'Full Stack Developer',
                        2000,
                        'UI/UX Enthusiast',
                        2000,
                        'Problem Solver',
                        2000,
                      ]}
                      wrapper="p"
                      speed={50}
                      className="text-2xl md:text-3xl text-gray-400 font-medium"
                      repeat={Infinity}
                    />
                  </div>

                  <motion.p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
                    Crafting digital experiences that bridge innovation with functionality,
                    focused on building scalable solutions for modern challenges.
                  </motion.p>

                  <motion.div className="pt-8">
                    <a
                      href="#contact"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 
                      text-white text-lg font-medium rounded-xl hover:shadow-2xl transition-all"
                    >
                      Let's Connect
                      <ArrowRightIcon className="h-6 w-6 ml-3" />
                    </a>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="story"
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.5 }}
                >
                  <TypeAnimation
                    sequence={[
                      "2019: Started coding journey",
                      1500,
                      "2020: First web project",
                      1500,
                      "2021: Mastered MERN stack",
                      1500,
                      "2022: Professional projects",
                      1500,
                      "2023: Open source contributions",
                      1500,
                      () => {
                        document.body.style.overflow = 'auto';
                        setIsScrollLocked(false);
                      }
                    ]}
                    wrapper="p"
                    speed={50}
                    className="text-3xl md:text-4xl text-gray-300 leading-relaxed"
                    repeat={0}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column */}
          <div className="lg:w-2/5 h-[600px] relative">
            {floatingCards.map((card, index) => (
              <motion.div
                key={index}
                className="absolute bg-blue-400/10 backdrop-blur-sm rounded-2xl"
                style={{
                  width: card.size,
                  height: card.size,
                  zIndex: card.z,
                  left: card.x,
                  top: card.y
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: card.delay,
                  duration: 0.8,
                  type: 'spring'
                }}
              />
            ))}

            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 25 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="relative w-52 h-52 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={vedantImg}
                  alt="Vedant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;