const fs = require('fs');

const landingPath = 'client/src/pages/Landing.jsx';
let landing = fs.readFileSync(landingPath, 'utf8');

// Replace local state with usePortfolio
landing = landing.replace(/import \{ useAdmin, API_URL \} from '\.\.\/context\/AdminContext';/, "import { useAdmin, API_URL } from '../context/AdminContext';\nimport { usePortfolio } from '../context/PortfolioContext';");

landing = landing.replace(/const \[profile, setProfile\] = useState\(null\);\n  const \{ token \} = useAdmin\(\);\n\n  useEffect\(\(\) => \{\n    const fetchProfile[\s\S]*?window\.removeEventListener\('portfolio-data-updated', handleUpdate\);\n  \}, \[\]\);/, "const { token } = useAdmin();\n  const { profile, setProfile } = usePortfolio();");

fs.writeFileSync(landingPath, landing, 'utf8');
console.log('Fixed Landing');
