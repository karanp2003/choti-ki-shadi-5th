/**
 * Deploy build: injects absolute site + share-source.jpg URL into Open Graph meta tags.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const indexPath = path.join(root, "index.html");
const metaPath = path.join(root, "og-meta.json");

function normalizeSiteUrl(raw) {
  if (!raw) return "";
  const trimmed = String(raw).trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const siteUrl =
  normalizeSiteUrl(process.env.SITE_URL) ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  normalizeSiteUrl(process.env.VERCEL_URL);

let configuredImage = normalizeSiteUrl(process.env.OG_IMAGE_URL);
let imagePath = "/share-source.jpg";

if (!configuredImage) {
  const cfgCandidates = [
    path.join(root, "js", "wedding-config.js"),
    path.join(root, "wedding-config.js"),
  ];
  for (const cfgPath of cfgCandidates) {
    if (!fs.existsSync(cfgPath)) continue;
    try {
      const cfgText = fs.readFileSync(cfgPath, "utf8");
      const urlMatch = cfgText.match(/ogImageUrl:\s*"([^"]+)"/);
      if (urlMatch && urlMatch[1].trim()) {
        configuredImage = normalizeSiteUrl(urlMatch[1]);
        break;
      }
      const pathMatch = cfgText.match(/ogImagePath:\s*"([^"]+)"/);
      if (pathMatch && pathMatch[1].trim()) {
        imagePath = pathMatch[1].trim();
      }
      const photoMatch = cfgText.match(/sharePhoto:\s*"([^"]+)"/);
      if (photoMatch && photoMatch[1].trim() && imagePath === "/share-source.jpg") {
        imagePath = "/" + photoMatch[1].trim().replace(/^\//, "");
      }
    } catch {
      /* optional */
    }
  }
}

let imageWidth = "1200";
let imageHeight = "1200";

if (fs.existsSync(metaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    imagePath = meta.whatsapp?.path || imagePath;
    if (meta.whatsapp?.width) imageWidth = String(meta.whatsapp.width);
    if (meta.whatsapp?.height) imageHeight = String(meta.whatsapp.height);
  } catch {
    /* defaults */
  }
}

const baseSite = (siteUrl || "http://localhost:3000").replace(/\/$/, "");
const ogImageBase = configuredImage || `${baseSite}${imagePath}`;

let html = fs.readFileSync(indexPath, "utf8");
html = html.replaceAll("__SITE_URL__", baseSite);
html = html.replaceAll("__OG_IMAGE_URL__", ogImageBase);
html = html.replaceAll("__OG_IMAGE_WIDTH__", imageWidth);
html = html.replaceAll("__OG_IMAGE_HEIGHT__", imageHeight);

fs.writeFileSync(indexPath, html);

console.log(`Open Graph base URL: ${baseSite}`);
console.log(`Open Graph image URL: ${ogImageBase}`);
