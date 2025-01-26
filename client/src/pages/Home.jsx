// Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen m-4 w-4/5 mx-auto">
      /* Hero Section */
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="break-inside-avoid...."
      >
        <section className="text-white py-20 min-h-screen pt-36">
          <div className="container mx-auto px-4 m-8">
            <div className="flex items-center space-x-2 mb-3">
              <h1 className="text-4xl font-semibold">Hey, there</h1>
              <img
                className="size-14"
                src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
                alt="waving-hand-light-skin-tone"
              />
            </div>
            <div className="flex space-x-5 items-baseline mb-2">
              <h1 className="text-7xl font-extrabold bg-gradient-to-r from-slate-500 to-gray-700 bg-clip-text text-transparent">
                I'm
              </h1>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Vedant Lahane
              </h1>
            </div>

            <p className="text-6xl font-bold mb-8">
              an aspiring software engineer
            </p>

            <p className="max-w-2xl text-2xl font-medium mb-8">
              on a journey to learn and build innovative software solutions,
              with a focus on crafting dynamic and user-friendly experiences.
            </p>
          </div>
          <div className="h-1 mt-36 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-content rounded-md "></div>
        </section>
      </motion.div>

      {/* About Section */}
      <section className="text-white py-8 min-h-screen">
        <div className="container mx-auto flex gap-24 items-start tart px-24">
          {/* Image Section */}
          <img
            src="src/assets/vedant.png"
            alt="Vedant"
            className="w-64 h-auto rounded-xl -rotate-12 hover:rotate-0 transition-all duration-300 mt-20"
          />

          {/* Text Content Section */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <h1 className="text-4xl font-semibold">Hello Again !!</h1>
              <img
                className="size-14"
                src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
                alt="waving-hand-light-skin-tone"
              />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
              Let me tell you my story...
            </h2>

            <p className="text-xl font-medium mb-8 leading-relaxed">
              I'm a Computer Science Engineering student at Lovely Professional
              University, navigating through my 6th semester in the vibrant
              state of Punjab. While my roots trace back to the town city
              Paratwada, Maharashtra, my goal is to be a Full Stack Developer.
            </p>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
              My Journey so Far:
            </h2>

            <ul className="space-y-4 text-lg">
              <li className="flex items-center space-x-2">
                <span className="text-purple-500">▹</span>
                <span>Got my hands dirty with Stacks like MERN and MEAN.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-500">▹</span>
                <span>
                  Building projects that challenge my skills and creativity.
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-500">▹</span>
                <span>Though it's not easy with blank mind at end of day.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-500">▹</span>
                <span>Learning something new every single day.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Gradient Line */}
        <div className="h-1 mt-28 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-content rounded-md"></div>
      </section>

      {/* Skills Section */}
      <section className="text-white py-14 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex space-x-5 items-baseline mb-10">
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-slate-500 to-gray-700 bg-clip-text text-transparent">
              My
            </h1>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Tech Stack
            </h1>
          </div>

          {/* Cards Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {/* React Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center">
              <iframe
                className="w-28 h-28 mb-4 m-2"
                src="https://lottie.host/embed/31cc650e-0bf1-4897-a14c-6c87c8601d63/e0tqG9uqvL.lottie"
              ></iframe>
              <h3 className="text-xl font-semibold text-center mb-2">React</h3>
              <p className="text-sm text-gray-400 text-center">
                Frontend Development
              </p>
            </div>

            {/* Node.js Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
              <img
                src="src/assets/node-js.svg"
                className="w-32 h-28 mx-auto mb-4"
                alt="Node.js"
              />
              <h3 className="text-xl font-semibold text-center mb-2">
                Node.js
              </h3>
              <p className="text-sm text-gray-400 text-center">
                Backend Development
              </p>
            </div>

            {/* Tailwind CSS Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
              <img
                src="https://img.icons8.com/color/480/tailwindcss.png"
                className="w-16 h-16 mx-auto mb-4"
                alt="Tailwind CSS"
              />
              <h3 className="text-xl font-semibold text-center mb-2">
                Tailwind CSS
              </h3>
              <p className="text-sm text-gray-400 text-center">Styling</p>
            </div>

            {/* PHP Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
              <img
                src="https://img.icons8.com/ios-filled/100/php.png"
                className="w-36 mx-auto mb-4"
                alt="PHP"
              />
              <h3 className="text-xl font-semibold text-center mb-2">PHP</h3>
              <p className="text-sm text-gray-400 text-center">
                Backend Development
              </p>
            </div>

            {/* Angular Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center">
              <iframe
                className="w-36 h-36 mb-4 m-2"
                src="https://lottie.host/embed/9e110ead-fe06-47cf-9c2c-69708646ebf1/i14Qdy8mWl.lottie"
              ></iframe>
              <h3 className="text-xl font-semibold text-center mb-2">
                Angular
              </h3>
              <p className="text-sm text-gray-400 text-center">
                Frontend Development
              </p>
            </div>

            {/* Express Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
              <img
                src="https://img.icons8.com/fluency/240/express-js.png"
                className="w-28 mx-auto mb-4"
                alt="Express.js"
              />
              <h3 className="text-xl font-semibold text-center mb-2">
                Express.js
              </h3>
              <p className="text-sm text-gray-400 text-center">
                Backend Development
              </p>
            </div>

            {/* MongoDB Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center">
              <iframe
                className="w-36 h-36 m-2 mb-0"
                src="https://lottie.host/embed/65dbcd35-959d-4d11-b7b7-65d18f5540a7/lm0xRqXEZG.lottie"
              ></iframe>
              <h3 className="text-xl font-semibold text-center mb-2">
                MongoDB
              </h3>
              <p className="text-sm text-gray-400 text-center">Database</p>
            </div>

            {/* Bootstrap Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
              <img
                src="src/assets/bootsrap.svg"
                className="w-28 h-28 mx-auto mb-4"
                alt="Bootstrap"
              />
              <h3 className="text-xl font-semibold text-center mb-2">
                Bootstrap
              </h3>
              <p className="text-sm text-gray-400 text-center">Styling</p>
            </div>

            {/* HTML Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center">
              <iframe
                className="w-36 h-36 mb-0"
                src="https://lottie.host/embed/0a5c1d7d-5780-447f-a07d-a7326ae9a697/QSjJ7m58yV.lottie"
              ></iframe>
              <h3 className="text-xl font-semibold text-center mb-2">HTML5</h3>
              <p className="text-sm text-gray-400 text-center">
                Markup Language
              </p>
            </div>

            {/* CSS Card */}
            <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center">
              <iframe
                className="w-40 h-40 m-2 mb-0"
                src="https://lottie.host/embed/9672f1dd-fb70-4e1c-b81a-617d308b6d5d/sctkkVcDwp.lottie"
              ></iframe>
              <h3 className="text-xl font-semibold text-center mb-2">CSS</h3>
              <p className="text-sm text-gray-400 text-center">Styling</p>
            </div>

            {/* Python Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="break-inside-avoid..."
            >
              <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
                <img
                  src="https://img.icons8.com/color/480/python.png"
                  className="w-28 h-28 mx-auto mb-4"
                  alt="Python"
                />
                <h3 className="text-xl font-semibold text-center mb-2">
                  Python
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Backend & Data Science
                </p>
              </div>
            </motion.div>

            {/* Java Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="break-inside-avoid..."
            >
              <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
                <img
                  src="https://img.icons8.com/color/480/java-coffee-cup-logo.png"
                  className="w-28 h-28 mx-auto mb-4"
                  alt="Java"
                />
                <h3 className="text-xl font-semibold text-center mb-2">Java</h3>
                <p className="text-sm text-gray-400 text-center">
                  Backend Development
                </p>
              </div>
            </motion.div>

            {/* C/C++ Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="break-inside-avoid..."
            >
              <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
                <img
                  src="https://img.icons8.com/color/480/c-plus-plus-logo.png"
                  className="w-28 h-28 mx-auto mb-4"
                  alt="C/C++"
                />
                <h3 className="text-xl font-semibold text-center mb-2">
                  C/C++
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Systems Programming
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Gradient Line */}
        <div className="h-1 mt-36 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-content rounded-md"></div>
      </section>
      {/* Contact CTA Section */}
      
    </div>
  );
};

export default Home;
