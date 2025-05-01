
import { motion } from 'framer-motion';
import GradientSeparator from "./GradientSeparator";


const ProjectCard = ({ project, index }) => (
  <motion.div
    className="group bg-slate-800/50 rounded-2xl p-4 sm:p-6 border border-slate-700/50 hover:border-purple-400/30 transition-all flex flex-col h-full"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px -10px rgba(112, 26, 117, 0.3)" }}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl sm:text-2xl font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
        {project.title}
      </h3>
      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 rounded-full">
        {project.status}
      </span>
    </div>

    <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-1">
      {project.description.map((point, i) => (
        <li key={i} className="flex items-start space-x-2">
          <span className="text-purple-400 mt-1.5">▹</span>
          <span className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors">{point}</span>
        </li>
      ))}
    </ul>

    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
      {project.tech.map((tech, i) => (
        <motion.span 
          key={i}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-500/10 text-blue-300 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          {tech}
        </motion.span>
      ))}
    </div>

    <motion.a
      href={project.link}
      className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-xl transition-all w-fit mt-auto"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Source Code
      <motion.svg 
        className="w-4 h-4 ml-2"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        whileHover={{ x: 3 }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
        />
      </motion.svg>
    </motion.a>
  </motion.div>
);

const ProjectsSection = () => {
  const projects = [
    {
      title: "Blogging Platform",
      status: "Currently Working",
      description: [
        "Engineered a dynamic blogging platform using the MEAN stack",
        "Implemented robust user authentication and authorization",
        "Designed and deployed highly efficient APIs for CRUD operations",
        "Optimized platform functionality for enhanced user engagement"
      ],
      tech: ["MongoDB", "Express", "Angular", "Node.js"],
      link: "https://github.com/vedantlahane/myblog"
    },
    {
      title: "Restaurant Website",
      status: "Currently Working",
      description: [
        "Dynamic platform for efficient restaurant management",
        "Custom CMS for updating menus and restaurant details",
        "User features: menu browsing, reservations, feedback",
        "Automated 40% of administrative tasks"
      ],
      tech: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
      link: "https://github.com/vedantlahane/FoodOrderingSystem"
    },
    {
      title: "ShoeMarkNet",
      status: "Currently Working",
      description: [
        "Secure platform for reselling shoes",
        "Real-time inventory management",
        "Advanced product filtering and navigation",
        "Role-based access control and authentication"
      ],
      tech: ["React.js", "Tailwind CSS", "Node.js", "MongoDB"],
      link: "https://github.com/vedantlahane/ShoeMarkNet"
    }
  ];

  return (
    <section id="projects" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gray-300">My </span>
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 md:mt-24"
      >
        <GradientSeparator />
      </motion.div>
    </section>
  );
};


export default ProjectsSection;