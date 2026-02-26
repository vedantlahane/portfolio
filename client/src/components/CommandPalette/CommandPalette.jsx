import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCommandPalette } from './CommandPaletteContext';
import {
    Home, FileText, Code2,
    User, Briefcase, Sparkles, Mail,
    Github, ExternalLink
} from 'lucide-react';

const STATIC_ITEMS = [
    { id: 'home', type: 'page', title: 'Home', icon: Home, action: '/' },
    { id: 'blog', type: 'page', title: 'Blog', icon: FileText, action: '/blogs' },
    { id: 'practice', type: 'page', title: 'Practice', icon: Code2, action: '/practice' },

    { id: 'about', type: 'section', title: 'about', icon: User, action: '#about' },
    { id: 'projects', type: 'section', title: 'projects', icon: Briefcase, action: '#projects' },
    { id: 'skills', type: 'section', title: 'skills', icon: Sparkles, action: '#skills' },
    { id: 'contact', type: 'section', title: 'contact', icon: Mail, action: '#contact' },

    { id: 'github', type: 'link', title: 'GitHub', icon: Github, action: 'https://github.com/vedantlahane' },
    { id: 'resume', type: 'link', title: 'Resume', icon: ExternalLink, action: '#' }, // Update with real resume link
];

export default function CommandPalette() {
    const { isOpen, close } = useCommandPalette();
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Filter items based on query
    const filteredItems = STATIC_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    // Reset active index when query changes
    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    // Handle keyboard navigation inside the modal
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % filteredItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredItems[activeIndex]) {
                    executeAction(filteredItems[activeIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredItems, activeIndex, close]);

    const executeAction = (item) => {
        close();
        setQuery('');

        if (item.type === 'page') {
            navigate(item.action);
        } else if (item.type === 'section') {
            if (location.pathname !== '/') {
                navigate('/');
                // Need to wait for navigate then scroll, setTimeout is a simple way
                setTimeout(() => {
                    const el = document.querySelector(item.action);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            } else {
                const el = document.querySelector(item.action);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (item.type === 'link') {
            window.open(item.action, '_blank');
        }
    };

    // Group items by type for rendering
    const groups = [
        { label: 'Pages', type: 'page' },
        { label: 'Sections', type: 'section' },
        { label: 'Links', type: 'link' }
    ].map(group => ({
        ...group,
        items: filteredItems.filter(item => item.type === group.type)
    })).filter(group => group.items.length > 0);

    // Keep track of absolute item index across groups to highlight correctly
    let currentGroupIdx = 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
                        onClick={close}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh] pointer-events-none px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto flex flex-col max-h-[60vh]"
                        >
                            {/* Search Input */}
                            <div className="border-b border-gray-100 flex-shrink-0">
                                <input
                                    ref={inputRef}
                                    autoFocus
                                    type="text"
                                    placeholder="Navigate to..."
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    className="w-full px-6 py-4 text-base bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            {/* Results List */}
                            <div className="overflow-y-auto py-2 flex-grow">
                                {groups.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-gray-500">No results found.</div>
                                ) : (
                                    groups.map((group) => (
                                        <div key={group.label} className="mb-2">
                                            <div className="px-6 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                {group.label}
                                            </div>
                                            <ul>
                                                {group.items.map((item) => {
                                                    const idx = currentGroupIdx++;
                                                    const isActive = idx === activeIndex;
                                                    const Icon = item.icon;

                                                    return (
                                                        <li key={item.id}>
                                                            <button
                                                                onClick={() => executeAction(item)}
                                                                onMouseEnter={() => setActiveIndex(idx)}
                                                                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${isActive ? 'bg-gray-100/80 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {item.type === 'section' ? (
                                                                    <span className="text-gray-400">→</span>
                                                                ) : (
                                                                    <Icon size={16} className={`${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                                                                )}
                                                                <span className={item.type === 'section' ? 'text-sm' : 'text-base'}>
                                                                    {item.title}
                                                                </span>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-100 px-6 py-3 flex justify-between items-center text-xs text-gray-400 flex-shrink-0 bg-gray-50/50">
                                <span>Navigate ↑↓</span>
                                <span>ESC to close</span>
                            </div>
                        </motion.div>
                    </div>
                </React.Fragment >
            )
            }
        </AnimatePresence >
    );
}
