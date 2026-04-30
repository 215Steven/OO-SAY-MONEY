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
  if (text.includes('æ')) {
    const buf = Buffer.from(text, 'latin1');
    const fixed = buf.toString('utf8');
    fs.writeFileSync(file, fixed);
    console.log("Fixed", file);
  }
});
