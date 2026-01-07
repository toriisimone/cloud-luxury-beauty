const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'dist-package');

// Clean output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Files and directories to include
const includePaths = [
  'backend',
  'frontend',
  'deploy',
  'package.json',
  'README.md',
  'LICENSE',
  '.gitignore',
  'api-docs.md',
  'CONTRIBUTING.md',
  'NOTES.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'CODE_OF_CONDUCT.md',
];

// Copy files
includePaths.forEach(item => {
  const srcPath = path.join(projectRoot, item);
  const destPath = path.join(outputDir, item);
  
  if (fs.existsSync(srcPath)) {
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
});

// Remove node_modules and build artifacts
const removeDirs = ['node_modules', 'dist', 'build', '.next', 'coverage'];
function cleanDir(dir) {
  const fullPath = path.join(outputDir, dir);
  if (fs.existsSync(fullPath)) {
    const items = fs.readdirSync(fullPath);
    items.forEach(item => {
      const itemPath = path.join(fullPath, item);
      if (removeDirs.includes(item)) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else if (fs.statSync(itemPath).isDirectory()) {
        cleanDir(path.join(dir, item));
      }
    });
  }
}

cleanDir('backend');
cleanDir('frontend');

console.log('Package prepared in dist-package/');
console.log('You can now zip this directory for distribution.');
