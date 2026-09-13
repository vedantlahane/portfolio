const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Simple heuristic: if we see bg-white without dark:bg-, we add it. 
    // This is tricky because we might double add. Better to just do explicit replaces.
    // For PracticeList.jsx
    if (filePath.includes('PracticeList.jsx')) {
        content = content.replace(/border-gray-200(?! dark:border-)/g, 'border-gray-200 dark:border-neutral-800');
        content = content.replace(/bg-white(?! \/| dark:bg-|\/)/g, 'bg-white dark:bg-black');
        content = content.replace(/bg-gray-50(?! dark:bg-)/g, 'bg-gray-50 dark:bg-neutral-900/30');
        content = content.replace(/text-gray-900(?! dark:text-)/g, 'text-gray-900 dark:text-white');
        content = content.replace(/text-gray-700(?! dark:text-)/g, 'text-gray-700 dark:text-neutral-300');
        content = content.replace(/text-gray-600(?! dark:text-)/g, 'text-gray-600 dark:text-neutral-400');
        content = content.replace(/text-gray-500(?! dark:text-)/g, 'text-gray-500 dark:text-neutral-400');
        content = content.replace(/text-gray-400(?! dark:text-)/g, 'text-gray-400 dark:text-neutral-500');
        content = content.replace(/bg-white\/70/g, 'bg-white/70 dark:bg-black/70');
        content = content.replace(/hover:text-gray-900(?! dark:hover:)/g, 'hover:text-gray-900 dark:hover:text-white');
        content = content.replace(/hover:bg-gray-50(?! dark:hover:)/g, 'hover:bg-gray-50 dark:hover:bg-neutral-900/50');
    }

    if (filePath.includes('CommandPalette.jsx')) {
        content = content.replace(/border-gray-200(?! dark:border-)/g, 'border-gray-200 dark:border-neutral-800');
        content = content.replace(/bg-white(?! \/| dark:bg-|\/)/g, 'bg-white dark:bg-black');
        content = content.replace(/bg-gray-100\/80(?! dark:bg-)/g, 'bg-gray-100/80 dark:bg-neutral-900/80');
        content = content.replace(/hover:bg-gray-50(?! dark:hover:)/g, 'hover:bg-gray-50 dark:hover:bg-neutral-800/50');
        content = content.replace(/text-gray-900(?! dark:text-)/g, 'text-gray-900 dark:text-white');
        content = content.replace(/text-gray-600(?! dark:text-)/g, 'text-gray-600 dark:text-neutral-300');
        content = content.replace(/text-gray-400(?! dark:text-)/g, 'text-gray-400 dark:text-neutral-500');
    }

    if (filePath.includes('Projects.jsx')) {
        content = content.replace(/className="bg-white border border-gray-200/g, 'className="bg-white dark:bg-black border border-gray-200 dark:border-neutral-800');
        content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-neutral-800');
        content = content.replace(/border border-gray-200/g, 'border border-gray-200 dark:border-neutral-800');
        content = content.replace(/text-gray-900(?! dark:text-)/g, 'text-gray-900 dark:text-white');
        content = content.replace(/text-gray-500(?! dark:text-)/g, 'text-gray-500 dark:text-neutral-400');
        content = content.replace(/bg-gray-900 text-white/g, 'bg-gray-900 dark:bg-white text-white dark:text-black');
        content = content.replace(/hover:bg-white hover:text-gray-900/g, 'hover:bg-white dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white');
    }
    
    if (filePath.includes('Skills.jsx')) {
        content = content.replace(/border-gray-200(?! dark:border-)/g, 'border-gray-200 dark:border-neutral-800');
        content = content.replace(/bg-white(?! \/| dark:bg-|\/)/g, 'bg-white dark:bg-black');
        content = content.replace(/bg-gray-50(?! dark:bg-)/g, 'bg-gray-50 dark:bg-neutral-900/30');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed', filePath);
    }
}

const files = [
    'client/src/components/PracticeList.jsx',
    'client/src/components/CommandPalette/CommandPalette.jsx',
    'client/src/components/sections/Projects.jsx',
    'client/src/components/sections/Skills.jsx'
];

files.forEach(fixFile);
