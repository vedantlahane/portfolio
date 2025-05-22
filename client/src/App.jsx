import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Hero1 from './components/Hero1';
import WorkInProgress from './components/home/WorkInProgress';
import MouseSmokeEffect from './components/common/MouseSmokeEffect';
function App() {
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800/10 to-gray-950 transition-all  duration-500 relative ">
      
      <MouseSmokeEffect/>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8"> {/* Adjusted padding-top for navbar */}
        <WorkInProgress />
        <Routes>
          <Route path="/hero1" element={<Hero1 />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About/>} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;