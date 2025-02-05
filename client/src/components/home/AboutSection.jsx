import { motion, useInView } from "framer-motion";
import GradientSeparator from './GradientSeparator';

const storyElements = [
  {
    text: "I'm a Computer Science Engineering student at Lovely Professional University, navigating through my 6th semester in the vibrant state of Punjab.",
    direction: -50
  },
  {
    text: "While my roots trace back to the town city Paratwada, Maharashtra, my journey in tech began with a curiosity about how websites work...",
    direction: 50
  },
  {
    text: "Today, I'm focused on becoming a Full Stack Developer, mastering both front-end artistry and back-end logic.",
    direction: -50
  },
  {
    text: "Along the way, I've immersed myself in stacks like MERN and MEAN, building projects that challenge my creativity and technical skills.",
    direction: 50
  },
  {
    text: "Every day brings new learning opportunities - whether it's conquering a tricky algorithm or figuring out why my code works on localhost but nowhere else 🚀",
    direction: -50
  }
];

const AboutSection = () => (
  <section className="text-white py-8 relative overflow-hidden">
    <div className="container mx-auto px-24">
      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <h1 className="text-4xl font-semibold">Hello Again !!</h1>
            <motion.img
              className="size-14"
              src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
              alt="waving-hand"
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-12"
        >
          Let me tell you my story...
        </motion.h2>

        <div className="space-y-8">
          {storyElements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: item.direction }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px 0px 0px 0px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-xl font-medium leading-relaxed"
            >
              {item.text}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6">
            Current Chapter:
          </h2>
          <ul className="space-y-4 text-lg">
            <li>• 🛠 Building 3 new projects with Next.js and TypeScript</li>
            <li>• 📚 Learning Web3 and Three.js fundamentals</li>
            <li>• 🎯 Preparing for internship interviews</li>
            <li>• ☕ Burning through more coffee than code</li>
          </ul>
        </motion.div>
      </div>
    </div>
    <GradientSeparator />
  </section>
);

export default AboutSection;