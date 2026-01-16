import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'src/content');
const dailyDir = path.join(contentDir, 'daily');
const docsDir = path.join(contentDir, 'docs');

export type ReportType = 'daily' | 'doc';

export type Report = {
    slug: string;
    type: ReportType;
    title: string;
    date: string;
    tags?: string[];
    content: string;
    cover?: string;
};

// Helper to get slugs from a directory
function getSlugs(dir: string) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((file) => file.endsWith('.md'));
}

export function getReportBySlug(slug: string): Report {
    const realSlug = slug.replace(/\.md$/, '');

    // Try daily first, then docs
    let fullPath = path.join(dailyDir, `${realSlug}.md`);
    let type: ReportType = 'daily';

    if (!fs.existsSync(fullPath)) {
        fullPath = path.join(docsDir, `${realSlug}.md`);
        type = 'doc';
    }

    if (!fs.existsSync(fullPath)) {
        console.error(`[ERROR] File not found: ${fullPath} (searched in daily and docs)`);
        throw new Error(`Report not found: ${realSlug}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Metadata extraction
    let title = data.title;
    let date = data.date;

    if (!title) {
        const titleMatch = content.match(/^# (.+)$/m);
        title = titleMatch ? titleMatch[1] : realSlug;
    }

    if (!date) {
        const dateMatch = realSlug.match(/(\d{4}_\d{2}_\d{2})/);
        date = dateMatch ? dateMatch[1].replace(/_/g, '-') : new Date().toISOString().split('T')[0];
    }

    return {
        slug: realSlug,
        type,
        title,
        date,
        tags: data.tags || (type === 'daily' ? ['R&D', 'Log'] : ['Architecture']),
        content,
        cover: data.cover,
    };
}

export function getDailyReports(): Report[] {
    const slugs = getSlugs(dailyDir);
    return slugs
        .map((slug) => getReportBySlug(slug))
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getDocReports(): Report[] {
    const slugs = getSlugs(docsDir);
    return slugs
        .map((slug) => getReportBySlug(slug))
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllReports(): Report[] {
    return [...getDailyReports(), ...getDocReports()].sort((a, b) => (a.date > b.date ? -1 : 1));
}
