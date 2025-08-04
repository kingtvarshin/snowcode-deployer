import fetch from 'node-fetch';

export async function sendSlackNotification(webhookUrl: string, message: string): Promise<void> {
    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message })
        });
        if (!res.ok) {
            throw new Error(`Slack notification failed: ${res.statusText}`);
        }
    } catch (err) {
        console.error(err);
    }
}