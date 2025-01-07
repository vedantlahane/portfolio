// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactForm from './components/ContactForm';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import Navbar from './pages/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
    </div>
  );
}

export default App;