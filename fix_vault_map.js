const fs = require('fs');

const path = 'client/src/pages/PersonalVaultPage.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                          ) : (
                            filteredKnowledge.map((item) => (
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
                            ))
                          )}`;

const replacementStr = `                          ) : (
                            filteredKnowledge.map((item) => (
                              <KnowledgeEntry key={item.id} item={item} onDelete={handleDeleteKnowledge} onEdit={handleEditKnowledge} />
                            ))
                          )}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed exactly');
