// Script to fix all icon imports - to be run with node

const fs = require('fs');
const path = require('path');

const iconReplacements = {
  'Percent': 'Hash',
  'PiggyBank': 'Wallet',
  'Receipt': 'FileText'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Replace in imports
  Object.entries(iconReplacements).forEach(([old, newIcon]) => {
    const importRegex = new RegExp(`\\b${old}\\b`, 'g');
    if (content.match(importRegex)) {
      content = content.replace(importRegex, newIcon);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(filePath);
    }
  });
}

walkDir('./frontend');
console.log('All icons fixed!');
