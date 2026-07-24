const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directories = [
  path.join(__dirname, 'public', 'images'),
  path.join(__dirname, 'public', 'homepage', 'Introimages')
];

async function convertDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);
  console.log(`Scanning ${dirPath} - found ${files.length} items.`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const inputPath = path.join(dirPath, file);
      const outputName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(dirPath, outputName);

      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Converted: ${file} -> ${outputName}`);
        
        // Delete original file to keep only webp
        fs.unlinkSync(inputPath);
        console.log(`Deleted original: ${file}`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err.message);
      }
    }
  }
}

async function main() {
  for (const dir of directories) {
    await convertDir(dir);
  }
  console.log('Image conversion completed successfully.');
}

main();
