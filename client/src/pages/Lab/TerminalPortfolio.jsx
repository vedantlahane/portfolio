import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TYPING_SPEED = 20;
const LINE_PAUSE = 160;

const COMMANDS = {
    help: `Available commands:
  about     - Who am I
  skills    - Tech stack
  projects  - My work
  contact   - Get in touch
  resume    - Open resume
  social    - Social links
  clear     - Clear terminal
  exit      - Back to portfolio
  theme     - Toggle amber/green/white`,
    about: `Name:     Vedant Lahane
Role:     CS Student
Location: Amravati, Maharashtra, India
Status:   Open to work ●
School:   Lovely Professional University
CGPA:     7.89

Currently building AI-powered web apps
with React, Node.js, and LangChain.`,
    skills: `Languages: JavaScript, TypeScript, Python, Java, C++
Frontend:  React, Next.js, Tailwind, GSAP, Framer Motion
Backend:   Node.js, Express, Django
Database:  MongoDB, PostgreSQL
Tools:     Git, Docker, AWS`,
    projects: `┌──────────────────────────────────────────┐
│ # │ Project        │ Year │ Status       │
├──────────────────────────────────────────┤
│ 1 │ SafarSathi     │ 2025 │ In Dev    ○  │
│ 2 │ Axon           │ 2025 │ In Dev    ○  │
│ 3 │ ShoeMarkNet    │ 2024 │ Live      ●  │
│ 4 │ FundForge      │ 2025 │ Live      ●  │
│ 5 │ myblog         │ 2024 │ In Dev    ○  │
│ 6 │ Portfolio      │ 2025 │ Live      ●  │
│ 7 │ Docker Setup   │ 2025 │ Tooling   ◇  │
└──────────────────────────────────────────┘

Type "open <id>" to visit a project`,
    contact: `Email: vedantanillahane@gmail.com
Phone: +91 7447335096`,
    social: `LinkedIn:  https://linkedin.com/in/vedantlahane
GitHub:    https://github.com/vedantlahane
Twitter:   https://twitter.com/_ved14`,
    "sudo hire vedant": "Permission granted. Sending offer letter... 📧",
    ls: "about.txt projects/ skills.json contact.md",
    "cat about.txt": `Name:     Vedant Lahane
Role:     CS Student
Location: Amravati, Maharashtra, India
Status:   Open to work ●`,
    theme: "Usage: theme <green|amber|white>",
    "theme green": "Theme set to green",
    "theme amber": "Theme set to amber",
    "theme white": "Theme set to white",
    neofetch: `
       /\\_\\        OS:    Portfolio OS
      / / /_       Host:  vedant.sh
     / /_/_ \\      Kernel: 1.0.0
    / /____\\ \\     Uptime: Just booted
   / / /___/ /     Packages: 10
  / /_/_  / /      Shell: zsh
 / /____\\/ /       Theme: Terminal
 \\/_______/        Terminal: Web

  ████  ████  ████  ████  ████  ████
`
};

