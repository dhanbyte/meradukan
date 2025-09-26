const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const width = 800;
const height = 800;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

// Fill background
context.fillStyle = '#f3f4f6';
context.fillRect(0, 0, width, height);

// Add text
context.fillStyle = '#9ca3af';
context.font = 'bold 24px Arial';
context.textAlign = 'center';
context.textBaseline = 'middle';
context.fillText('Image Not Available', width / 2, height / 2);

// Create images directory if it doesn't exist
const dir = path.join(__dirname, '../public/images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Save to file
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
fs.writeFileSync(path.join(dir, 'placeholder.jpg'), buffer);

console.log('Placeholder image generated successfully!');
