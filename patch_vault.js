const fs = require('fs');

const path = 'client/src/pages/PersonalVaultPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add ReactMarkdown import if not present
if (!content.includes('import ReactMarkdown')) {
    content = content.replace("import ThemeToggle from '../components/UI/ThemeToggle';", "import ThemeToggle from '../components/UI/ThemeToggle';\nimport ReactMarkdown from 'react-markdown';");
}

// Add EditIcon
const editIconStr = `
const EditIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
`;

if (!content.includes('EditIcon')) {
    content = content.replace("const RefreshIcon", editIconStr + "\nconst RefreshIcon");
}

// Component string for KnowledgeEntry
const entryStr = `
const KnowledgeEntry = ({ item, onDelete, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="group border-t border-gray-200 dark:border-neutral-800/80 py-8 flex flex-col items-start gap-4 transition-colors hover:bg-gray-50/20 dark:hover:bg-neutral-900/10">
      <div 
        className="flex w-full justify-between items-start gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white group-hover:text-accent transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="text-gray-400 hover:text-accent transition-colors cursor-pointer" title="Edit">
            <EditIcon className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Delete">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden w-full"
          >
            <div className="pt-6 pb-4 max-w-3xl">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-display mt-8 mb-4 text-gray-900 dark:text-white" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-display mt-6 mb-3 text-gray-900 dark:text-white" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-display mt-4 mb-2 text-gray-900 dark:text-white" {...props} />,
                  p: ({node, ...props}) => <p className="text-lg font-sans font-light leading-relaxed mb-4 text-gray-700 dark:text-neutral-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-neutral-300" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-neutral-300" {...props} />,
                  li: ({node, ...props}) => <li className="text-lg font-sans font-light" {...props} />,
                  a: ({node, ...props}) => <a className="text-accent underline" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-medium text-gray-900 dark:text-white" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-accent pl-4 italic my-4 text-gray-600 dark:text-neutral-400" {...props} />,
                  code: ({node, inline, ...props}) => inline ? <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-sm text-accent" {...props} /> : <pre className="bg-gray-900 dark:bg-black text-white p-4 rounded overflow-x-auto my-4 font-mono text-sm"><code {...props} /></pre>
                }}
              >
                {item.content}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
        <span className="text-accent">{item.category}</span>
        {item.tags && Array.isArray(item.tags) && item.tags.map(t => (
          <span key={t}>#{t}</span>
        ))}
      </div>
    </div>
  );
};
`;

if (!content.includes('const KnowledgeEntry')) {
    content = content.replace("const SECTIONS", entryStr + "\nconst SECTIONS");
}

fs.writeFileSync(path, content, 'utf8');
console.log('KnowledgeEntry component added');
