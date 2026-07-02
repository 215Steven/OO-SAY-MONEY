import fs from 'fs';

function fixWebhook(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/lineMiddleware\(lineConfig\),/g, 'express.json(),');
  fs.writeFileSync(filePath, content, 'utf8');
}

fixWebhook('api/index.ts');
fixWebhook('server.ts');
console.log('Done');
