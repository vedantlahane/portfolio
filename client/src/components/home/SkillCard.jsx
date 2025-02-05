import { motion } from 'framer-motion';

const SkillCard = ({ title, category, animationUrl, imageUrl, isLottie = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="break-inside-avoid bg-slate-800/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 backdrop-blur-xs"
  >
    {isLottie ? (
      <iframe
        className="w-40  mx-auto mb-4"
        src={animationUrl}
        title={title}
      />
    ) : (
      <img
        src={imageUrl}
        className="w-28  mx-auto mb-4"
        alt={title}
      />
    )}
    <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
    <p className="text-sm text-gray-400 text-center">{category}</p>
  </motion.div>
);

export default SkillCard;