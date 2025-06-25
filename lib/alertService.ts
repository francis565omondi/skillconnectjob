// Simple alert service for real-time security notifications
// In production, set SLACK_WEBHOOK_URL in your environment variables

const SERVICE_EMAIL = 'skillconnect2025@gmail.com'

export async function sendSlackAlert(message: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('Slack webhook URL not set. Alert not sent.');
    return;
  }
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });
}

// Usage example:
// await sendSlackAlert('Critical security event detected!'); 

// When sending emails, use process.env.SMTP_USER || SERVICE_EMAIL as the user,
// and process.env.CONTACT_RECEIVER || SERVICE_EMAIL as the receiver. 