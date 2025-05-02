import { useEffect } from "react";
import GradientSeparator from "./GradientSeparator";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1400, once: true });
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
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Me
          </span>
        </motion.h2>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-4 md:mb-0"
          >
            <h1 className="flex items-center text-3xl sm:text-4xl font-bold space-x-2">
              <span className="bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent">hello</span>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">again,</span>
            </h1>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4 text-xl text-gray-400"
          >
            <p>
              I'm a <span className="text-blue-400 font-semibold">3rd year Computer Science and Engineering undergrad</span> at Lovely Professional University.
            </p>
            <p>
              During my first semester, I discovered <span className="text-purple-400 font-semibold">HTML, CSS, and JavaScript</span> and was amazed by the power of web development. JavaScript was a bit tough at first, but I persevered and started building projects.
            </p>
            <p>
              I also have a keen interest in <span className="text-green-400 font-semibold">Data Structures, Algorithms</span>, and <span className="text-yellow-300 font-semibold">Competitive Programming</span>-solving 300+ problems on platforms like LeetCode and GeeksforGeeks.
            </p>
            <p>
              Always eager to learn: currently exploring <span className="text-blue-400 font-semibold">Docker</span> and <span className="text-purple-400 font-semibold">Jenkins</span>.
            </p>
          </motion.div>
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
          <p className="text-xl sm:text-2xl text-gray-300 ">
            Looking for <span className="text-blue-400">internships</span> and <span className="text-purple-400">job opportunities</span> to learn and gain real-world experience.
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
    </section>
  );
};


export default AboutSection;
