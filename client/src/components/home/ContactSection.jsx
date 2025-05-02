import React from "react";
import { motion } from "framer-motion";
import GradientSeparator from "./GradientSeparator";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

const contactLinks = [
  {
    name: "Email",
    href: "mailto:vedantlahane@gmail.com",
    icon: <EnvelopeIcon className="w-8 h-8 text-blue-400" />,
    display: "vedantlahane@gmail.com",
  },
  {
    name: "GitHub",
    href: "https://github.com/vedantlahane",
    icon: (
      <img
        src="https://img.icons8.com/ios-filled/50/github.png"
        alt="GitHub"
        className="w-8 h-8"
      />
    ),
    display: "github.com/vedantlahane",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/vedant-lahane",
    icon: (
      <img
        src="https://img.icons8.com/color/48/linkedin.png"
        alt="LinkedIn"
        className="w-8 h-8"
      />
    ),
    display: "linkedin.com/in/vedant-lahane",
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/vedantlahane",
    icon: (
      <img
        src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png"
        alt="LeetCode"
        className="w-8 h-8"
      />
    ),
    display: "leetcode.com/u/vedantlahane",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, type: "spring" }
  })
};

const ContactSection = () => (
  <section id="contact" className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Let's Connect
      </motion.h2>
      <motion.p
        className="text-lg text-gray-500 dark:text-gray-300 mb-12 max-w-2xl"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Feel free to reach out via any platform below. I’m always open to networking, collaboration, or just a friendly chat!
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {contactLinks.map((link, i) => (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/60 dark:bg-slate-800/80 shadow-lg border border-slate-300/60 dark:border-slate-700/60 hover:scale-105 hover:shadow-2xl transition-all duration-300 group backdrop-blur-md"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <span className="shrink-0">{link.icon}</span>
            <span className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-blue-200 group-hover:text-purple-500 transition">
              {link.display}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
    <GradientSeparator className="mt-16 md:mt-24" />
  </section>
);

export default ContactSection;
