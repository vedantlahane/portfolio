import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-20 bg-transparent">
      {/* <div className="container mx-auto px-4 ">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gray-300">My</span>{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Journey
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-gray-300 text-lg leading-relaxed"
        >
          <p>
            I began my B.Tech in Computer Science at Lovely Professional University with a strong interest in technology, but limited hands-on experience.
            Over time, I immersed myself in development — building web apps, solving DSA problems, and exploring modern tools.
          </p>

          <p>
            My journey led me to full-stack development using the MERN and MEAN stacks. I created projects like <strong>ShoeMarkNet</strong> — a full-featured e-commerce platform — and a <strong>movie recommendation app</strong> using React and Vite. I also explored Laravel through MVC programming, and currently I'm diving deep into Docker and DevOps tools.
          </p>

          <p>
            Alongside development, I’ve solved over <strong>300+ DSA problems in Java</strong>, earned multiple certifications, and actively worked on improving my system design and backend fundamentals.
          </p>

          <p>
            Today, I’m confident in my skills with <strong>React, Node.js, Express, MongoDB, SQL, JavaScript</strong>, and tools like <strong>Git, Docker, Jenkins</strong>, and I’m continuously learning. I’m actively seeking opportunities to apply this knowledge in real-world environments, grow as a full-stack developer, and contribute to impactful products.
          </p>
        </motion.div>
      </div> */}
    </section>
  );
};

export default About;
