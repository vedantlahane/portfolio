// BlogList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs`).then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Blog</h2>
      {blogs.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        <ul>
          {blogs.map(blog => (
            <li key={blog._id} className="mb-4">
              <Link to={`/blogs/${blog._id}`} className="text-xl text-blue-500">
                {blog.title}
              </Link>
              <p className="text-gray-700">{blog.author} - {new Date(blog.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;