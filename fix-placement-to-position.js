const fs = require('fs');
const path = require('path');

function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const frontendDir = path.join(__dirname, 'frontend');
const tsxFiles = getAllTsxFiles(frontendDir);

let totalReplacements = 0;

tsxFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  const replacements = [
    { from: /placement="top-banner"/g, to: 'position="top"' },
    { from: /placement="mid-content"/g, to: 'position="middle"' },
    { from: /placement="in-feed"/g, to: 'position="middle"' },
    { from: /placement="in-article"/g, to: 'position="middle"' },
    { from: /placement="content"/g, to: 'position="middle"' },
    { from: /placement="bottom"/g, to: 'position="bottom"' },
  ];
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
      totalReplacements++;
    }
  });
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nTotal files updated: ${totalReplacements}`);
console.log('All placement props replaced with position props');
