import React from 'react';
import Header from '../components/sections/Header';
import Me1 from '../components/sections/Me1';
import Me2 from '../components/sections/Me2';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Contact1 from '../components/sections/Contact1';
import Contact2 from '../components/sections/Contact2';
import Footer from '../components/sections/Footer';
import MouseFollowerAdvanced from '../components/sections/MouseFollowerAdvanced';

const Landing = () => (
  <div className="bg-white font-sans text-gray-900">
    <div className="hidden lg:block">
      <MouseFollowerAdvanced />
    </div>

    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <header>
        <Header />
      </header>

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-5 border-t border-gray-200">
          <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[60vh]">
            <Me1 />
          </div>

          <div className="col-span-1 lg:col-span-2 min-h-[60vh]">
            <Me2 />
          </div>
        </div>

        <section id="about" className="scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-8 border-t border-gray-200">
            <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[70vh]">
              <About />
            </div>

            <div id="projects" className="col-span-1 lg:col-span-5 min-h-[70vh] scroll-mt-20">
              <Projects />
            </div>
          </div>
        </section>

        <section id="skills" className="border-t border-gray-200 scroll-mt-20">
          <div className="py-16 lg:py-24">
            <Skills />
          </div>
        </section>

        <section id="contact" className="scroll-mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-gray-200">
            <div className="border-b sm:border-b-0 sm:border-r border-gray-200 min-h-[50vh]">
              <Contact1 />
            </div>

            <div className="min-h-[50vh]">
              <Contact2 />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200">
        <div className="py-6 lg:py-8">
          <Footer />
        </div>
      </footer>
    </div>
  </div>
);

export default Landing;
