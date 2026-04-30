const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? files = files.concat(walkDir(dirPath)) : files.push(dirPath);
  });
  return files;
}

const files = walkDir('src');
files.filter(f => f.endsWith('.tsx')).forEach(file => {
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;

  const replacePatterns = [
    { from: /bg-\[\#FFFFFF\]/g, to: 'bg-white' },
    { from: /border-\[\#EAEAE6\]/g, to: 'border-warm-gray-200' },
    { from: /bg-\[\#F9F9F8\]/g, to: 'bg-warm-gray-50' },
    { from: /bg-\[\#F2F2F0\]/g, to: 'bg-warm-gray-100' },
    { from: /text-\[\#2D2D2A\]/g, to: 'text-warm-gray-800' },
    { from: /bg-\[\#2D2D2A\]/g, to: 'bg-teal-base' },
    { from: /border-\[\#2D2D2A\]/g, to: 'border-teal-base' },
    { from: /text-\[\#555\]/g, to: 'text-warm-gray-800/80' },
    { from: /text-\[\#555555\]/g, to: 'text-warm-gray-800/80' },
    { from: /text-\[\#AFAEA9\]/g, to: 'text-warm-gray-400' },
    { from: /text-\[\#D6D3D1\]/g, to: 'text-warm-gray-200' },
    { from: /text-\[\#8B8A88\]/g, to: 'text-warm-gray-600' },
    { from: /bg-[#2D2D2A]/g, to: 'bg-teal-base' },
    { from: /border-[#2D2D2A]/g, to: 'border-teal-base' },
    { from: /hover:bg-\[\#49405E\]/g, to: 'hover:bg-cyan-base' },
    { from: /bg-\[\#F8F8F6\]/g, to: 'bg-warm-gray-50' },
    // Some rounding rules
    { from: /bg-white p-6 border border-warm-gray-200/g, to: 'bg-white p-6 border border-warm-gray-200 rounded-2xl shadow-sm' },
    { from: /bg-white border border-warm-gray-200 p-6/g, to: 'bg-white border border-warm-gray-200 p-6 rounded-2xl shadow-sm' },
    { from: /bg-white border border-warm-gray-200 p-8/g, to: 'bg-white border border-warm-gray-200 p-8 rounded-2xl shadow-sm' },
    { from: /bg-warm-gray-50 p-6 border border-warm-gray-200/g, to: 'bg-warm-gray-50 p-6 border border-warm-gray-200 rounded-2xl shadow-sm' },
    { from: /bg-warm-gray-50 border border-warm-gray-200 p-6/g, to: 'bg-warm-gray-50 border border-warm-gray-200 p-6 rounded-2xl shadow-sm' },
    { from: /bg-warm-gray-50 border border-warm-gray-200 p-8/g, to: 'bg-warm-gray-50 border border-warm-gray-200 p-8 rounded-2xl shadow-sm' },
    { from: /rounded-none w-8 h-8/g, to: 'rounded-full w-8 h-8'},
    { from: /rounded-none px-3/g, to: 'rounded-full px-3'},
    { from: /text-\[\#FFFFFF\]/g, to: 'text-white' },
    { from: /border-\[\#D6D3D1\]/g, to: 'border-warm-gray-300' }
  ];

  for(const r of replacePatterns) {
    if (text.match(r.from)) {
      text = text.replace(r.from, r.to);
      changed = true;
    }
  }

  // Deduplicate classes if accidentally doubled (like rounded-2xl rounded-2xl)
  text = text.replace(/rounded-2xl shadow-sm shadow-sm/g, 'rounded-2xl shadow-sm');
  text = text.replace(/rounded-2xl rounded-2xl/g, 'rounded-2xl');
  text = text.replace(/shadow-sm shadow-sm/g, 'shadow-sm');

  if (changed) {
    fs.writeFileSync(file, text);
    console.log("Styled", file);
  }
});
