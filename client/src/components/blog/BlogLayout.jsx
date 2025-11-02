import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogLayout = ({ title, children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-slate-500"
        >
          09&nbsp;&nbsp;{title}
        </motion.div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <span aria-hidden>←</span>
          Back to portfolio
        </Link>
      </div>
    </header>

    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
);

export default BlogLayout;
