import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const reportDirectory = path.join(process.cwd(), 'src/content/reports');

export type Report = {
    slug: string;
    title: string;
    date: string;
    tags?: string[];
    content: string;
    cover?: string;
};

export function getReportSlugs() {
    if (!fs.existsSync(reportDirectory)) {
        return [];
    }
    return fs.readdirSync(reportDirectory).filter((file) => file.endsWith('.md'));
}

export function getReportBySlug(slug: string): Report {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(reportDirectory, `${realSlug}.md`);
    console.log(`[DEBUG] Processing slug: ${realSlug}, Path: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
        console.error(`[ERROR] File not found: ${fullPath}`);
        throw new Error(`Report not found: ${realSlug}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Fallback metadata extraction from filename or content if frontmatter is missing
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
        title,
        date,
        tags: data.tags || ['R&D'],
        content,
        cover: data.cover,
    };
}

export function getAllReports(): Report[] {
    const slugs = getReportSlugs();
    const reports = slugs
        .map((slug) => getReportBySlug(slug))
        // sort posts by date in descending order
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return reports;
}
