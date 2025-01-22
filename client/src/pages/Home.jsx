// Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import BlogList from "../components/BlogList";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  return (
    <div className="min-h-screen m-4 w-4/5 mx-auto">
      {/* Hero Section */}
      <section className="text-white py-20 min-h-screen pt-36">
        <div className="container  mx-auto px-4 m-8">
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
            on a journey to learn and build innovative software solutions, with
            a focus on crafting dynamic and user-friendly experiences.
          </p>
        </div>
        <div className="h-1 mt-28 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-content rounded-md "></div>
      </section>

      {/* About Section */}
      <section className="text-white py-14 min-h-screen">
        <div className="container mx-auto  m-8 flex gap-24 items-start tart px-24">

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
                I'm a Computer Science Engineering student at Lovely
                Professional University, navigating through my 6th semester in
                the vibrant state of Punjab. While my roots trace back to the
                town city Paratwada, Maharashtra, my goal is to be a Full Stack
                Developer.
              </p>

              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                My Journey so Far:
              </h2>

              <ul className="space-y-4 text-lg">
                <li className="flex items-center space-x-2">
                  <span className="text-purple-500">▹</span>
                  <span>
                    Got my hands dirty with Stacks like MERN and MEAN.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-500">▹</span>
                  <span>
                    Building projects that challenge my skills and creativity.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-500">▹</span>
                  <span>
                    Though it's not easy with blank mind at end of day.
                  </span>
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
        <div className="grid mx-auto px-4 m-8">
          <h2 className="text-3xl font-bold text-center mb-12">My Skills</h2>
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-md">
            <h2 className="text-2xl">Programming Languages</h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl">C/C++</h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl">Java</h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl">JavaScript</h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl">Python</h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl">Frontend</h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl"></h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl"></h2>   
          </div>
          
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl"></h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl"></h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl"></h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl"></h2>   
          </div>
          <div className="min-w-40 max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-md">
            <h2 className="text-2xl"></h2>   
          </div>
        </div>
      </section>

      {/* Skills Section */}
<section className="text-white py-14 min-h-screen">
  <div className="grid gap-6 mx-auto px-4 m-8">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
      My Skills
    </h2>

    {/* Programming Languages */}
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Programming Languages</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">C/C++</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Java</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">JavaScript</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Python</span>
      </div>
    </div>

    {/* Frontend Development */}
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Frontend Development</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">HTML5</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">CSS3</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">JavaScript</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">React.js</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Tailwind CSS</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Bootstrap</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Material UI</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Redux</span>
      </div>
    </div>

    {/* Backend Development */}
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Backend Development</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Node.js</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Express.js</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">MongoDB</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">MySQL</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">REST APIs</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Firebase</span>
      </div>
    </div>

    {/* Tools & Technologies */}
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Tools & Technologies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Git</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">GitHub</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">VS Code</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Postman</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">npm</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Webpack</span>
      </div>
    </div>

    {/* Currently Learning */}
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-cyan-600 to-indigo-500 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Currently Learning</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">TypeScript</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Next.js</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">Docker</span>
        <span className="px-4 py-2 bg-white/10 rounded-lg text-center hover:bg-white/20 transition-all">AWS</span>
      </div>
    </div>
  </div>
</section>

