const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const reportDirectory = path.join(process.cwd(), 'src/content/reports');

function getReportSlugs() {
    if (!fs.existsSync(reportDirectory)) {
        console.log('Directory not found:', reportDirectory);
        return [];
    }
    return fs.readdirSync(reportDirectory).filter((file) => file.endsWith('.md'));
}

function getReportBySlug(slug) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(reportDirectory, `${realSlug}.md`);
    console.log(`[DEBUG] Processing slug: ${realSlug}, Path: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
        console.error(`[ERROR] File not found: ${fullPath}`);
        return null;
    }

    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        console.log(`[SUCCESS] Parsed ${realSlug}`);
        return { data, content };
    } catch (e) {
        console.error(`[ERROR] Failed to parse ${realSlug}:`, e);
        throw e;
    }
}

function main() {
    console.log('Checking reports...');
    const slugs = getReportSlugs();
    console.log('Slugs found:', slugs);

    for (const slug of slugs) {
        getReportBySlug(slug);
    }
    console.log('All checks done.');
}

main();
