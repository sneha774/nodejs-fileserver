const fs = require('fs').promises;
const path = require('path');

async function main() {
    const storesDir = path.join(__dirname, 'stores');
    const storeSalesFiles = await GetAllFiles(storesDir);
    console.log('All Store Sales files:');
    ListFiles(storeSalesFiles);

    const totalSales = await CalculateTotalSales(storeSalesFiles);
    console.log(`Total Sales: ${totalSales}`);

    await WriteSalesReport(totalSales, storeSalesFiles);
}
main();

/**
 * Retrieves all files with a .json extension from the specified directory and its subdirectories.
 * @param {string} dirPath - The path of the directory to search for files.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
 */
async function GetAllFiles(dirPath) {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const files = [];

    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
            if (item !== 'node_modules' && item !== '.git') {
                const subDirFiles = await GetAllFiles(fullPath);
                files.push(...subDirFiles);
            }
        } else {
            if (path.extname(fullPath) === '.json') {
                files.push(fullPath);
            }
        }
    }
    return files;
}

/**
 * Lists all files in the given array.
 * @param {Array<string>} allFiles - The array of file names.
 * @returns {Promise<void>} - A promise that resolves when all files have been listed.
 */
async function ListFiles(allFiles) {
    for (const file of allFiles) {
        console.log(`- ${file}`);
    }
}

/**
 * Calculates the total sales from an array of store sales files.
 * @param {string[]} storeSalesFiles - The array of file paths to store sales files.
 * @returns {Promise<number>} The total sales.
 */
async function CalculateTotalSales(storeSalesFiles) {
    let totalSales = 0;
    for (const file of storeSalesFiles) {
        const storeSales = await fs.readFile(file);
        const salesData = JSON.parse(storeSales);
        totalSales += salesData.total;
    }
    return totalSales;
}

async function WriteSalesReport(totalSales, storeSalesFiles) {
    const report = {
        totalSales: totalSales,
        totalStores: storeSalesFiles.length
    };

    const storeTotalsDir = path.join(__dirname, 'salesTotals');
    try {
        await fs.mkdir(storeTotalsDir);
    }
    catch (err) {
        console.error(`Creating directory: ${err.message}`);
    }

    const reportFilePath = path.join(storeTotalsDir, 'report.json');
    try {
        await fs.unlink(reportFilePath);
    }
    catch (err) {
        console.error(`Deleting file: ${err.message}`);
    }

    await fs.writeFile(reportFilePath, JSON.stringify(report, null, 2));
    console.log(`Sales report writen to ${reportFilePath}`);
}