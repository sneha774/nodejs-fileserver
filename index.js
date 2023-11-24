const fs = require('fs').promises;
const path = require('path');

async function main() {
    const currentDir = path.resolve(__dirname);
    const allFiles = await GetAllFiles(currentDir);
    ListFiles(allFiles);
}
main();

async function GetAllFiles(dirPath) {
    const files = await fs.readdir(dirPath);
    const allFiles = [];

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const fileStat = await fs.stat(fullPath);
        if (fileStat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                const subDirFiles = await GetAllFiles(fullPath);
                allFiles.push(...subDirFiles);
            }
        } else {
            allFiles.push(fullPath);
        }
    }
    return allFiles;
}

async function ListFiles(allFiles) {
    for (const file of allFiles) {
        console.log(`\t${file}`);
    }
}