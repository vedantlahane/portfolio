import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PracticePage from "./pages/PracticePage";
import SmoothScroll from "./components/SmoothScroll";
import ErrorBoundary from "./components/ErrorBoundary";

// Global UI Elements
import Preloader from "./components/Preloader";
import PageTransition from "./components/Transitions/PageTransition";
import { CommandPaletteProvider } from "./components/CommandPalette/CommandPaletteContext";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import ScrollProgressIndicator from "./components/Navigation/ScrollProgressIndicator";

// New Lab Pages
import DesignLab from "./pages/Lab/DesignLab";
import TerminalPortfolio from "./pages/Lab/TerminalPortfolio";
import BrutalistPortfolio from "./pages/Lab/BrutalistPortfolio";
import NotFound from "./pages/NotFound";
import V2Portfolio from "./pages/V2Portfolio";

const App = () => {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  return (
    <CommandPaletteProvider>
      <SmoothScroll>
        <ErrorBoundary>
          {!isPreloaderDone && <Preloader onComplete={() => setIsPreloaderDone(true)} />}

          {/* Only render the main app after preloader finishes sliding up OR concurrently behind it */}
          {/* The spec says preloader slides UP revealing content below, so the app MUST be rendered behind it */}

          <ScrollProgressIndicator />
          <CommandPalette />

          <PageTransition>
            <Routes>
              {/* Core Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/blogs" element={<BlogListPage />} />
              <Route path="/blogs/:id" element={<BlogDetailPage />} />
              <Route path="/practice" element={<PracticePage />} />

              {/* Lab & Legacy Routes */}
              <Route path="/lab" element={<DesignLab />} />
              <Route path="/lab/terminal" element={<TerminalPortfolio />} />
              <Route path="/lab/brutalist" element={<BrutalistPortfolio />} />
              <Route path="/v2" element={<V2Portfolio />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>

        </ErrorBoundary>
      </SmoothScroll>
    </CommandPaletteProvider>
  );
};

export default App;
