const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
      callback(filePath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Convert image extensions inside /images/ or /homepage/ to .webp
  // Matches e.g. "/images/name.jpg", '/homepage/name.png', `/images/sub/name.jpeg`
  const pathRegex = /(\/(?:images|homepage)\/[^"'\s`{}()<>]+)\.(?:jpg|jpeg|png)/g;
  content = content.replace(pathRegex, '$1.webp');

  // 2. Add loading="lazy" to all HTML <img> tags if not already present
  // Matches <img ... without loading="lazy" or loading={'lazy'} or loading={"lazy"}
  // Make sure not to double add loading="lazy"
  const imgRegex = /<img(?![^>]*\bloading\s*=)([^>]*)\/?>/g;
  content = content.replace(imgRegex, (match, attributes) => {
    // Clean up trailing slash if present to format nicely as <img loading="lazy" attributes />
    let cleanAttributes = attributes.trim();
    if (cleanAttributes.endsWith('/')) {
      cleanAttributes = cleanAttributes.slice(0, -1).trim();
    }
    return `<img loading="lazy" ${cleanAttributes} />`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated file: ${path.relative(__dirname, filePath)}`);
  }
}

function main() {
  console.log('Scanning src directory for codebase updates...');
  walkDir(srcDir, processFile);
  console.log('Codebase updates completed successfully.');
}

main();
