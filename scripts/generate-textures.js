const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/textures');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// 1. Grid (Fallback)
const gridSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
 <rect width="512" height="512" fill="#333"/>
 <path d="M512 0L0 0L0 512" fill="none" stroke="#444" stroke-width="2"/>
 <path d="M0 0L512 512" fill="none" stroke="#444" stroke-width="1" opacity="0.5"/>
</svg>`;

// 2. Wood (Stylized)
const woodSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
 <rect width="512" height="512" fill="#5c4033"/>
 <filter id="noise">
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0.2"/>
 </filter>
 <rect width="512" height="512" filter="url(#noise)" opacity="0.4"/>
 <path d="M0 50h512M0 150h512M0 250h512M0 350h512M0 450h512" stroke="#3e2b22" stroke-width="3"/>
</svg>`;

// 3. Concrete
const concreteSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
 <rect width="512" height="512" fill="#888"/>
 <filter id="noise">
  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
 </filter>
 <rect width="512" height="512" filter="url(#noise)" opacity="0.3"/>
</svg>`;

// 4. Tile
const tileSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
 <rect width="512" height="512" fill="#ddd"/>
 <rect x="5" y="5" width="246" height="246" fill="#f0f0f0"/>
 <rect x="261" y="5" width="246" height="246" fill="#f0f0f0"/>
 <rect x="5" y="261" width="246" height="246" fill="#f0f0f0"/>
 <rect x="261" y="261" width="246" height="246" fill="#f0f0f0"/>
</svg>`;

// 5. Fabric/Carpet
const fabricSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
 <rect width="512" height="512" fill="#552233"/>
 <pattern id="pat" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
   <circle cx="5" cy="5" r="2" fill="#773344"/>
 </pattern>
 <rect width="512" height="512" fill="url(#pat)"/>
</svg>`;

const files = {
    'grid.svg': gridSvg,
    'wood.svg': woodSvg,
    'concrete.svg': concreteSvg,
    'tile.svg': tileSvg,
    'fabric.svg': fabricSvg
};

Object.entries(files).forEach(([name, content]) => {
    fs.writeFileSync(path.join(outDir, name), content);
    console.log(`Generated ${name}`);
});

console.log('✅ Texture generation complete.');
