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
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50/10 via-purple-100/40 to-indigo-100/30 dark:from-gray-950 dark:via-gray-700 dark:to-gray-950 transition-all duration-500 relative ">
      
      <MouseSmokeEffect/>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8"> {/* Adjusted padding-top for navbar */}
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