{/* Skills Section */}
<section className="text-white py-14 min-h-screen relative overflow-hidden">
  {/* Floating Background SVGs */}
  <div className="absolute inset-0 -z-10">
    {/* Add multiple tech SVGs with different sizes and animations */}
    <div className="absolute top-20 left-10 opacity-10 animate-float">
      <img src="/react.svg" className="w-24 h-24" />
    </div>
    <div className="absolute top-40 right-20 opacity-10 animate-float-delayed">
      <img src="/nodejs.svg" className="w-32 h-32" />
    </div>
    <div className="absolute bottom-20 left-1/4 opacity-10 animate-float">
      <img src="/javascript.svg" className="w-20 h-20" />
    </div>
    {/* Add more floating icons as needed */}
  </div>

  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
      Tech Stack
    </h2>

    {/* Pinterest-style Grid */}
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {/* Each card has different heights */}
      
      {/* React Card */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
      <iframe className="w-24 h-24" src="https://lottie.host/embed/31cc650e-0bf1-4897-a14c-6c87c8601d63/e0tqG9uqvL.lottie"></iframe>
        <h3 className="text-xl font-semibold text-center mb-2">React</h3>
        <p className="text-sm text-gray-400 text-center">Frontend Development</p>
      </div>
      {/* Angular Card */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
      <iframe src="https://lottie.host/embed/9e110ead-fe06-47cf-9c2c-69708646ebf1/i14Qdy8mWl.lottie"></iframe>
        <h3 className="text-xl font-semibold text-center mb-2">React</h3>
        <p className="text-sm text-gray-400 text-center">Frontend Development</p>
      </div>

      {/* Node.js Card - Taller */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
        <img src="src/assets/node-js.svg" className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-center mb-2">Node.js</h3>
        <p className="text-sm text-gray-400 text-center">Backend Development</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs">Express</span>
          <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs">REST APIs</span>
        </div>
      </div>
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
        <img src="src/assets/express-svgrepo-com.png" className="w-16 h-16 mx-auto mb-4" />
        
        <h3 className="text-xl font-semibold text-center mb-2">Node.js</h3>
        <p className="text-sm text-gray-400 text-center">Backend Development</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs">Express</span>
          <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs">REST APIs</span>
        </div>
      </div>

      {/* MongoDB Card */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
      <iframe src="https://lottie.host/embed/65dbcd35-959d-4d11-b7b7-65d18f5540a7/lm0xRqXEZG.lottie"></iframe>
        <h3 className="text-xl font-semibold text-center mb-2">MongoDB</h3>
        <p className="text-sm text-gray-400 text-center">Database</p>
      </div>
      {/* BootStrap Card */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
        <img src="src/assets/bootsrap.svg" className="w-24 h-24 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-center mb-2">BootStrap</h3>
        <p className="text-sm text-gray-400 text-center">Database</p>
      </div>
      {/* HTML Card */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
      <iframe src="https://lottie.host/embed/0a5c1d7d-5780-447f-a07d-a7326ae9a697/QSjJ7m58yV.lottie"></iframe>
        <h3 className="text-xl font-semibold text-center mb-2">HTML5</h3>
        <p className="text-sm text-gray-400 text-center">Database</p>
      </div>
      {/* CSS Card */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
      <iframe src="https://lottie.host/embed/9672f1dd-fb70-4e1c-b81a-617d308b6d5d/sctkkVcDwp.lottie"></iframe>
        <h3 className="text-xl font-semibold text-center mb-2">CSS</h3>
        <p className="text-sm text-gray-400 text-center">Database</p>
      </div>

      {/* Tailwind CSS Card - Taller */}
      <div className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm">
        <img src="/tailwind.svg" className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-center mb-2">Tailwind CSS</h3>
        <p className="text-sm text-gray-400 text-center">Styling</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">Responsive</span>
          <span className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">Utility-First</span>
        </div>
      </div>

      {/* Add more cards for other technologies */}
    </div>
  </div>
</section>
      {/* <section className="py-20 min-h-screen text-white">
        <div className="container mx-auto flex justify-items-start">
          <img src="src/assets/vedant.png" alt="Vedant" className="w-64 h-auto rounded-xl -rotate-12 hover:rotate-0 transition-all duration-300 mx-28" />
          <div className="max-w-2xl justify-start">
            <h1 className="text-xl">Hello Again!!!</h1>
            <h2 className="text-xl">Let me tell you my story</h2>
            <p className="text-lg">
              I'm a Computer Science Engineering student at Lovely
              Professional University, navigating through my 6th semester in the
              vibrant state of Punjab. While my roots trace back to the town city Paratwada, Maharashtra, my goal is to be a Full Stack Developer.
            </p>
            <h2 className="text-xl">My Journey so Far:</h2>
            <p>
              Got my hands dirty with Stacks like MERN and MEAN.
              <br />
              Building projects that challenge my skills and creativity.
              though its not easy with blank mind at end of day.
              <br />
              Learning something new every single day.
            </p>
          </div>
          {/* <p>
          Hello Again! 👋

Let me tell you my story...

I'm a passionate Computer Science Engineering student at Lovely Professional University, navigating through my 6th semester in the vibrant state of Punjab. While my roots trace back to the quaint town of Paratwada, Maharashtra, my ambitions reach far into the digital frontier.
My Journey So Far:
• Currently mastering the intricacies of Computer Science Engineering
• Building projects that challenge my skills and creativity
• Collaborating with fellow tech enthusiasts
• Learning something new every single day
          </p> 
        </div>
      </section> */}

      {/* About Section
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 leading-relaxed mb-6">
              I'm a passionate full-stack developer with experience in building
              web applications using modern technologies. I love solving complex
              problems and creating user-friendly experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {Object.entries(skills).map(([category, skillList]) => (
                <div
                  key={category}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-semibold mb-4 capitalize">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {skillList.map((skill) => (
                      <li key={skill} className="text-gray-600">
                        • {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Projects Section
      <section className="py-20" id="projects">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Project →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest Blog Posts
          </h2>
          <BlogList />
          <div className="text-center mt-8">
            <Link to="/blog" className="text-blue-600 hover:text-blue-800">
              View All Posts →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and
            opportunities.
          </p>
          <Link
            to="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
