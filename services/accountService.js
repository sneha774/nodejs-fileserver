const fs = require('fs');

const readAccountsDb = () => {
    try {
        const accountsData = fs.readFileSync('data/accountsDb.json', 'utf8');
        return JSON.parse(accountsData);
    } catch (error) {
        console.error('Error reading accountsDb:', error);
        return null;
    }
};

module.exports = readAccountsDb;
