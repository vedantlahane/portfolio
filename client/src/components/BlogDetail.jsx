import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveApiUrl, getApiBaseUrl } from '../utils/api';

const BlogDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-100 w-32 mb-8 rounded-sm" />
    <div className="h-12 bg-gray-100 w-3/4 max-w-2xl mb-4 rounded-sm" />
    <div className="h-12 bg-gray-100 w-2/4 max-w-xl mb-12 rounded-sm" />

    <div className="space-y-4 max-w-3xl">
      <div className="h-4 bg-gray-100 w-full rounded-sm" />
      <div className="h-4 bg-gray-100 w-full rounded-sm" />
      <div className="h-4 bg-gray-100 w-5/6 rounded-sm" />
      <div className="h-4 bg-gray-100 w-full rounded-sm mt-8" />
      <div className="h-4 bg-gray-100 w-4/5 rounded-sm" />
    </div>
  </div>
);

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const url = resolveApiUrl(`/blogs/${id}`);
        const response = await fetch(url, { signal: controller.signal });

        if (response.status === 404) {
          throw new Error('This blog post could not be found.');
        }

        if (!response.ok) {
          throw new Error(`Failed to load the blog post (status: ${response.status}).`);
        }

        const data = await response.json();
        if (!ignore) {
          setBlog(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (ignore || err.name === 'AbortError') return;
        setError(err.message || 'Failed to load the blog post.');
        setIsLoading(false);
      }
    };

    try {
      getApiBaseUrl();
      fetchBlog();
    } catch (envError) {
      setError(envError.message);
      setIsLoading(false);
    }

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

  return (
    <div className="w-full max-w-3xl">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BlogDetailSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-red-50/50 border border-red-100 p-8 rounded-sm text-center">
              <span className="text-4xl block mb-4">⚠️</span>
              <h3 className="text-red-900 font-display text-2xl mb-2">Error loading post</h3>
              <p className="text-red-600/80 font-sans text-base mb-6">{error}</p>
              <Link to="/blogs" className="inline-block px-6 py-2 bg-red-900 text-white font-mono text-xs uppercase tracking-wider hover:bg-red-800 transition-colors">
                Return to all posts
              </Link>
            </div>
          </motion.div>
        ) : !blog ? null : (
          <motion.article
            key="article"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pb-20"
          >
            <header className="mb-16 border-b border-gray-200 pb-12">
              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 uppercase tracking-wider mb-6">
                <span>{blog.author || 'Author'}</span>
                <span>•</span>
                <time dateTime={blog.createdAt}>
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'Unknown Date'}
                </time>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-light text-gray-900 leading-[1.1] tracking-tight">
                {blog.title}
              </h1>
            </header>

            <div className="prose prose-lg prose-slate hover:prose-a:text-gray-900 prose-a:text-gray-500 prose-a:transition-colors prose-headings:font-display prose-headings:font-light prose-h2:text-4xl prose-h3:text-2xl font-sans font-light leading-relaxed text-gray-800 break-words">
              {Array.isArray(blog.content) ? blog.content.join('\n') : blog.content ? (
                blog.content.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p className="italic text-gray-400">Content pending.</p>
              )}
            </div>

            <div className="mt-20 pt-8 border-t border-gray-200">
              <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-sans text-gray-400 hover:text-gray-900 transition-colors">
                ← Back to overview
              </Link>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;