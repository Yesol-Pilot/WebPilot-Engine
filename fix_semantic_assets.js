const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/semanticAssets.generated.ts');

try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Count occurrences before replacement
    const matchCount = (content.match(/\.glb\.glb/g) || []).length;
    console.log(`Found ${matchCount} occurrences of .glb.glb`);

    if (matchCount > 0) {
        content = content.replace(/\.glb\.glb/g, '.glb');
        fs.writeFileSync(filePath, content);
        console.log('Successfully fixed .glb.glb double extensions.');
    } else {
        console.log('No .glb.glb double extensions found.');
    }

} catch (error) {
    console.error('Error fixing file:', error);
}
