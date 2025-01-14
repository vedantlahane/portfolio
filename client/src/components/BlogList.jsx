// BlogList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// API URL Configuration
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api/blogs'  // Development URL
  : `${import.meta.env.VITE_API_BASE_URL}/api/blogs`; // Production URL

// BlogPreview Component
const BlogPreview = ({ blog }) => (
  <li className="mb-6 p-4 border rounded-lg hover:shadow-md transition-shadow">
    <Link 
      to={`/blogs/${blog._id}`} 
      className="block"
    >
      <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-800">
        {blog.title}
      </h3>
      <div className="mt-2 text-gray-600 text-sm">
        <span className="font-medium">{blog.author}</span>
        <span className="mx-2">•</span>
        <time dateTime={blog.createdAt}>
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>
      {blog.excerpt && (
        <p className="mt-2 text-gray-700 line-clamp-2">
          {blog.excerpt}
        </p>
      )}
    </Link>
  </li>
);

// Loading skeleton component
const BlogSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3].map((n) => (
      <div key={n} className="mb-6 p-4 border rounded-lg">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-full"></div>
      </div>
    ))}
  </div>
);

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching from:', API_URL); // Debug log

        const response = await fetch(API_URL, {
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Development environment indicator
  const DevBanner = () => (
    import.meta.env.DEV && (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
        <p className="text-yellow-700">
          Development Environment - API URL: {API_URL}
        </p>
      </div>
    )
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 mt-8">
        <DevBanner />
        <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>
        <BlogSkeleton />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 mt-8">
        <DevBanner />
        <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-8">
      <DevBanner />
      <h2 className="text-3xl font-bold mb-6">Blog Posts</h2>
      
      {blogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No blog posts available yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Check back later for new content!
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {blogs.map(blog => (
            <BlogPreview key={blog._id} blog={blog} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;