const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/optimize-image.js <input_path> <output_slug>');
  process.exit(1);
}

const inputPath = args[0];
const slug = args[1];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'services');
const outputPath = path.join(outputDir, `${slug}.webp`);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Optimizing ${inputPath} and saving to ${outputPath}...`);

sharp(inputPath)
  .resize(800, 1067, {
    fit: 'cover',
    position: 'center'
  })
  .webp({ quality: 80 })
  .toFile(outputPath)
  .then(info => {
    console.log(`Success! Image size: ${(info.size / 1024).toFixed(2)} KB`);
  })
  .catch(err => {
    console.error('Error optimizing image:', err);
    process.exit(1);
  });
