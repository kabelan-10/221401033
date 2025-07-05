const fs = require('fs');
const path = './data.json';

function readDB() {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ urls: [] }, null, 2));
  }
  const data = JSON.parse(fs.readFileSync(path));
  console.log('📦 DB Read:', JSON.stringify(data, null, 2)); // 👈 Add this line
  return data;
}


function writeDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };