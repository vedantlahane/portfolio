import { motion } from "framer-motion";

const GradientSeparator = ({ className = "" }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className={`h-px mt-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent ${className}`}
  />
);

export default GradientSeparator;