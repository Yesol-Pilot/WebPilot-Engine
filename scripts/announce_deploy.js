const https = require('https');

// SECURE: Use environment variable
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const DEPLOY_URL = 'https://web-pilot-engine.vercel.app/reports';

if (!SLACK_WEBHOOK_URL) {
    console.warn('⚠️  Skipping Slack notification: SLACK_WEBHOOK_URL is not set.');
    process.exit(0);
}

const payload = {
    blocks: [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "🚀 R&D Archive Deployed (Securely)",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "WebPilot Engine의 R&D 아카이브가 업데이트되었습니다."
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
            type: "context",
            elements: [
                {
                    type: "mrkdwn",
                    text: "🔒 Secured by Environment Variables"
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
});

req.on('error', (error) => {
    console.error(error);
});

req.write(JSON.stringify(payload));
req.end();
