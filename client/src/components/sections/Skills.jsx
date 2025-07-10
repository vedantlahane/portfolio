import { useState } from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const [isPaused, setIsPaused] = useState(false);

  // All skills in one array
  const skills = [
    'Java', 'JavaScript', 'TypeScript', 'C++', 'C', 'PHP', 'SQL', 'HTML', 'CSS',
    'React.js', 'Node.js', 'Express.js', 'Angular', 'Redux', 'Laravel', 'Shadcn', 'Tailwind CSS',
    'Vite', 'Git', 'GitHub', 'Postman', 'Docker', 'Docker Compose', 'Jenkins',
    'OpenAI API', 'Gemini API', 'v0.dev', 'Vercel', 'AWS', 'Render', 'Lighthouse',
    'MongoDB', 'MySQL', 'Linux',
    'Problem-solving', 'Teamwork', 'Adaptability', 'Creativity'
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className=" py-8 md:py-12 lg:py-16 w-full relative overflow-hidden"
      role="region"
      aria-label="Technical skills"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-xs text-gray-500 font-mono uppercase tracking-wider"
        >
          05 &nbsp;&nbsp;SKILLS
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-xs text-gray-500 font-mono"
        >
          /05
        </motion.div>
      </div>

      {/* Scrolling Container */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{
            x: isPaused ? 0 : [0, -500 + '%']
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 120,
              ease: "linear",
            },
          }}
        >
          {/* First set of skills */}
          <div className="flex items-center">
            {skills.map((skill, index) => (
              <React.Fragment key={`first-${index}`}>
                <span className="text-3xl md:text-5xl lg:text-7xl font-light text-gray-900 mx-10 md:mx-14 lg:mx-18">
                  {skill}
                </span>
                {index < skills.length - 1}
              </React.Fragment>
            ))}
          </div>
          
          
          {/* Second set of skills (for seamless loop) */}
          <div className="flex items-center">
            {skills.map((skill, index) => (
              <React.Fragment key={`second-${index}`}>
                <span className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mx-8 md:mx-12 lg:mx-16">
                  {skill}
                </span>
                {index < skills.length - 1 && (
                  <span className="text-gray-400">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.section>
  );
};

export default Skills;