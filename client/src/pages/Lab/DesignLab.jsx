export default function DesignLab() {
    return (
        <div className="min-h-screen bg-white text-gray-900 px-6 py-24 md:px-12 max-w-4xl mx-auto">
            <a href="/" className="text-sm text-gray-400 hover:text-gray-900 transition-colors fixed top-6 left-6 z-50">
                ← vedantlahane.vercel.app
            </a>

            <header className="mb-20 pt-12">
                <h1 className="text-5xl md:text-6xl font-light mb-6">Design Lab</h1>
                <p className="text-lg text-gray-500 max-w-[500px]">
                    Experiments in portfolio design.<br />
                    Same person, different perspectives.
                </p>
            </header>

            <div className="flex flex-col">
                <ProjectRow
                    name="v3 — Editorial"
                    desc="Swiss-style minimalist design"
                    status="current"
                    year="2025"
                    link="/"
                />
                <ProjectRow
                    name="v2 — Gradient Glass"
                    desc="Dark theme with glassmorphism"
                    status="archived"
                    year="2024"
                    link="/v2"
                />
                <ProjectRow
                    name="Brutalist"
                    desc="Raw, high-contrast, intentionally rough"
                    status="experiment"
                    year="2025"
                    link="/lab/brutalist"
                />
                <ProjectRow
                    name="Terminal"
                    desc="Interactive CLI-based experience"
                    status="experiment"
                    year="2025"
                    link="/lab/terminal"
                />
                <ProjectRow
                    name="3D Immersive"
                    desc="Three.js interactive environment"
                    status="coming soon"
                    year="2025"
                    link="#"
                />
            </div>
        </div>
    );
}

function ProjectRow({ name, desc, status, year, link }) {
    const statusColors = {
        "current": "bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium",
        "archived": "bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs",
        "experiment": "bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs",
        "coming soon": "bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-xs opacity-80"
    };

    const isComingSoon = status === "coming soon";
    const Wrapper = isComingSoon ? "div" : "a";

    return (
        <Wrapper
            href={!isComingSoon ? link : undefined}
            className={`group relative flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-200 transition-colors duration-200 ${!isComingSoon ? "hover:bg-gray-50 cursor-pointer -mx-6 px-6" : "cursor-default opacity-50"}`}
        >
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2 md:mb-0">
                <h2 className={`text-xl font-medium text-gray-900 transition-transform duration-200 ${!isComingSoon ? "group-hover:translate-x-2" : ""}`}>
                    <span className={`absolute left-2 opacity-0 transition-opacity duration-200 ${!isComingSoon ? "group-hover:opacity-100" : ""}`}>→</span>
                    {name}
                </h2>
                <span className="hidden md:inline text-gray-300">············</span>
                <span className={statusColors[status]}>{status}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex-1 md:flex-none">{desc}</span>
                <span className="hidden md:inline">{year}</span>
                {!isComingSoon && <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400">→</span>}
            </div>
        </Wrapper>
    );
}
