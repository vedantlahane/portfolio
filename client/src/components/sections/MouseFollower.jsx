import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const MouseFollower = ({
  showOnMobile = false,
  style = 'inception' // 'inception', 'vortex', 'ripple', 'constellation', 'neural', 'quantum'
}) => {

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [hoverType, setHoverType] = useState('default'); // 'default', 'link', 'button', 'input'
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth following
  const springConfig = { stiffness: 150, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Improved background brightness detection
  const detectBackgroundBrightness = (x, y) => {
    const element = document.elementFromPoint(x, y);
    if (!element) return;

    // Try to get the effective background color by traversing up the DOM tree
    let el = element;
    let bgColor = '';
    while (el && el !== document.body) {
      bgColor = window.getComputedStyle(el).backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') break;
      el = el.parentElement;
    }
    if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      bgColor = window.getComputedStyle(document.body).backgroundColor || 'rgb(0,0,0)';
    }

    // Parse rgb/rgba color
    const rgb = bgColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0], 10);
      const g = parseInt(rgb[1], 10);
      const b = parseInt(rgb[2], 10);
      // Perceived brightness formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      setIsDarkBackground(brightness < 128);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !showOnMobile) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    let lastBrightnessCheck = 0;
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Detect background brightness periodically (max 10 times a second)
      const now = performance.now();
      if (now - lastBrightnessCheck > 100) {
        lastBrightnessCheck = now;
        detectBackgroundBrightness(e.clientX, e.clientY);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isLink = target.tagName === 'A' || target.closest('a');
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      setIsHovering(isLink || isButton || isInput);

      if (isLink) setHoverType('link');
      else if (isButton) setHoverType('button');
      else if (isInput) setHoverType('input');
      else setHoverType('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [showOnMobile, mouseX, mouseY]);

  if (!isVisible) return null;

  const cursorColor = isDarkBackground ? 'white' : 'black';
  const mixBlendMode = isDarkBackground ? 'screen' : 'multiply';

  // Enhanced Inception style with morphing
  if (style === 'inception') {
    const layers = [
      { scale: 1, opacity: 0.9, delay: 0, rotation: 0 },
      { scale: 1.8, opacity: 0.7, delay: 0.05, rotation: 45 },
      { scale: 2.6, opacity: 0.5, delay: 0.1, rotation: -45 },
      { scale: 3.4, opacity: 0.3, delay: 0.15, rotation: 90 },
      { scale: 4.2, opacity: 0.1, delay: 0.2, rotation: -90 },
    ];

    return (
      <>
        {/* Multiple layered cursors with morphing */}
        {layers.map((layer, index) => (
          <motion.div
            key={`layer-${index}`}
            className="fixed pointer-events-none z-40"
            style={{
              x: springX,
              y: springY,
              mixBlendMode,
            }}
            animate={{
              scale: isHovering ? layer.scale * 1.3 : layer.scale,
              rotate: hoverType === 'button' ? layer.rotation + 180 : layer.rotation,
            }}
            transition={{
              scale: { duration: 0.3 },
              rotate: { duration: 0.5 },
            }}
          >
            <motion.div
              className="relative"
              style={{
                width: 24,
                height: 24,
                marginLeft: -12,
                marginTop: -12,
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                rotate: {
                  duration: 8 + index * 2,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {/* Morphing shape based on hover type */}
              <motion.div
                className="absolute inset-0"
                style={{
                  border: `1px solid ${cursorColor}`,
                  opacity: layer.opacity,
                }}
                animate={{
                  borderRadius: hoverType === 'link' ? '50%' :
                    hoverType === 'button' ? '25%' :
                      hoverType === 'input' ? '10%' : '0%',
                  rotate: index * 15,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Inner geometric patterns */}
              {index < 3 && (
                <>
                  <motion.div
                    className="absolute inset-2"
                    style={{
                      border: `1px solid ${cursorColor}`,
                      opacity: layer.opacity * 0.6,
                    }}
                    animate={{
                      rotate: [-360, 0],
                      scale: [1, 1.2, 1],
                      borderRadius: hoverType === 'link' ? '50%' : '0%',
                    }}
                    transition={{
                      rotate: {
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />

                  {/* Floating particles */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {[0, 120, 240].map((angle) => (
                      <motion.div
                        key={angle}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: cursorColor,
                          left: '50%',
                          top: '50%',
                          marginLeft: -0.5,
                          marginTop: -0.5,
                        }}
                        animate={{
                          x: Math.cos((angle * Math.PI) / 180) * 10,
                          y: Math.sin((angle * Math.PI) / 180) * 10,
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        ))}

        {/* Center morphing core */}
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            x: springX,
            y: springY,
            marginLeft: -4,
            marginTop: -4,
            mixBlendMode,
          }}
        >
          <motion.div
            className="w-2 h-2"
            style={{ backgroundColor: cursorColor }}
            animate={{
              scale: isHovering ? [1, 1.8, 1] : 1,
              borderRadius: hoverType === 'link' ? '50%' :
                hoverType === 'button' ? '25%' : '0%',
            }}
            transition={{
              scale: { duration: 0.5, repeat: isHovering ? Infinity : 0 },
              borderRadius: { duration: 0.3 },
            }}
          />
        </motion.div>

        {/* Dynamic particle trail */}
        <AnimatePresence>
          {isHovering && [...Array(8)].map((_, i) => (
            <motion.div
              key={`trail-${i}`}
              className="fixed w-1 h-1 rounded-full pointer-events-none z-30"
              style={{
                backgroundColor: cursorColor,
                x: springX,
                y: springY,
                mixBlendMode,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.6, 0],
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>
      </>
    );
  }

  if (style === 'neural') {
    // Neural network inspired cursor
    const nodes = Array.from({ length: 12 }, (_, i) => ({
      angle: (i * 30),
      distance: isHovering ? 35 : 20,
      size: Math.random() * 3 + 1,
    }));

    return (
      <>
        {/* Neural connections */}
        <svg
          className="fixed pointer-events-none z-30"
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            mixBlendMode,
          }}
        >
          {nodes.map((node, i) => {
            const nextNode = nodes[(i + 1) % nodes.length];
            const x1 = springX.get() + Math.cos((node.angle * Math.PI) / 180) * node.distance;
            const y1 = springY.get() + Math.sin((node.angle * Math.PI) / 180) * node.distance;
            const x2 = springX.get() + Math.cos((nextNode.angle * Math.PI) / 180) * nextNode.distance;
            const y2 = springY.get() + Math.sin((nextNode.angle * Math.PI) / 180) * nextNode.distance;

            return (
              <motion.line
                key={`neural-line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={cursorColor}
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  pathLength: { duration: 2, repeat: Infinity },
                  opacity: { duration: 2, repeat: Infinity, delay: i * 0.1 },
                }}
              />
            );
          })}
        </svg>

        {/* Neural nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={`node-${i}`}
            className="fixed rounded-full pointer-events-none z-40"
            style={{
              width: node.size * 2,
              height: node.size * 2,
              backgroundColor: cursorColor,
              x: springX,
              y: springY,
              marginLeft: -node.size,
              marginTop: -node.size,
              mixBlendMode,
            }}
            animate={{
              x: Math.cos((node.angle * Math.PI) / 180) * node.distance,
              y: Math.sin((node.angle * Math.PI) / 180) * node.distance,
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20 },
              y: { type: "spring", stiffness: 100, damping: 20 },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.05 },
              opacity: { duration: 2, repeat: Infinity, delay: i * 0.05 },
            }}
          />
        ))}

        {/* Core processor */}
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            x: springX,
            y: springY,
            mixBlendMode,
          }}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="w-6 h-6 rounded-full"
              style={{
                backgroundColor: cursorColor,
                marginLeft: -12,
                marginTop: -12,
              }}
              animate={{
                scale: isHovering ? [1, 1.3, 1] : 1,
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />

            {/* Inner pulse */}
            <motion.div
              className="absolute inset-1 rounded-full"
              style={{
                backgroundColor: isDarkBackground ? 'black' : 'white',
              }}
              animate={{
                scale: [0.5, 0.8, 0.5],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </>
    );
  }

  if (style === 'quantum') {
    // Quantum-inspired cursor with uncertainty principle
    const quantumStates = Array.from({ length: 5 }, (_, i) => ({
      offset: i * 72,
      phase: Math.random() * Math.PI * 2,
    }));

    return (
      <>
        {/* Quantum probability clouds */}
        {quantumStates.map((state, i) => (
          <motion.div
            key={`quantum-${i}`}
            className="fixed pointer-events-none z-40"
            style={{
              x: springX,
              y: springY,
              mixBlendMode,
            }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: state.offset,
                scale: [1, 1.5, 1],
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                },
              }}
            >
              <motion.div
                className="w-8 h-8 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${cursorColor}40 0%, transparent 70%)`,
                  marginLeft: -16,
                  marginTop: -16,
                }}
                animate={{
                  x: Math.cos(state.phase) * 10,
                  y: Math.sin(state.phase) * 10,
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  x: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                  y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                  opacity: { duration: 1.5, repeat: Infinity },
                }}
              />
            </motion.div>
          </motion.div>
        ))}

        {/* Quantum entanglement lines */}
        <svg
          className="fixed pointer-events-none z-30"
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            mixBlendMode,
          }}
        >
          {quantumStates.map((state, i) => {
            const angle = (state.offset * Math.PI) / 180;
            const radius = isHovering ? 30 : 20;

            return (
              <motion.circle
                key={`entangle-${i}`}
                cx={springX.get()}
                cy={springY.get()}
                r={radius}
                fill="none"
                stroke={cursorColor}
                strokeWidth="0.5"
                strokeDasharray="2 4"
                opacity="0.3"
                animate={{
                  r: [radius, radius + 10, radius],
                  strokeDashoffset: [0, 10],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  r: { duration: 2, repeat: Infinity, delay: i * 0.1 },
                  strokeDashoffset: { duration: 5, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 2, repeat: Infinity, delay: i * 0.1 },
                }}
              />
            );
          })}
        </svg>

        {/* Quantum core with superposition */}
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            x: springX,
            y: springY,
            mixBlendMode,
          }}
        >
          <motion.div
            className="relative w-4 h-4"
            style={{
              marginLeft: -8,
              marginTop: -8,
            }}
          >
            {/* Superposition states */}
            {[0, 1, 2].map((state) => (
              <motion.div
                key={`super-${state}`}
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: cursorColor,
                }}
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: state * 120,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: state * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Uncertainty particles */}
        <AnimatePresence>
          {isHovering && [...Array(6)].map((_, i) => (
            <motion.div
              key={`uncertain-${i}`}
              className="fixed w-1 h-1 rounded-full pointer-events-none z-35"
              style={{
                backgroundColor: cursorColor,
                x: springX,
                y: springY,
                mixBlendMode,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                x: (Math.random() - 0.5) * 60,
                y: (Math.random() - 0.5) * 60,
                scale: [0, 1, 0],
                opacity: [0, 0.7, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>
      </>
    );
  }

  // Enhanced vortex style
  if (style === 'vortex') {
    const vortexLayers = [
      { radius: 15, speed: 3, particles: 6 },
      { radius: 25, speed: -5, particles: 8 },
      { radius: 35, speed: 7, particles: 10 },
    ];

    return (
      <>
        {vortexLayers.map((layer, layerIndex) => (
          <motion.div
            key={`vortex-layer-${layerIndex}`}
            className="fixed pointer-events-none z-40"
            style={{
              x: springX,
              y: springY,
              mixBlendMode,
            }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{
                duration: Math.abs(layer.speed),
                repeat: Infinity,
                ease: "linear",
                direction: layer.speed < 0 ? "reverse" : "normal",
              }}
            >
              {Array.from({ length: layer.particles }, (_, i) => {
                const angle = (i * 360) / layer.particles;
                return (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      x: Math.cos((angle * Math.PI) / 180) * layer.radius,
                      y: Math.sin((angle * Math.PI) / 180) * layer.radius,
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: cursorColor,
                        marginLeft: -4,
                        marginTop: -4,
                      }}
                      animate={{
                        scale: [0.5, 1, 0.5],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ))}

        {/* Vortex center with morphing shape */}
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            x: springX,
            y: springY,
            mixBlendMode,
          }}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: -720,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="w-6 h-6"
              style={{
                backgroundColor: cursorColor,
                marginLeft: -12,
                marginTop: -12,
              }}
              animate={{
                borderRadius: hoverType === 'link' ? '50%' :
                  hoverType === 'button' ? '30%' :
                    hoverType === 'input' ? '20%' : '10%',
                scale: isHovering ? [1, 1.4, 1] : 1,
              }}
              transition={{
                borderRadius: { duration: 0.3 },
                scale: { duration: 0.8, repeat: isHovering ? Infinity : 0 },
              }}
            />
          </motion.div>
        </motion.div>

        {/* Spiral trail effect */}
        <AnimatePresence>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`spiral-${i}`}
              className="fixed pointer-events-none z-35"
              style={{
                x: springX,
                y: springY,
                mixBlendMode,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 3],
                opacity: [0, 0.5, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  border: `1px solid ${cursorColor}`,
                  marginLeft: -8,
                  marginTop: -8,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </>
    );
  }

  // Enhanced ripple style
  if (style === 'ripple') {
    return (
      <>
        {/* Multi-layered ripples */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`ripple-${i}`}
            className="fixed rounded-full pointer-events-none z-40"
            style={{
              x: springX,
              y: springY,
              mixBlendMode,
            }}
          >
            <motion.div
              className="rounded-full"
              style={{
                border: `${1 + i * 0.5}px solid ${cursorColor}`,
              }}
              animate={{
                width: [20, 80 + i * 20, 20],
                height: [20, 80 + i * 20, 20],
                marginLeft: [-10, -40 - i * 10, -10],
                marginTop: [-10, -40 - i * 10, -10],
                opacity: [0.8 - i * 0.1, 0, 0.8 - i * 0.1],
                borderRadius: hoverType === 'button' ? '30%' : '50%',
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>
        ))}

        {/* Morphing core */}
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            x: springX,
            y: springY,
            mixBlendMode,
          }}
        >
          <motion.div
            style={{
              backgroundColor: cursorColor,
            }}
            animate={{
              width: isHovering ? [16, 24, 16] : 16,
              height: isHovering ? [16, 24, 16] : 16,
              marginLeft: isHovering ? [-8, -12, -8] : -8,
              marginTop: isHovering ? [-8, -12, -8] : -8,
              borderRadius: hoverType === 'link' ? '50%' :
                hoverType === 'button' ? '30%' :
                  hoverType === 'input' ? '20%' : '40%',
            }}
            transition={{
              duration: 0.8,
              repeat: isHovering ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Splash particles on hover */}
        <AnimatePresence>
          {isHovering && [...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            return (
              <motion.div
                key={`splash-${i}`}
                className="fixed w-2 h-2 rounded-full pointer-events-none z-45"
                style={{
                  backgroundColor: cursorColor,
                  x: springX,
                  y: springY,
                  mixBlendMode,
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  x: Math.cos(angle) * 40,
                  y: Math.sin(angle) * 40,
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </AnimatePresence>
      </>
    );
  }

  // Enhanced constellation style (default)
  const constellationNodes = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30),
    distance: isHovering ? 45 : 30,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 0.5,
  }));

  return (
    <>
      {/* Dynamic constellation connections */}
      <svg
        className="fixed pointer-events-none z-30"
        style={{
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          mixBlendMode,
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {constellationNodes.map((node, i) => {
          const connections = [
            (i + 1) % constellationNodes.length,
            (i + 3) % constellationNodes.length,
            (i + 5) % constellationNodes.length,
          ];

          return connections.map((targetIndex) => {
            const targetNode = constellationNodes[targetIndex];
            const x1 = springX.get() + Math.cos((node.angle * Math.PI) / 180) * node.distance;
            const y1 = springY.get() + Math.sin((node.angle * Math.PI) / 180) * node.distance;
            const x2 = springX.get() + Math.cos((targetNode.angle * Math.PI) / 180) * targetNode.distance;
            const y2 = springY.get() + Math.sin((targetNode.angle * Math.PI) / 180) * targetNode.distance;

            return (
              <motion.line
                key={`line-${i}-${targetIndex}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={cursorColor}
                strokeWidth="0.5"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 3,
                  delay: node.delay + i * 0.05,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          });
        })}
      </svg>

      {/* Constellation nodes */}
      {constellationNodes.map((node, i) => (
        <motion.div
          key={`const-node-${i}`}
          className="fixed rounded-full pointer-events-none z-40"
          style={{
            x: springX,
            y: springY,
            mixBlendMode,
          }}
        >
          <motion.div
            className="relative"
            animate={{
              x: Math.cos((node.angle * Math.PI) / 180) * node.distance,
              y: Math.sin((node.angle * Math.PI) / 180) * node.distance,
            }}
            transition={{
              x: { type: "spring", stiffness: 100, damping: 30 },
              y: { type: "spring", stiffness: 100, damping: 30 },
            }}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: node.size * 4,
                height: node.size * 4,
                backgroundColor: cursorColor,
                marginLeft: -node.size * 2,
                marginTop: -node.size * 2,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 2 + node.delay,
                repeat: Infinity,
                delay: node.delay,
                ease: "easeInOut",
              }}
            />

            {/* Node glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: cursorColor,
                filter: 'blur(4px)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2 + node.delay,
                repeat: Infinity,
                delay: node.delay,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Central hub with morphing capabilities */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          x: springX,
          y: springY,
          mixBlendMode,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: isHovering ? 360 : 0,
          }}
          transition={{
            duration: 2,
            ease: "linear",
          }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 24,
              height: 24,
              border: `2px solid ${cursorColor}`,
              marginLeft: -12,
              marginTop: -12,
            }}
            animate={{
              scale: isHovering ? [1, 1.3, 1] : 1,
              borderRadius: hoverType === 'link' ? '50%' :
                hoverType === 'button' ? '30%' :
                  hoverType === 'input' ? '20%' : '50%',
            }}
            transition={{
              scale: { duration: 1, repeat: isHovering ? Infinity : 0 },
              borderRadius: { duration: 0.3 },
            }}
          />

          {/* Inner core */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: cursorColor,
              left: '50%',
              top: '50%',
              marginLeft: -4,
              marginTop: -4,
            }}
            animate={{
              scale: [1, 0.6, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Rotating satellites */}
          {hoverType !== 'default' && [0, 120, 240].map((angle) => (
            <motion.div
              key={`satellite-${angle}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: cursorColor,
                left: '50%',
                top: '50%',
                marginLeft: -1,
                marginTop: -1,
              }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 15,
                y: Math.sin((angle * Math.PI) / 180) * 15,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: angle / 240,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Energy burst on interaction */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed pointer-events-none z-35"
            style={{
              x: springX,
              y: springY,
              mixBlendMode,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const distance = 60;

              return (
                <motion.div
                  key={`burst-${i}`}
                  className="absolute w-1 h-4 rounded-full"
                  style={{
                    backgroundColor: cursorColor,
                    left: '50%',
                    top: '50%',
                    marginLeft: -0.5,
                    marginTop: -2,
                    transformOrigin: 'center',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    rotate: (i * 30) + 90,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover type indicator */}
      <AnimatePresence>
        {hoverType !== 'default' && (
          <motion.div
            className="fixed pointer-events-none z-55"
            style={{
              x: springX,
              y: springY,
              marginLeft: 20,
              marginTop: -10,
              mixBlendMode,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div
              className="px-2 py-1 rounded text-xs font-mono"
              style={{
                backgroundColor: cursorColor,
                color: isDarkBackground ? 'black' : 'white',
              }}
            >
              {hoverType}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MouseFollower;