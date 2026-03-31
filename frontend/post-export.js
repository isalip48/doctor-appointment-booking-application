const fs = require('fs');
const path = require('path');

function copyAssetsFlat(dir, dest) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      copyAssetsFlat(fullPath, dest);
    } else {
      // Copy the file to the destination root
      const destPath = path.join(dest, file);
      fs.copyFileSync(fullPath, destPath);
      console.log(`Copied ${file} to root dist folder.`);
    }
  });
}

const sourceDir = path.join(__dirname, 'dist', 'assets', 'node_modules');
const destDir = path.join(__dirname, 'dist');

if (fs.existsSync(sourceDir)) {
  console.log('Flattening node_modules assets to fix 404s on Vercel...');
  copyAssetsFlat(sourceDir, destDir);
} else {
  console.log('No node_modules assets found to flatten.');
}
