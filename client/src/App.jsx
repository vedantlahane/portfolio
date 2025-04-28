import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ContactForm from './components/ContactForm';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Hero1 from './components/Hero1';
import WorkInProgress from './components/home/WorkInProgress';
import MouseSmokeEffect from './components/common/MouseSmokeEffect';
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 relative overflow-hidden">
      <MouseSmokeEffect/>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-16"> {/* Content container */}
      <WorkInProgress />
        <Routes>
          <Route path="/hero1" element={<Hero1 />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;