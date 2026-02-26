import { motion } from 'framer-motion';

const SkillCard = ({ title, category, animationUrl, imageUrl, isLottie = false, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -10 }}
    className="group relative"
  >
    <div className="h-full p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300" />
      
      <div className="relative z-10">
        {isLottie ? (
          <iframe
            className="w-24 h-24 mx-auto mb-4"
            src={animationUrl}
            title={title}
          />
        ) : (
          <img
            src={imageUrl}
            className="w-20 h-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
            alt={title}
          />
        )}
        <h3 className="text-lg font-semibold text-center mb-2 text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 text-center">
          {category}
        </p>
      </div>
    </div>
  </motion.div>
);

export default SkillCard;