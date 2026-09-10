import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAdmin();
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      setPasskey('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setError('Please enter passkey');
      return;
    }

    setError('');
    setLoading(true);

    const result = await login(passkey.trim());
    setLoading(false);

    if (result.success) {
      setPasskey('');
      onClose();
    } else {
      setError(result.message || 'Invalid passkey');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 w-full max-w-sm p-6 sm:p-8 relative z-10 shadow-2xl flex flex-col font-sans transition-colors"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-mono text-lg cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs text-accent font-mono tracking-widest uppercase">OWNER ACCESS</span>
              <h3 className="text-2xl font-display font-light text-gray-900 dark:text-white mt-1">Admin Passkey</h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400 font-sans mt-1">Enter your passkey to unlock in-place editing.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-400 dark:text-neutral-500 font-mono uppercase tracking-wider mb-1.5">
                  Passkey
                </label>
                <input
                  ref={inputRef}
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm tracking-widest font-mono text-gray-900 dark:text-white focus:border-accent dark:focus:border-accent focus:outline-none transition-colors rounded-none text-center text-lg"
                  disabled={loading}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 font-mono text-center"
                >
                  ✕ {error}
                </motion.div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 bg-gray-900 dark:bg-accent text-white dark:text-neutral-950 font-sans text-xs tracking-wider uppercase font-medium border border-gray-900 dark:border-accent transition-all hover:bg-neutral-800 dark:hover:bg-accent/90 cursor-pointer flex items-center justify-center gap-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block">⟳</span>
                      UNLOCKING...
                    </>
                  ) : (
                    'UNLOCK'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
