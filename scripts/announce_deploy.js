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
                text: "✅ R&D Archive Restored",
                emoji: true
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "R&D 리포트 페이지가 정상적으로 복구되었습니다."
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "모든 리포트와 다이어그램을 확인하실 수 있습니다."
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `👉 *<${DEPLOY_URL}|View Reports>*`
            }
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
