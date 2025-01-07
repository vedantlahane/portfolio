// Home.jsx
import React from 'react';
import BlogList from '../components/BlogList';

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
      {/* Add more sections like About, Projects, etc. */}
      <BlogList />
    </div>
  );
};

export default Home;