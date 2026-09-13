import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PracticePage from "./pages/PracticePage";
import PersonalVaultPage from "./pages/PersonalVaultPage";
import SmoothScroll from "./components/SmoothScroll";
import ErrorBoundary from "./components/ErrorBoundary";

// Global UI Elements
import Preloader from "./components/Preloader";
import PageTransition from "./components/Transitions/PageTransition";
import { CommandPaletteProvider } from "./components/CommandPalette/CommandPaletteContext";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import ScrollProgressIndicator from "./components/Navigation/ScrollProgressIndicator";
import LoginModal from "./components/UI/LoginModal";
import JsonEditorModal from "./components/UI/JsonEditorModal";

// New Lab Pages
import DesignLab from "./pages/Lab/DesignLab";
import TerminalPortfolio from "./pages/Lab/TerminalPortfolio";
import BrutalistPortfolio from "./pages/Lab/BrutalistPortfolio";
import NotFound from "./pages/NotFound";
import V2Portfolio from "./pages/V2Portfolio";

// Admin Imports
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PortfolioProvider } from "./context/PortfolioContext";

const AdminToolbar = () => {
  const { isAdmin, logout, openJsonModal } = useAdmin();
  if (!isAdmin) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] bg-gray-950 border border-gray-800 px-4 py-2.5 text-white flex items-center gap-3 sm:gap-4 text-xs font-mono tracking-widest shadow-2xl">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        ADMIN MODE ACTIVE
      </span>
      <span className="text-gray-700">|</span>
      <Link
        to="/vault"
        className="hover:text-accent font-bold transition-colors uppercase cursor-pointer"
        title="Manage Personal Vault & AI Autofill (Ctrl+Shift+F)"
      >
        PERSONAL VAULT
      </Link>
      <span className="text-gray-700">|</span>
      <button
        onClick={openJsonModal}
        className="hover:text-amber-300 font-bold transition-colors uppercase cursor-pointer"
        title="Directly manipulate all portfolio data in JSON format"
      >
        EDIT JSON
      </button>
      <span className="text-gray-700">|</span>
      <button
        onClick={logout}
        className="hover:text-red-400 font-bold transition-colors uppercase cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
};

const MainApp = () => {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const navigate = useNavigate();
  const {
    isAdmin,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    isJsonModalOpen,
    openJsonModal,
    closeJsonModal
  } = useAdmin();

  // Global hotkeys (Ctrl+Shift+A for passkey prompt, Ctrl+Shift+J for JSON editor, Ctrl+Shift+F for Personal Vault)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openLoginModal();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        if (isAdmin) {
          openJsonModal();
        } else {
          openLoginModal();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        navigate('/vault');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openLoginModal, openJsonModal, navigate, isAdmin]);

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
              <Route path="/vault" element={<PersonalVaultPage />} />
              <Route path="/personal-vault" element={<PersonalVaultPage />} />

              {/* Lab & Legacy Routes */}
              <Route path="/lab" element={<DesignLab />} />
              <Route path="/lab/terminal" element={<TerminalPortfolio />} />
              <Route path="/lab/brutalist" element={<BrutalistPortfolio />} />
              <Route path="/v2" element={<V2Portfolio />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>

          <AdminToolbar />
          <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
          <JsonEditorModal isOpen={isJsonModalOpen} onClose={closeJsonModal} />
        </ErrorBoundary>
      </SmoothScroll>
    </CommandPaletteProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <AdminProvider>
          <MainApp />
        </AdminProvider>
      </PortfolioProvider>
    </ThemeProvider>
  );
};

export default App;
