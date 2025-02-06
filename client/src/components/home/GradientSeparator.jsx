import { motion } from "framer-motion";

const GradientSeparator = () => (
    <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="h-px left-0 mt-36 right-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-4xl bottom-20"
    />
);

export default GradientSeparator;