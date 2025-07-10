
import { motion } from 'framer-motion';

const Me2 = () => {
  // Create layers for the inception effect
  const layers = [
    { scale: 1, rotate: 0, opacity: 1, duration: 20 },
    { scale: 0.85, rotate: 15, opacity: 0.9, duration: 25 },
    { scale: 0.7, rotate: -10, opacity: 0.8, duration: 30 },
    { scale: 0.55, rotate: 25, opacity: 0.7, duration: 35 },
    { scale: 0.4, rotate: -20, opacity: 0.6, duration: 40 },
    { scale: 0.25, rotate: 35, opacity: 0.5, duration: 45 },
  ];

  // Folding animation like the Paris streets in Inception
  const foldAnimation = {
    rotateX: [0, 45, 0, -45, 0],
    rotateY: [0, -45, 0, 45, 0],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Corridor animation
  const corridorAnimation = {
    scale: [1, 1.5, 1],
    z: [0, 200, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gray-950 p-8 md:p-12 lg:p-16 h-full relative overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Section Label */}
      <motion.div
        className="absolute top-8 md:top-12 lg:top-16 left-8 md:left-12 lg:left-16 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-gray-500 font-light">02 &nbsp;&nbsp;EXPERIENCE</p>
      </motion.div>

      {/* Page indicator */}
      <motion.div
        className="absolute top-8 md:top-12 lg:top-16 right-8 md:right-12 lg:right-16 text-xs text-gray-500 font-light z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        /02
      </motion.div>

      {/* Main inception layers */}
      <div className="absolute inset-0 flex items-center justify-center">
        {layers.map((layer, index) => (
          <motion.div
            key={`layer-${index}`}
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateZ: layer.rotate + 360,
              scale: [layer.scale, layer.scale * 1.1, layer.scale],
            }}
            transition={{
              rotateZ: {
                duration: layer.duration,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }
            }}
          >
            {/* Grid pattern for each layer */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,${layer.opacity * 0.1}) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,${layer.opacity * 0.1}) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                opacity: layer.opacity,
              }}
            />

            {/* Rotating frame */}
            <motion.div
              className="absolute inset-0 border border-white/10"
              style={{
                margin: `${index * 10}%`,
                opacity: layer.opacity,
              }}
              animate={foldAnimation}
            />
          </motion.div>
        ))}
      </div>

      {/* Inception corridor effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-full h-full"
          animate={corridorAnimation}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Tunnel layers */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`tunnel-${i}`}
              className="absolute inset-0 border-2 border-white/50"
              style={{
                transform: `translateZ(${i * -50}px) scale(${1 - i * 0.05})`,
                opacity: 1 - i * 0.05,
              }}
              animate={{
                rotateZ: i % 2 === 0 ? 360 : -360,
              }}
              transition={{
                duration: 30 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Folding city blocks */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0">
        {[...Array(16)].map((_, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;
          const delay = (row + col) * 0.1;
          
          return (
            <motion.div
              key={`block-${index}`}
              className="relative border border-white/10 overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
              animate={{
                rotateX: [0, 90, 0, -90, 0],
                rotateY: [0, -90, 0, 90, 0],
              }}
              transition={{
                duration: 20,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Inner geometric pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50">
                <motion.div
                  className="absolute inset-0 bg-white/5"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 10,
                    delay: delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rotating inception rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[
          { size: '100%', duration: 50, direction: 1 },
          { size: '85%', duration: 45, direction: -1 },
          { size: '70%', duration: 40, direction: 1 },
          { size: '55%', duration: 35, direction: -1 },
          { size: '40%', duration: 30, direction: 1 },
        ].map((ring, index) => (
          <motion.div
            key={`ring-${index}`}
            className="absolute border border-white/15 rounded-full"
            style={{
              width: ring.size,
              height: ring.size,
              borderStyle: 'dashed',
            }}
            animate={{
              rotate: ring.direction * 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: {
                duration: ring.duration,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }
            }}
          />
        ))}
      </div>

      {/* Particle field */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Center vortex - monochromatic version */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-32 h-32"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/40 to-gray-500/20 rounded-full blur-xl"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
        </motion.div>
      </div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 pointer-events-none" />
      
      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </motion.section>
  );
};

export default Me2;