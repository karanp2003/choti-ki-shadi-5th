/**
 * Serves share-source.jpg with HTTP 200 only (no 206 ranges) — WhatsApp preview compatibility.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FILE = path.join(ROOT, "share-source.jpg");

module.exports = (req, res) => {
  if (!fs.existsSync(FILE)) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("share-source.jpg not found");
    return;
  }

  const buf = fs.readFileSync(FILE);
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Length", buf.length);
  res.setHeader("Accept-Ranges", "none");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(buf);
};
