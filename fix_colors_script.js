import fs from 'fs';
import path from 'path';

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch(err) {}
  });
  return filelist;
}

const files = walkSync('./app').filter(f => f.endsWith('.tsx') || f.endsWith('.css') || f.endsWith('.ts'));

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/--green:\s*#10b981;/g, '')
    .replace(/var\(--green\)/g, 'var(--accent)')
    .replace(/\.pulse-green/g, '.pulse-cyan')
    .replace(/\.badge-green/g, '.badge-cyan')
    .replace(/pulse-green/g, 'pulse-cyan')
    .replace(/badge-green/g, 'badge-cyan')
    .replace(/rgba\(0,\s*255,\s*65,/g, 'rgba(0, 229, 255,')
    .replace(/rgba\(16,\s*185,\s*129,/g, 'rgba(0, 229, 255,')
    .replace(/#10b981/g, '#00e5ff')
    .replace(/rgba\(0,255,65,/g, 'rgba(0, 229, 255,');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated: ${file}`);
    changedFiles++;
  }
}

console.log(`Total files updated: ${changedFiles}`);
