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
            <div className="pt-6 pb-4 max-w-3xl prose prose-gray dark:prose-invert prose-p:text-lg prose-p:font-sans prose-p:font-light prose-p:leading-relaxed prose-headings:font-display prose-headings:font-light prose-a:text-accent">
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


// 1. Add editingKnowledgeId state
if (!content.includes('const [editingKnowledgeId, setEditingKnowledgeId]')) {
    content = content.replace(
        "const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);", 
        "const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);\n    const [editingKnowledgeId, setEditingKnowledgeId] = useState(null);"
    );
}

// 2. Add handleEditKnowledge callback
if (!content.includes('const handleEditKnowledge = (item) =>')) {
    content = content.replace(
        "const handleAddKnowledge = async (e) => {",
        "const handleEditKnowledge = (item) => {\n      setNewKnowledge({\n        title: item.title,\n        category: item.category,\n        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,\n        content: item.content,\n        pinned: item.pinned\n      });\n      setEditingKnowledgeId(item.id);\n      setIsAddingKnowledge(true);\n    };\n\n    const handleAddKnowledge = async (e) => {"
    );
}

// 3. Update handleAddKnowledge for PUT
content = content.replace(/const res = await fetch\(`\$\{API_URL\}\/api\/form-profile\/knowledge`,\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json',\s*'Authorization':\s*`Bearer \$\{token\}`\s*\},\s*body:\s*JSON\.stringify\(payload\)\s*\}\s*\);/m, 
"const url = editingKnowledgeId ? `${API_URL}/api/form-profile/knowledge/${editingKnowledgeId}` : `${API_URL}/api/form-profile/knowledge`;\n        const method = editingKnowledgeId ? 'PUT' : 'POST';\n        const res = await fetch(url, {\n          method,\n          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },\n          body: JSON.stringify(payload)\n        });");

// 4. Update resets
content = content.replace(
    "setNewKnowledge({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false });\n          setIsAddingKnowledge(false);",
    "setNewKnowledge({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false });\n          setIsAddingKnowledge(false);\n          setEditingKnowledgeId(null);"
);

content = content.replace(
    "<button onClick={() => setIsAddingKnowledge(false)} className=\"text-xs font-mono text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer\">CANCEL</button>",
    "<button onClick={() => { setIsAddingKnowledge(false); setEditingKnowledgeId(null); setNewKnowledge({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false }); }} className=\"text-xs font-mono text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer\">CANCEL</button>"
);


const oldMapStr = `                            filteredKnowledge.map((item) => (
                              <div key={item.id} className="group border-t border-gray-200 dark:border-neutral-800/80 py-10 flex flex-col items-start gap-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-neutral-900/10">
                                <div className="flex w-full justify-between items-start gap-4">
                                  <h3 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white">
                                    {item.title}
                                  </h3>
                                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeleteKnowledge(item.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-lg font-sans font-light text-gray-600 dark:text-neutral-400 leading-relaxed max-w-3xl whitespace-pre-wrap">
                                  {item.content}
                                </p>
                                <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                  <span className="text-accent">{item.category}</span>
                                  {item.tags && Array.isArray(item.tags) && item.tags.map(t => (
                                    <span key={t}>#{t}</span>
                                  ))}
                                </div>
                              </div>
                            ))`;

const newMapStr = `                            filteredKnowledge.map((item) => (
                              <KnowledgeEntry key={item.id} item={item} onDelete={handleDeleteKnowledge} onEdit={handleEditKnowledge} />
                            ))`;

content = content.replace(oldMapStr, newMapStr);


// 6. Update titles
content = content.replace(
    "<h3 className=\"text-xl font-display font-light\">New Knowledge Entry</h3>",
    "<h3 className=\"text-xl font-display font-light\">{editingKnowledgeId ? 'Edit Knowledge Entry' : 'New Knowledge Entry'}</h3>"
);

content = content.replace(
    "ADD TO KNOWLEDGE BASE",
    "{editingKnowledgeId ? 'UPDATE KNOWLEDGE BASE' : 'ADD TO KNOWLEDGE BASE'}"
);


fs.writeFileSync(path, content, 'utf8');
console.log('Vault perfectly updated!');
