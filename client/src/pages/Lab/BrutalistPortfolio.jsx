import React from 'react';
import { Link } from 'react-router-dom';

export default function BrutalistPortfolio() {
    return (
        <div className="min-h-screen bg-white text-black selection:bg-red-500 selection:text-white">
            {/* HEADER BLOCK */}
            <div className="border-b-[4px] border-black p-4 md:p-8 relative">
                <Link
                    to="/"
                    className="absolute top-4 right-4 md:top-8 md:right-8 font-mono text-xl border-2 border-black px-2 py-1 hover:bg-black hover:text-white"
                >
                    ← EXIT
                </Link>
                <h1 className="text-[6rem] md:text-[8rem] font-black uppercase leading-none tracking-tighter m-0 max-w-full break-words">
                    VEDANT
                    <br />
                    LAHANE
                </h1>
                <p className="font-mono text-xl md:text-2xl mt-8">
                    COMPUTER SCIENCE.<br />
                    AMRAVATI, INDIA.
                </p>
            </div>

            {/* ABOUT BLOCK */}
            <div className="border-b-[4px] border-black bg-yellow-300 p-4 md:p-12">
                <div className="border-[4px] border-black bg-white p-6 md:p-10 max-w-4xl mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-4xl font-black mb-6 border-b-[4px] border-black pb-2 inline-block">ABOUT</h2>
                    <p className="font-mono text-xl md:text-3xl leading-tight">
                        I write code. Mostly web stuff. Sometimes it works.
                        I've solved 350+ algorithm problems because I enjoy suffering.
                    </p>
                </div>
            </div>

            {/* PROJECTS BLOCK */}
            <div className="border-b-[4px] border-black p-4 md:p-12 overflow-hidden flex justify-center">
                <div className="border-[4px] border-black w-full max-w-5xl rotate-[-1deg] bg-white p-6 md:p-10 shadow-[-10px_10px_0px_0px_rgba(0,0,0,1)] hover:rotate-1 transition-none hover:bg-black hover:text-white group">
                    <h2 className="text-3xl font-black mb-8 border-b-[4px] border-current pb-2 inline-block uppercase">Projects</h2>
                    <ul className="font-mono text-lg md:text-2xl flex flex-col gap-6">
                        <li className="border-b-2 border-current pb-4 border-dashed">
                            <span className="font-black block text-2xl md:text-4xl">SAFARSATHI ★</span>
                            OFFLINE SAFETY THING. REACT. JAVA.
                        </li>
                        <li className="border-b-2 border-current pb-4 border-dashed">
                            <span className="font-black block text-2xl md:text-4xl">AXON</span>
                            AI DOC THING. DJANGO. LANGCHAIN.
                        </li>
                        <li className="border-b-2 border-current pb-4 border-dashed">
                            <span className="font-black block text-2xl md:text-4xl">SHOEMARKNET</span>
                            SHOE STORE. MERN. WORKS ACTUALLY.
                        </li>
                    </ul>
                </div>
            </div>

            {/* SKILLS BLOCK - Word Cloud */}
            <div className="border-b-[4px] border-black p-2 bg-red-500 text-black flex flex-wrap gap-x-2 gap-y-0 leading-none items-center justify-center">
                <span className="text-[3rem] font-black uppercase">JAVA</span>
                <span className="text-[1.5rem] font-mono">JAVASCRIPT</span>
                <span className="text-[2rem] font-bold">TYPESCRIPT</span>
                <span className="text-[4rem] font-black">C++</span>
                <span className="text-[5rem] font-black italic">REACT</span>
                <span className="text-[2rem] font-mono">NODE</span>
                <span className="text-[3rem] font-bold">EXPRESS</span>
                <span className="text-[1.2rem] font-black">ANGULAR</span>
                <span className="text-[2.5rem] font-mono">MONGODB</span>
                <span className="text-[1.5rem] font-black">MYSQL</span>
                <span className="text-[4rem] font-black uppercase">DOCKER</span>
                <span className="text-[3rem] font-bold">AWS</span>
                <span className="text-[6rem] font-black">GIT</span>
                <span className="text-[2rem] font-mono">TAILWIND</span>
                <span className="text-[1.5rem] font-bold">LANGCHAIN</span>
                <span className="text-[3rem] font-black">OPENAI</span>
                <span className="text-[2.5rem] font-mono">VERCEL</span>
            </div>

            {/* CONTACT */}
            <div className="border-b-[4px] border-black p-4 md:p-12">
                <p className="font-mono font-bold text-2xl mb-2">CONTACT:</p>
                <a
                    href="mailto:vedantanillahane@gmail.com"
                    className="block text-[2rem] md:text-[5rem] font-black break-all leading-none hover:bg-black hover:text-white transition-none border-[4px] border-transparent hover:border-black p-2"
                >
                    vedantanillahane@gmail.com
                </a>
            </div>

            {/* FOOTER MARQUEE */}
            <div className="bg-yellow-300 border-b-[4px] border-black text-[2rem] md:text-[4rem] font-black uppercase whitespace-nowrap overflow-hidden flex py-2 border-t-[4px] border-t-black">
                {/* Note: Using CSS animation for the marquee instead of <marquee> for React compatibility but keeping the vibe */}
                <div className="animate-[marquee_10s_linear_infinite] inline-block">
                    ░ HIRE ME · HIRE ME · HIRE ME · HIRE ME · HIRE ME · HIRE ME ·
                </div>
                <div className="animate-[marquee_10s_linear_infinite] inline-block" aria-hidden="true">
                    ░ HIRE ME · HIRE ME · HIRE ME · HIRE ME · HIRE ME · HIRE ME ·
                </div>
            </div>

            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
}
