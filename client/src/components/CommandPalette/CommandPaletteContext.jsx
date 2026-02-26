import React, { createContext, useContext, useState, useEffect } from 'react';

const CommandPaletteContext = createContext();

export function CommandPaletteProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(prev => !prev);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    // Keyboard listener for Cmd+K (Mac) or Ctrl+K (Windows)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
            {children}
        </CommandPaletteContext.Provider>
    );
}

export function useCommandPalette() {
    return useContext(CommandPaletteContext);
}
