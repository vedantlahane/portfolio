const fs = require('fs');

const path = 'client/src/pages/PersonalVaultPage.jsx';
let content = fs.readFileSync(path, 'utf8');

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

// 5. Replace mapped list with KnowledgeEntry
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

if (content.includes('filteredKnowledge.map((item) => (')) {
    const idx1 = content.indexOf('filteredKnowledge.map((item) => (');
    const idx2 = content.indexOf('                          )}', idx1);
    if (idx1 !== -1 && idx2 !== -1) {
        content = content.substring(0, idx1) + newMapStr + "\n" + content.substring(idx2);
    }
}

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
