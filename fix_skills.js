const fs = require('fs');

const path = 'client/src/components/sections/Skills.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/import \{ useAdmin, API_URL \} from '\.\.\/\.\.\/context\/AdminContext';/, "import { useAdmin, API_URL } from '../../context/AdminContext';\nimport { usePortfolio } from '../../context/PortfolioContext';");

content = content.replace(/const \{ isAdmin, token \} = useAdmin\(\);\n  const \[categories, setCategories\] = useState\(\[\]\);\n  const \[loading, setLoading\] = useState\(true\);[\s\S]*?window\.removeEventListener\('portfolio-data-updated', handleUpdate\);\n  \}, \[\]\);/, "const { isAdmin, token } = useAdmin();\n  const { skills: categories, setSkills: setCategories, fetchAllData } = usePortfolio();\n  const [loading, setLoading] = useState(false);\n\n  const [isMobile, setIsMobile] = useState(false);\n  const [activeSection, setActiveSection] = useState(null);\n  const [isPaused, setIsPaused] = useState(false);\n  const [isExpanded, setIsExpanded] = useState(false);\n  const [visibleSkillIndex, setVisibleSkillIndex] = useState(0);\n\n  const animationStartRef = useRef(performance.now());\n  const pausedAtRef = useRef(null);\n  const rafRef = useRef(null);\n  const marqueeRef = useRef(null);\n  const expandedPanelRef = useRef(null);\n  const [expandedPanelHeight, setExpandedPanelHeight] = useState(0);\n\n  const fetchSkills = async () => {\n    await fetchAllData();\n  };");

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Skills');
