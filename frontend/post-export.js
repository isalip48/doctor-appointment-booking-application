const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const distDir = path.join(__dirname, 'dist');
const nodeModulesAssetsDir = path.join(distDir, 'assets', 'node_modules');
const vendorAssetsDir = path.join(distDir, 'assets', 'vendor');

// Rename node_modules to vendor in assets to avoid Vercel blocklist
if (fs.existsSync(nodeModulesAssetsDir)) {
  console.log('Renaming assets/node_modules to assets/vendor to bypass Vercel blocklist...');
  fs.renameSync(nodeModulesAssetsDir, vendorAssetsDir);
}

// Replace all occurrences of /assets/node_modules/ with /assets/vendor/ in dist files
const allFiles = walk(distDir);
let changedCount = 0;

allFiles.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.map') || file.endsWith('.json')) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('/assets/node_modules/')) {
      content = content.replace(/\/assets\/node_modules\//g, '/assets/vendor/');
      fs.writeFileSync(file, content, 'utf8');
      changedCount++;
    }
  }
});

console.log(`Updated paths in ${changedCount} files.`);
