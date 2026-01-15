const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// 1. Setup
const NOTION_KEY = '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'; // Retrieved by Agent
const PAGE_ID = '2e9cdc7c24e3800cbc87fe194f20b6ac'; // 'yesol heo' Page ID

const notion = new Client({ auth: NOTION_KEY });

// 2. Report Files
const REPORTS = [
    'daily_rnd_report_2026_01_06.md',
    'daily_rnd_report_2026_01_09.md',
    'daily_rnd_report_2026_01_12.md',
    'daily_rnd_report_2026_01_14.md',
    'daily_rnd_report_2026_01_15.md'
];

const ARTIFACT_DIR = 'C:\\Users\\CTS_Sol\\.gemini\\antigravity\\brain\\d681752b-2e14-458a-8440-0731b9911ad0';

// 3. Simple Markdown Parser to Notion Blocks
function markdownToBlocks(markdown) {
    const lines = markdown.split('\n');
    const blocks = [];
    let currentCodeBlock = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code Block Start/End
        if (line.trim().startsWith('```')) {
            if (currentCodeBlock) {
                // End code block
                blocks.push({
                    object: 'block',
                    type: 'code',
                    code: {
                        rich_text: [{ type: 'text', text: { content: currentCodeBlock.content } }],
                        language: currentCodeBlock.language || 'plain text'
                    }
                });
                currentCodeBlock = null;
            } else {
                // Start code block
                const lang = line.trim().replace('```', '') || 'plain text';
                currentCodeBlock = { content: '', language: lang };
            }
            continue;
        }

        // Inside Code Block
        if (currentCodeBlock) {
            currentCodeBlock.content += line + '\n';
            continue;
        }

        // Headings
        if (line.startsWith('# ')) {
            blocks.push({
                object: 'block',
                type: 'heading_1',
                heading_1: { rich_text: [{ type: 'text', text: { content: line.replace('# ', '') } }] }
            });
        } else if (line.startsWith('## ')) {
            blocks.push({
                object: 'block',
                type: 'heading_2',
                heading_2: { rich_text: [{ type: 'text', text: { content: line.replace('## ', '') } }] }
            });
        } else if (line.startsWith('### ')) {
            blocks.push({
                object: 'block',
                type: 'heading_3',
                heading_3: { rich_text: [{ type: 'text', text: { content: line.replace('### ', '') } }] }
            });
        }
        // List Items
        else if (line.trim().startsWith('- ')) {
            blocks.push({
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: { rich_text: [{ type: 'text', text: { content: line.trim().replace('- ', '') } }] }
            });
        }
        // Empty lines (ignore)
        else if (line.trim() === '') {
            continue;
        }
        // Paragraphs
        else {
            blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [{ type: 'text', text: { content: line } }] }
            });
        }
    }
    return blocks;
}

// 4. Main Upload Function
async function uploadReport(filename) {
    console.log(`Processing ${filename}...`);
    const filePath = path.join(ARTIFACT_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract Title
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename;

    // Extract Content (remove title line)
    const bodyContent = content.replace(/^# .+$/m, '').trim();
    const children = markdownToBlocks(bodyContent);

    try {
        const response = await notion.pages.create({
            parent: { page_id: PAGE_ID },
            properties: {
                title: [
                    {
                        text: {
                            content: title,
                        },
                    },
                ],
            },
            children: children.slice(0, 100) // Notion has a limit of 100 children per request, handling basic case
        });
        console.log(`[SUCCESS] Uploaded: ${title}`);
    } catch (error) {
        console.error(`[ERROR] Failed to upload ${filename}:`, error.body || error.message);
    }
}

async function main() {
    console.log('Starting Notion Upload for 5 Reports...');
    for (const report of REPORTS) {
        await uploadReport(report);
    }
    console.log('All done!');
}

main();
