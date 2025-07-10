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

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Container with responsive margins */}
      <div className="mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 2xl:mx-20">
        {/* 00 Header - Full width */}
        <Header />

        {/* Main Content Grid */}
        <div className="">
          {/* Row 1: Me1 + Me2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-t border-gray-200">
            <div className="md:col-span-1 lg:col-span-3 border-b md:border-b lg:border-b-0 md:border-r border-gray-200">
              <Me1 />
            </div>
            <div className="md:col-span-1 lg:col-span-2 border-b md:border-b-0 border-gray-200">
              <Me2 />
            </div>
          </div>

          {/* Row 2: About + Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 border-t border-gray-200">
            <div className="md:col-span-1 lg:col-span-3 border-b md:border-b lg:border-b-0 md:border-r border-gray-200">
              <About />
            </div>
            <div className="md:col-span-1 lg:col-span-5 border-b md:border-b-0 border-gray-200">
              <Projects />
            </div>
          </div>

          {/* Row 3: Skills - Full width */}
          <div className="border-t border-gray-200">
            <Skills />
          </div>

          {/* Row 4: Contact1 + Contact2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 border-t border-gray-200">
            <div className="border-b sm:border-b-0 sm:border-r border-gray-200">
              <Contact1 />
            </div>
            <div>
              <Contact2 />
            </div>
          </div>
        </div>

        {/* Footer - Full width */}
        <div className="border-t border-gray-200">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;