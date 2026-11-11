const fs = require('fs');
const content = fs.readFileSync('blush_chunk.js', 'utf8');

const regex = /https:\/\/pub-[^"'\s\\]+/g;
const matches = Array.from(new Set(content.match(regex) || []));

console.log('Total URLs:', matches.length);
matches.forEach(url => {
  if (url.includes('.mp4') || url.includes('godsymbols') || url.includes('animated') || url.includes('Envelope')) {
    console.log(url);
  }
});
