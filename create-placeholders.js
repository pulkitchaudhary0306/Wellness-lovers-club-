const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images');

// Create the directory if it doesn't exist
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// 1x1 pixel grey JPEG base64
const base64Jpeg = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
const buffer = Buffer.from(base64Jpeg, 'base64');

const images = [
  'hero-wellness.jpg',
  'philosophy-resort.jpg',
  'wellness-retreat.jpg',
  'wellness-experience.jpg',
  'exclusive-privileges.jpg',
  'membership-spa.jpg',
  'membership-resort.jpg',
  'journey-wellness.jpg',
  'bali.jpg',
  'maldives.jpg',
  'switzerland.jpg',
  'thailand.jpg',
  'india.jpg',
  'sri-lanka.jpg'
];

images.forEach(imageName => {
  const filePath = path.join(dir, imageName);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created placeholder: ${imageName}`);
});

console.log('All image placeholders generated successfully!');
