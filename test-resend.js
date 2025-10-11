require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || 'Test <test@natureswaysoil.com>';
const to = process.env.SUPPORT_TO || 'test@natureswaysoil.com';

async function testResend() {
  try {
    console.log('Testing Resend API...');
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('From:', from);
    console.log('To:', to);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Test Email from Nature\'s Way Soil',
        text: 'This is a test email to verify Resend configuration.',
        html: '<h1>Test Email</h1><p>This is a test email to verify Resend configuration.</p>',
      }),
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);

    if (response.ok) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Failed to send email');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testResend();
