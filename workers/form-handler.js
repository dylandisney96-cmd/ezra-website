// Ezra Mobility Group — Form Handler Cloudflare Worker
// Deploy with: npx wrangler deploy form-handler.js
// Set up email forwarding: https://developers.cloudflare.com/email-routing/

export default {
  async fetch(request) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://www.ezramobilitygroup.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      // Determine form type
      const formType = data._formType || 'inquiry';

      // Send email via Cloudflare Email Routing
      await sendEmail(formType, data);

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};

async function sendEmail(formType, data) {
  // Uses Cloudflare Email Routing — set up at dash.cloudflare.com/email/routing
  // Requires: Email Routing enabled, catch-all or custom address configured

  const emailContent = formatEmail(formType, data);

  // Send via Cloudflare's email API or forward to your preferred service
  // For now, log to console — replace with actual email API call
  console.log(`[${formType.toUpperCase()}]`, JSON.stringify(data, null, 2));

  // When Email Routing is configured, use:
  // await fetch('https://api.mailchannels.net/tx/v1/send', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email: 'info@ezramobilitygroup.com' }] }],
  //     from: { email: 'noreply@ezramobilitygroup.com', name: 'Ezra Website' },
  //     subject: `New ${formType} — ezramobilitygroup.com`,
  //     content: [{ type: 'text/plain', value: emailContent }],
  //   }),
  // });

  return emailContent;
}

function formatEmail(formType, data) {
  const lines = ['=== NEW SUBMISSION ===', `Form: ${formType}`, `Date: ${new Date().toISOString()}`, ''];
  for (const [key, val] of Object.entries(data)) {
    if (key !== '_formType') {
      lines.push(`${key}: ${val}`);
    }
  }
  return lines.join('\n');
}
