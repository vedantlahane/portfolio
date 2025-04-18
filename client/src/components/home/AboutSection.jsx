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
    <section className="text-white py-12 -mx-8 sm:-mx-16">
      <div className="max-w-7xl mx-auto px-8 sm:px-16">
        {/* Vertically stacked content */}
        <div className="mb-4 space-y-10 font-extrabold text-6xl text-gray-400">
          <p>
            As a full stack developer, I believe in crafting user-centric
            experiences - whether it’s turning a wild idea into a smooth interface.
          </p>
          <h5 className="text-2xl text-blue-300">This is me</h5>
        </div>
        <hr className="border-t border-gray-700 my-8" />
        {/* Horizontally aligned last two divs */}
        <div className="flex gap-40 justify-between">
          <div>
          <h1 className="flex text-4xl space-y-3 space-x-3 font-bold">
                  <span className="bg-linear-to-r from-slate-300 to-gray-500 bg-clip-text text-transparent">hello</span>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">again,</span>
                </h1>
          </div>
          <div className="space-y-3 mb-8 text-xl text-ellipsis font-bold text-gray-400">
            <motion.p>
             I'm a 3rd year Computer Science and Engineering undergrad at Lovely Professional University. During my first semester I come across HTML, CSS and JavaScript and I was amazed by the power of web development. I started learning them (JavaScript was bit hard for me at first). Eventually i got hang on it and started building projects. Apart form web development i also have a keen interest in Data Structure and Algorithms and Competative Programming.Solved many proplems on different platforms like leetcode and Geeksforgeeks(Not keeping track but i guess over 300).
            </motion.p>
            <p>Eager to learn new things, for an instance I am currently lerning Docker and Jenkins. </p>
          </div>
        </div>
        <hr className="border-t border-gray-700 my-8" />
        <div>
        <p className="space-x-12 text-3xl text-gray-300 font-semibold">
            Looking for internships and job opportunities to learn and gain real-world experience.
          </p>
        </div>
      </div>
      {/* Separator */}
      <GradientSeparator data-aos="fade-up" />
    </section>
  );
};

export default AboutSection;
