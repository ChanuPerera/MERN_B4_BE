
const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, 'watches.json');

async function readDB(){
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
            if(error.code === 'ENOENT') return[];
            throw error;
    }
}


async function writeDB(items) {
    await fs.writeFile(DB_FILE, JSON.stringify(items, null, 2) , 'utf8'); 
}

module.exports = {
   readDB,
writeDB
}
