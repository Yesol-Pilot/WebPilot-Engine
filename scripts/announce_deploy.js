const https = require('https');

const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const DEPLOY_URL = 'https://web-pilot-engine.vercel.app/reports';

const payload = {
    blocks: [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "🚀 R&D R&D Archive Deployed!",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*WebPilot Engine*의 R&D 아카이브 사이트가 업데이트되었습니다.\n이제 아래 링크에서 모든 개발 이력을 확인하실 수 있습니다."
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `👉 *<${DEPLOY_URL}|View R&D Archive>*`
            }
        },
        {
            type: "divider"
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: "*Tech Stack:*\nNext.js 16, TailwindCSS v4"
                },
                {
                    type: "mrkdwn",
                    text: "*Features:*\nMermaid Diagrams, Markdown Support"
                }
            ]
        },
        {
            type: "context",
            elements: [
                {
                    type: "mrkdwn",
                    text: "🤖 Deployed by Antigravity Agent"
                }
            ]
        }
    ]
};

const req = https.request(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(JSON.stringify(payload));
req.end();
