const fs = require('fs');

function fixFile(filePath) {
  let text = fs.readFileSync(filePath, 'utf8');
  // Check if it's already fixed (e.g., contains '保險')
  if (text.includes('保險')) {
    console.log(filePath, 'already fixed');
    return;
  }
  const buf = Buffer.from(text, 'binary');
  const fixed = buf.toString('utf8');
  if (fixed.includes('')) {
    console.log("Could not fix cleanly via binary read for", filePath);
    // fallback?
  } else {
    fs.writeFileSync(filePath, fixed);
    console.log("Fixed", filePath);
  }
}

fixFile('src/pages/DefensePage.tsx');
fixFile('src/pages/MoneyTool.tsx'); // Check this one too
fixFile('src/pages/AppointmentPage.tsx');
fixFile('src/pages/QuizPage.tsx');
fixFile('src/pages/BlueprintPage.tsx');
fixFile('src/pages/RoleHome.tsx');
