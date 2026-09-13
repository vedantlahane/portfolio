const fs = require('fs');

const path = 'client/src/components/sections/Projects.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/import \{ useAdmin, API_URL \} from '\.\.\/\.\.\/context\/AdminContext';/, "import { useAdmin, API_URL } from '../../context/AdminContext';\nimport { usePortfolio } from '../../context/PortfolioContext';");

content = content.replace(/const \{ isAdmin, token \} = useAdmin\(\);\n  const \[projects, setProjects\] = useState\(\[\]\);[\s\S]*?window\.removeEventListener\('portfolio-data-updated', handleUpdate\);\n  \}, \[\]\);/, "const { isAdmin, token } = useAdmin();\n  const { projects, setProjects, fetchAllData } = usePortfolio();\n  const [showAll, setShowAll] = useState(false);\n  const [hoveredProject, setHoveredProject] = useState(null);\n  const [isFormOpen, setIsFormOpen] = useState(false);\n  const [editingProject, setEditingProject] = useState(null);\n\n  const fetchProjects = async () => {\n    await fetchAllData();\n  };");

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Projects');
