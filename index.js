#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2];

if (!projectName) {
  console.error(
    '❌ Please specify a project name: npx create-backend-template my-app'
  );
  process.exit(1);
}

const destPath = path.join(process.cwd(), projectName);
fs.mkdirSync(destPath, { recursive: true });

// Copy files recursively
function copyRecursive(src, dest) {
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPathFile = path.join(dest, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPathFile, { recursive: true });
      copyRecursive(srcPath, destPathFile);
    } else {
      fs.copyFileSync(srcPath, destPathFile);
    }
  });
}

copyRecursive(path.join(__dirname, 'template'), destPath);

console.log('\n🚀✨ Your new express project!\n');
console.log(`✅ Project "${projectName}" has been crafted successfully! 🎉\n`);
console.log('📂 Next steps:');
console.log(`   👉  cd ${projectName}`);
console.log('   📦  npm install');
console.log('   🧠  npm run dev\n');
console.log(
  '💡 Tips: Customize your app, save changes, and watch the magic unfold! 🔮\n'
);
console.log('📝 Note: Copy .env.example → .env before starting! ⚙️\n');
console.log('Happy coding! 🚀\n');
