import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl, resolveApiUrl } from '../utils/api';

const BlogPreview = ({ blog, index }) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group relative border-b border-gray-200 last:border-0 py-8"
  >
    <Link to={`/blogs/${blog._id}`} className="block">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-3">
        <h3 className="text-2xl md:text-3xl font-display font-light text-gray-900 group-hover:text-gray-600 transition-colors">
          {blog.title}
        </h3>
        <time dateTime={blog.createdAt} className="text-xs font-mono text-gray-400 shrink-0">
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).toUpperCase()}
        </time>
      </div>

      {blog.excerpt && (
        <p className="text-base text-gray-500 font-sans font-light leading-relaxed max-w-3xl mb-4 line-clamp-2">
          {blog.excerpt}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs font-mono text-gray-400 uppercase tracking-wider mt-4">
        {blog.author && <span>BY {blog.author}</span>}
        <span className="text-gray-900 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          READ POST →
        </span>
      </div>
    </Link>
  </motion.li>
);

const BlogSkeleton = () => (
  <div className="py-8 border-t border-gray-200 mt-8">
    {[1, 2, 3].map((n) => (
      <div key={n} className="py-8 border-b border-gray-200 last:border-0">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <motion.div
            className="h-8 bg-gray-100 w-3/4 max-w-lg rounded-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: n * 0.2 }}
          />
          <motion.div
            className="h-4 bg-gray-100 w-24 rounded-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: n * 0.2 }}
          />
        </div>
        <motion.div
          className="h-4 bg-gray-100 w-full max-w-2xl rounded-sm mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: n * 0.2 }}
        />
        <motion.div
          className="h-4 bg-gray-100 w-4/5 max-w-xl rounded-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: n * 0.2 }}
        />
      </div>
    ))}
  </div>
);

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchBlogs = async () => {
      try {
        if (!ignore) {
          setIsLoading(true);
          setError(null);
        }

        const targetUrl = resolveApiUrl('/blogs');
        if (!ignore) setApiUrl(targetUrl);

        const response = await fetch(targetUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!ignore) setBlogs(data);
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load blog posts. Please try again later.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    try {
      getApiBaseUrl();
      fetchBlogs();
    } catch (envError) {
      setError(envError.message);
      setIsLoading(false);
    }

    return () => { ignore = true; };
  }, []);

  const DevBanner = () => (
    import.meta.env.DEV && (
      <div className="bg-yellow-50/50 border border-yellow-200 text-xs font-mono text-yellow-800 p-3 mb-8 rounded-sm">
        Dev Mode: API at {apiUrl || 'pending...'}
      </div>
    )
  );

  return (
    <div className="w-full">
      <DevBanner />

      <motion.div
        className="mb-12 md:mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-display font-light text-gray-900 tracking-tight">
          Writing.
        </h1>
        <p className="mt-6 text-gray-500 font-sans font-light max-w-xl text-lg">
          Thoughts, tutorials, and deep dives into software engineering, design, and building products.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BlogSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="py-12 border-t border-gray-200"
          >
            <div className="bg-red-50/50 border border-red-100 p-6 rounded-sm">
              <h3 className="text-red-900 font-display text-xl mb-2">Unable to load posts</h3>
              <p className="text-red-600/80 font-sans text-sm">{error}</p>
            </div>
          </motion.div>
        ) : blogs.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="py-20 border-t border-gray-200 text-center"
          >
            <div className="mx-auto w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-gray-400 font-serif italic text-2xl">?</span>
            </div>
            <p className="text-xl font-display text-gray-900 mb-2">No posts found</p>
            <p className="text-sm font-sans text-gray-500">
              Check back later for new content.
            </p>
          </motion.div>
        ) : (
          <motion.ul
            key="list"
            className="border-t border-gray-200"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {blogs.map((blog, index) => (
              <BlogPreview key={blog._id} blog={blog} index={index} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogList;