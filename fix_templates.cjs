const fs = require('fs');
let t = fs.readFileSync('src/pages/AppointmentPage.tsx', 'utf8');
t = t.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/pages/AppointmentPage.tsx', t);
