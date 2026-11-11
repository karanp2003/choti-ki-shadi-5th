const fs = require('fs');
const content = fs.readFileSync('blush_chunk.js', 'utf8');

const regex = /https:\/\/[^"' \n]+\.(png|jpg|jpeg|webp|jfif|svg)/gi;
let matches = Array.from(new Set(content.match(regex) || []));
console.log('Found ' + matches.length + ' image URLs:');
matches.forEach(m => console.log(m));
