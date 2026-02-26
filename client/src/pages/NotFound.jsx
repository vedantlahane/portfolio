export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background massive elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="text-[20vw] font-bold text-gray-100/50 leading-none select-none flex space-x-4">
                    <span className="animate-[dropIn_0.8s_ease-out_forwards]" style={{ transform: 'translateY(-100px)', opacity: 0 }}>4</span>
                    <span className="animate-[dropIn_0.8s_ease-out_0.1s_forwards]" style={{ transform: 'translateY(-100px)', opacity: 0 }}>0</span>
                    <span className="animate-[dropIn_0.8s_ease-out_0.2s_forwards]" style={{ transform: 'translateY(-100px)', opacity: 0 }}>4</span>
                </div>
            </div>

            {/* Subtle diamond floating */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gray-200/40 rotate-45 animate-spin-slow pointer-events-none z-0"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-gray-200/30 rotate-12 animate-spin-slow-reverse pointer-events-none z-0"></div>

            {/* Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]">
                    Page Not Found
                </p>
                <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto opacity-0 animate-[fadeIn_0.5s_ease-out_0.6s_forwards]">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <a
                    href="/"
                    className="px-6 py-3 border border-gray-900 text-gray-900 text-xs font-medium uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors duration-300 opacity-0 animate-[slideUpFade_0.5s_ease-out_0.8s_forwards]"
                >
                    Back to Home
                </a>
            </div>

            <style jsx global>{`
        @keyframes dropIn {
          0% { transform: translateY(-100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpFade {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin 40s linear infinite reverse;
        }
      `}</style>
        </div>
    );
}
