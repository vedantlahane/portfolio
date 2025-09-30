import React from "react";

// Component Imports: Grouping imports makes it easy to see all the section components at a glance.
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
import AuroraBackground from "./components/ui/AuroraBackground";
import ScrollProgressBar from "./components/ui/ScrollProgressBar";

/**
 * App Component
 * * This is the main component that serves as the root of the application.
 * It orchestrates the overall layout of the portfolio website, arranging various sections 
 * in a responsive grid system.
 * * The layout is built using Tailwind CSS and is designed to be mobile-first,
 * featuring a distinct and modern bordered-grid style.
 */
function App() {
  return (
    // The root container for the entire application.
    // `min-h-screen` ensures it takes at least the full viewport height.
    // `bg-white` and `font-sans` set the default background and font family.
    <div className="relative min-h-screen font-sans text-gray-900 antialiased">
      <AuroraBackground />
      <ScrollProgressBar />

      <div className="hidden lg:block">
        <MouseFollowerAdvanced />
      </div>

      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          <header>
            <Header />
          </header>

          <main className="mt-10 lg:mt-12 space-y-12 lg:space-y-20">

          {/* --- Section 1: Introduction (Me1 + Me2) --- */}
          {/* This grid contains the main introductory elements. */}
          {/* It's a single column on mobile and a 5-column grid on large screens. */}
          <div className="grid grid-cols-1 lg:grid-cols-5 border-t border-gray-200">
            
            {/* Me1 Component (Left/Top) */}
            {/* Spans 3 of 5 columns on large screens. */}
            {/* `lg:border-r` separates it from Me2 on large screens. */}
            {/* `border-b lg:border-b-0` creates a bottom border only on mobile. */}
            <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[60vh]">
              <Me1 />
            </div>

            {/* Me2 Component (Right/Bottom) */}
            {/* Spans 2 of 5 columns on large screens. */}
            <div className="col-span-1 lg:col-span-2 min-h-[60vh]">
              <Me2 />
            </div>
          </div>

          {/* --- Section 2: About & Projects --- */}
          {/* `id="about"` allows for direct navigation (e.g., yoursite.com#about). */}
          {/* `scroll-mt-20` adds a top margin when scrolling to this ID, preventing the content from being hidden by a sticky header. */}
          <section id="about" className="scroll-mt-20">
            {/* This grid is an 8-column layout on large screens. */}
            <div className="grid grid-cols-1 lg:grid-cols-8 border-t border-gray-200">

              {/* About Component (Left/Top) */}
              <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 min-h-[70vh]">
                <About />
              </div>

              {/* Projects Component (Right/Bottom) */}
              <div id="projects" className="col-span-1 lg:col-span-5 min-h-[70vh] scroll-mt-20">
                <Projects />
              </div>
            </div>
          </section>

          {/* --- Section 3: Skills --- */}
          <section id="skills" className="border-t border-gray-200 scroll-mt-20">
            {/* This section contains the Skills component with vertical padding for spacing. */}
            <div className="py-16 lg:py-24">
              <Skills />
            </div>
          </section>

          {/* --- Section 4: Contact --- */}
          <section id="contact" className="scroll-mt-20">
            {/* A 2-column layout on small screens and up, stacking on extra-small screens. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-gray-200">
              
              {/* Contact1 Component (Left/Top) */}
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 min-h-[50vh]">
                <Contact1 />
              </div>

              {/* Contact2 Component (Right/Bottom) */}
              <div className="min-h-[50vh]">
                <Contact2 />
              </div>
            </div>
          </section>

          </main>

          <footer className="border-t border-gray-200 mt-12 lg:mt-20">
            <div className="py-6 lg:py-8">
              <Footer />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
