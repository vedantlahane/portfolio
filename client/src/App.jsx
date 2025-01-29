// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactForm from './components/ContactForm';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className= "min-h-screen bg-slate-900 w-full p-4 overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/hero" element={<Hero />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
    </div>
  );
}

export default App;