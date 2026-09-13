const fs = require('fs');

const path = 'client/src/pages/PersonalVaultPage.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const [editingKnowledgeId, setEditingKnowledgeId]')) {
    content = content.replace(
        "const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);", 
        "const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);\n    const [editingKnowledgeId, setEditingKnowledgeId] = useState(null);"
    );
}

if (!content.includes('const handleEditKnowledge = (item) =>')) {
    content = content.replace(
        "const handleAddKnowledge = async (e) => {",
        "const handleEditKnowledge = (item) => {\n      setNewKnowledge({\n        title: item.title,\n        category: item.category,\n        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,\n        content: item.content,\n        pinned: item.pinned\n      });\n      setEditingKnowledgeId(item.id);\n      setIsAddingKnowledge(true);\n    };\n\n    const handleAddKnowledge = async (e) => {"
    );
}

content = content.replace(/const res = await fetch\(`\$\{API_URL\}\/api\/form-profile\/knowledge`,\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json',\s*'Authorization':\s*`Bearer \$\{token\}`\s*\},\s*body:\s*JSON\.stringify\(payload\)\s*\}\s*\);/m, 
"const url = editingKnowledgeId ? `${API_URL}/api/form-profile/knowledge/${editingKnowledgeId}` : `${API_URL}/api/form-profile/knowledge`;\n        const method = editingKnowledgeId ? 'PUT' : 'POST';\n        const res = await fetch(url, {\n          method,\n          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },\n          body: JSON.stringify(payload)\n        });");


content = content.replace(
    "setNewKnowledge({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false });\n          setIsAddingKnowledge(false);",
    "setNewKnowledge({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false });\n          setIsAddingKnowledge(false);\n          setEditingKnowledgeId(null);"
);

content = content.replace(
    "<button onClick={() => setIsAddingKnowledge(false)} className=\"text-xs font-mono text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer\">CANCEL</button>",
    "<button onClick={() => { setIsAddingKnowledge(false); setEditingKnowledgeId(null); setNewKnowledge({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false }); }} className=\"text-xs font-mono text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer\">CANCEL</button>"
);

content = content.replace(
    "filteredKnowledge.map((item) => (\n                              <div key={item.id}",
    "filteredKnowledge.map((item) => (\n                              <KnowledgeEntry key={item.id} item={item} onDelete={handleDeleteKnowledge} onEdit={handleEditKnowledge} />\n                            ))"
);
// Above regex handles the original fallback in case I messed it up, but let me do it robustly.

// Wait, I already replaced the old rendering logic in `patch_vault.js`!
// Wait! `patch_vault.js` DID NOT replace the old rendering logic because it failed! Ah!
fs.writeFileSync(path, content, 'utf8');
console.log('Done');
