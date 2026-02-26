import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Home from '../v2_legacy/Home';

const V2Portfolio = () => {
    return (
        <div className="relative bg-black min-h-screen text-white">
            {/* Floating Back Button */}
            <div className="fixed top-4 left-4 z-50">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-md font-mono text-xs uppercase hover:bg-white/20 transition-all shadow-lg"
                >
                    <span>←</span> Back to V3
                </Link>
            </div>

            <Home />
        </div>
    );
};

export default V2Portfolio;
