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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className=" mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className=" text-3xl sm:text-4xl md:text-5xl text-gray-300 leading-snug mb-2">
            As a full stack developer, I believe in crafting user-centric experiences – whether it’s turning a wild idea into a smooth interface.
          </p>
          <h5 className="text-lg sm:text-xl text-blue-300 font-semibold mt-4">This is me</h5>
        </motion.div>

        <hr className="border-t border-gray-700 my-8" />

        {/* Main Content */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-12 gap-8">
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
            className="space-y-4 text-xl sm:text-lg text-gray-300"
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

        <hr className="border-t border-gray-700 my-8" />

        {/* Call to Action */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-xl sm:text-2xl text-gray-200 ">
            Looking for <span className="text-blue-400">internships</span> and <span className="text-purple-400">job opportunities</span> to learn and gain real-world experience.
          </p>
        </motion.div>
      </div>
      <GradientSeparator data-aos="fade-up" />
    </section>
  );
};

export default AboutSection;
