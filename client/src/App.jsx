import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PracticePage from "./pages/PracticePage";
import SmoothScroll from "./components/SmoothScroll";

const App = () => (
  <SmoothScroll>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/blogs" element={<BlogListPage />} />
      <Route path="/blogs/:id" element={<BlogDetailPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </SmoothScroll>
);

export default App;
