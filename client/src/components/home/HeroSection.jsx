import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import vedantImg from "/src/assets/vedant.png";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import GradientSeparator from "./GradientSeparator";

const HeroSection = () => {
  const floatingCards = [
    { x: '20%', y: '15%', rotate: 0, z: 25, size: '150px', delay: 0.1 },
    { x: '30%', y: '-1%', rotate: 0, z: 10, size: '160px', delay: 0.3 },
    { x: '60%', y: '25%', rotate: 0, z: 20, size: '130px', delay: 0.5 },
    { x: '10%', y: '50%', rotate: 0, z: 30, size: '160px', delay: 0.7 },
    { x: '65%', y: '40%', rotate: 0, z: 15, size: '130px', delay: 0.9 },
    { x: '0%', y: '30%', rotate: 0, z: 25, size: '170px', delay: 1.1 },
    { x: '70%', y: '15%', rotate: 0, z: 5, size: '120px', delay: 1.3 },
    { x: '70%', y: '65%', rotate: 0, z: 35, size: '145px', delay: 1.5 }
  ];

  return (
    <section 
      id="hero"
      className="relative min-h-screen pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl h-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 h-full">
          {/* Left Column */}
          <div className="flex-1 lg:w-3/5 h-[600px] relative">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                  <span className="bg-linear-to-r from-slate-300 to-gray-500 bg-clip-text text-transparent">I'm </span>
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
                  href="https://drive.google.com/file/d/1Tk6LcfyllkKkCcH3WAsR6-pVjNgkcykZ/view?usp=drivesdk"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 
                  text-white text-lg font-medium rounded-xl hover:shadow-2xl transition-all"
                >
                  Resume
                  <ArrowRightIcon className="h-6 w-6 ml-3" />
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-2/5 h-[300px] md:h-[400px] lg:h-[600px] relative">
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
              <div className="relative w-52 h-64 rounded-2xl overflow-hidden shadow-2xl">
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
      <GradientSeparator/>
    </section>
  );
};

export default HeroSection;