import fs from 'fs';

function replaceInFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/"LINE UserID"/g, '"LINE User ID"');
  content = content.replace(/"LINE 名稱"/g, '"名字"');
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('api/index.ts');
replaceInFile('server.ts');
console.log('Done');
