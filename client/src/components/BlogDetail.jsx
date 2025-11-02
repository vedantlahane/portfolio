// BlogDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resolveApiUrl, getApiBaseUrl } from '../utils/api';

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

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading blog post…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const createdAt = blog.createdAt ? new Date(blog.createdAt) : null;
  const content = Array.isArray(blog.content) ? blog.content.join('\n') : blog.content;

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {blog.title}
        </h1>
        {(blog.author || createdAt) && (
          <p className="text-sm text-slate-500">
            {blog.author && <span className="font-medium text-slate-600">{blog.author}</span>}
            {blog.author && createdAt && <span className="mx-2">•</span>}
            {createdAt && createdAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </header>

      {content ? (
        <div className="prose prose-slate max-w-none text-slate-700">
          {content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">This post does not have any content yet.</p>
      )}
    </article>
  );
};

export default BlogDetail;