export default function TerminalPortfolio() {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [theme, setTheme] = useState('green'); // green, amber, white
    const [booting, setBooting] = useState(true);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    const themeColors = {
        green: "text-green-400 focus-within:text-green-400 selection:bg-green-400/30",
        amber: "text-amber-400 focus-within:text-amber-400 selection:bg-amber-400/30",
        white: "text-gray-200 focus-within:text-gray-200 selection:bg-gray-200/30",
    };

    useEffect(() => {
        // Boot sequence
        setTimeout(() => {
            setBooting(false);
            typeOutput("vedant.sh v1.0.0\nType \"help\" for available commands.", () => {
                setIsTyping(false);
            });
        }, 500);
    }, []);

    useEffect(() => {
        if (!isTyping) {
            inputRef.current?.focus();
        }
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

    const typeOutput = (text, callback) => {
        setIsTyping(true);
        let i = 0;
        let currentLine = '';
        const lines = text.split('\n');
        let lineIdx = 0;

        const id = history.length + Math.random().toString();

        setHistory(prev => [...prev, { id, type: 'output', text: '' }]);

        const typeChar = () => {
            if (lineIdx < lines.length) {
                if (i < lines[lineIdx].length) {
                    currentLine += lines[lineIdx].charAt(i);
                    setHistory(prev => prev.map(item => item.id === id ? { ...item, text: prev.find(p => p.id === id).text.split('\n').slice(0, -1).concat(currentLine).join('\n') } : item));
                    i++;
                    setTimeout(typeChar, TYPING_SPEED);
                } else {
                    currentLine = '';
                    i = 0;
                    lineIdx++;
                    if (lineIdx < lines.length) {
                        setHistory(prev => prev.map(item => item.id === id ? { ...item, text: item.text + '\n' } : item));
                        setTimeout(typeChar, LINE_PAUSE);
                    } else {
                        callback?.();
                    }
                }
            }
        };

        // Slight pause before typing begins
        setTimeout(typeChar, 100);
    };

    const handleCommand = (cmd) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        setHistory(prev => [...prev, { id: Math.random().toString(), type: 'input', text: `$ ${trimmed}` }]);

        const args = trimmed.split(' ');
        const baseCmd = args[0].toLowerCase();

        if (trimmed.toLowerCase() === 'clear') {
            setHistory([]);
            setIsTyping(false);
            return;
        }

        if (trimmed.toLowerCase() === 'exit') {
            typeOutput("Goodbye.\nRedirecting to portfolio...", () => {
                setTimeout(() => navigate('/'), 1000);
            });
            return;
        }

        if (baseCmd === 'theme' && args[1]) {
            const newTheme = args[1].toLowerCase();
            if (['green', 'amber', 'white'].includes(newTheme)) {
                setTheme(newTheme);
                typeOutput(`Theme set to ${newTheme}`, () => setIsTyping(false));
            } else {
                typeOutput("Invalid theme. Use: green, amber, white", () => setIsTyping(false));
            }
            return;
        }

        if (baseCmd === 'open' && args[1]) {
            const id = args[1];
            const validIds = ['1', '2', '3', '4', '5', '6', '7'];
            if (validIds.includes(id)) {
                typeOutput(`Opening project #${id}...\n→ Opening link in new tab. `, () => setIsTyping(false));
            } else {
                typeOutput(`Project #${id} not found. Type "projects" for list.`, () => setIsTyping(false));
            }
            return;
        }

        const output = COMMANDS[trimmed.toLowerCase()] || COMMANDS[baseCmd];

        if (output && typeof output === 'string') {
            typeOutput(output, () => setIsTyping(false));
        } else {
            typeOutput(`Command not found: ${trimmed}. Type 'help' for help.`, () => setIsTyping(false));
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (isTyping) return;
        handleCommand(input);
        setInput('');
    };

    if (booting) {
        return <div className="min-h-screen bg-black" />;
    }

    return (
        <div className={`min-h-screen bg-black p-4 md:p-8 font-mono text-sm md:text-base selection:bg-opacity-30 ${themeColors[theme]} transition-colors duration-300 relative`}>
            <div className="max-w-4xl mx-auto pb-20">

                {/* Terminal Output */}
                <div className="flex flex-col gap-4 whitespace-pre-wrap leading-relaxed">
                    {history.map((item) => (
                        <div key={item.id} className={item.type === 'input' ? 'text-white' : ''}>
                            {item.text}
                        </div>
                    ))}
                </div>

                {/* Action Input */}
                {!isTyping && (
                    <form onSubmit={onSubmit} className="flex gap-2 mt-4">
                        <span>$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent outline-none border-none border-0 ring-0 p-0"
                            autoFocus
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </form>
                )}
                <div ref={bottomRef} className="h-4" />
            </div>

            <button onClick={() => navigate('/')} className="fixed bottom-6 right-6 text-gray-600 hover:text-current transition-colors text-sm">
                ← exit to portfolio
            </button>

            {/* Blinking Cursor Hack */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes blink {
            0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        input: focus {
            caret- color: transparent;
    }
    input: focus + :: after,
        input: focus::after {
        content: '█';
        animation: blink 1s step - end infinite;
        margin - left: 2px;
        vertical - align: bottom;
    }

        /* Simulating the terminal cursor based on value length */
        .cursor - wrapper {
        position: relative;
    }
    ` }} />
        </div>
    );
}
