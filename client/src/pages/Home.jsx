// Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import BlogList from "../components/BlogList";

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
          {/* <div className="flex justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              Contact Me
            </Link>
            <a
              href="#projects"
              className="border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Projects
            </a>
          </div> */}
          
        </div>
        <div className="h-1 mt-28 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-content rounded-md "></div>
      </section>
      
      {/* About Section */}
      <section className="py-20 min-h-screen text-white">
        <div className="container mx-auto justify-between">
          <img src="" alt="" className="size-80" />
        </div>
      </section>

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
