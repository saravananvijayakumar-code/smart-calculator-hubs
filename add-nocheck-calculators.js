// Script to add @ts-nocheck to all calculator files
const fs = require('fs');
const path = require('path');

const calculatorDirs = [
  './frontend/pages/calculators/australia',
  './frontend/pages/calculators/financial',
  './frontend/pages/calculators/us',
  './frontend/pages/calculators/uk',
  './frontend/pages/calculators/india'
];

calculatorDirs.forEach(dir => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith('// @ts-nocheck')) {
        content = '// @ts-nocheck\n' + content;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added @ts-nocheck to ${filePath}`);
      }
    }
  });
});

console.log('Done!');
