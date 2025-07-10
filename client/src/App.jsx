import React from "react";
import { motion } from "framer-motion";
import Header from "./components/sections/Header";
import Me1 from "./components/sections/Me1";
import Me2 from "./components/sections/Me2";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Contact1 from "./components/sections/Contact1";
import Contact2 from "./components/sections/Contact2";
import Footer from "./components/sections/Footer";
import MouseFollowerAdvanced from "./components/sections/MouseFollowerAdvanced";

function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hide mouse follower on mobile */}
      <div className="hidden lg:block">
        <MouseFollowerAdvanced style=""/>
      </div>
      
      {/* Container with responsive margins - optimized for mobile */}
      <div className="mx-2 xs:mx-3 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-12 2xl:mx-20">
        {/* Header - Static at top */}
        <Header />

        {/* Main Content Grid */}
        <div className="">
          {/* Row 1: Me1 + Me2 - Stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-5 border-t border-gray-200">
            <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[50vh] lg:min-h-[60vh]">
              <Me1 />
            </div>
            <div className="col-span-1 lg:col-span-2 border-b border-gray-200 min-h-[40vh] lg:min-h-[60vh]">
              <Me2 />
            </div>
          </div>

          {/* Row 2: About + Projects - Stack on mobile */}
          <div id="about" className="scroll-mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-8 border-t border-gray-200">
              <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[50vh] lg:min-h-[70vh]">
                <About />
              </div>
              <div id="projects" className="col-span-1 lg:col-span-5 border-b border-gray-200 min-h-[60vh] lg:min-h-[70vh] scroll-mt-20">
                <Projects />
              </div>
            </div>
          </div>

          {/* Row 3: Skills - Full width with mobile padding */}
          <div id="skills" className="border-t border-gray-200 py-8 sm:py-12 lg:py-16 scroll-mt-20">
            <Skills />
          </div>

          {/* Row 4: Contact1 + Contact2 - Stack on small mobile */}
          <div id="contact" className="scroll-mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-gray-200">
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 min-h-[40vh] sm:min-h-[50vh]">
                <Contact1 />
              </div>
              <div className="min-h-[40vh] sm:min-h-[50vh]">
                <Contact2 />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Full width with mobile padding */}
        <div className="border-t border-gray-200 py-4 sm:py-6 lg:py-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;