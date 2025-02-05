import { motion } from "framer-motion";

const GradientSeparator = () => (
    <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="h-0.5 mt-36 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md bottom-20"
    />
);

export default GradientSeparator;