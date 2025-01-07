// BlogDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => setBlog(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-600 mb-4">By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}</p>
      <div className="prose">
        {blog.content.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default BlogDetail;