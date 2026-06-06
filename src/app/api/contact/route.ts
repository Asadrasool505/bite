import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    // Basic validation
    if (!firstName || !email || !message) {
      console.warn('⚠️ CONTACT FORM REJECTED: Missing required fields.');
      return NextResponse.json(
        { success: false, error: 'Missing required fields: firstName, email, message' },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName || ''}`.trim();
    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Karachi',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    console.log(`📨 CONTACT FORM: New inquiry from ${fullName} <${email}>`);

    // ── 1. Admin notification email HTML ──
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>New B2B Contact Inquiry — Bite Instruments</title></head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
          style="max-width:600px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:#0A1128;padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">
                BITE INSTRUMENTS
              </h1>
              <p style="color:#D4AF37;margin:6px 0 0;text-transform:uppercase;font-size:10px;letter-spacing:3px;font-weight:700;">
                NEW CONTACT FORM INQUIRY
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 6px;">New B2B Inquiry Received</h2>
              <p style="color:#64748b;font-size:13px;margin:0 0 24px;font-weight:300;">
                Assalamu Alaikum Asad. A new inquiry was submitted via the Bite Instruments Contact Us form.
              </p>

              <!-- Sender Details -->
              <table width="100%" border="0" cellspacing="0" cellpadding="10"
                style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;color:#334155;margin-bottom:24px;">
                <tr>
                  <td width="35%" style="font-weight:bold;border-bottom:1px solid #e2e8f0;">Full Name:</td>
                  <td style="border-bottom:1px solid #e2e8f0;font-weight:600;">${fullName}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;border-bottom:1px solid #e2e8f0;">Email:</td>
                  <td style="border-bottom:1px solid #e2e8f0;">
                    <a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:bold;border-bottom:1px solid #e2e8f0;">Phone / WhatsApp:</td>
                  <td style="border-bottom:1px solid #e2e8f0;">
                    ${phone
                      ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color:#22c55e;font-weight:bold;text-decoration:none;">${phone} (Open WhatsApp)</a>`
                      : '<span style="color:#94a3b8;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:bold;">Submitted At:</td>
                  <td>${submittedAt} PKT</td>
                </tr>
              </table>

              <!-- Message Block -->
              <h3 style="color:#0f172a;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">
                Client Message
              </h3>
              <div style="background:#fffbeb;border-left:4px solid #D4AF37;border-radius:0 8px 8px 0;padding:18px 20px;margin-bottom:24px;font-size:14px;color:#334155;line-height:1.7;font-style:italic;">
                "${message}"
              </div>

              <p style="font-size:13px;color:#64748b;line-height:1.5;margin:0;">
                <strong>Action Required:</strong> Reply to <a href="mailto:${email}" style="color:#3b82f6;">${email}</a>
                ${phone ? `or WhatsApp <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color:#22c55e;">${phone}</a>` : ''} within 24 hours.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0A1128;padding:20px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">
                BITE INSTRUMENTS CONTACT SYSTEM
              </p>
              <p style="margin:4px 0 0;color:#64748b;font-size:10px;">Sialkot, Pakistan · biteinstruments@gmail.com</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // ── 2. Client confirmation email HTML ──
    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Thank You for Contacting Bite Instruments</title></head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
          style="max-width:600px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0A1128 0%,#101F42 100%);padding:40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:0.1em;">
                BITE INSTRUMENTS
              </h1>
              <p style="color:#D4AF37;font-size:12px;font-weight:600;margin:8px 0 0;text-transform:uppercase;letter-spacing:0.25em;">
                Inquiry Received · Sialkot Factory Exports
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="font-size:20px;color:#0f172a;margin:0 0 16px;font-weight:700;">
                Thank You, ${firstName}!
              </h2>
              <p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 16px;">
                We have successfully received your inquiry and our B2B export team will review it promptly.
                You can expect a response within <strong>2–4 Business Days</strong>.
              </p>
              <p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 28px;">
                In the meantime, feel free to browse our latest wholesale catalog or reach out directly via WhatsApp for faster assistance.
              </p>

              <!-- Processing Timeline -->
              <div style="background:#f8fafc;border-left:4px solid #D4AF37;padding:20px;border-radius:0 8px 8px 0;margin-bottom:28px;font-size:13px;color:#334155;line-height:1.7;">
                <h4 style="margin:0 0 10px;font-size:13px;color:#0f172a;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;">
                  What Happens Next
                </h4>
                <strong>Day 1–2:</strong> Your inquiry is reviewed by our export team and matched to the right catalog specialist.<br>
                <strong>Day 2–4:</strong> You will receive a personalised reply with pricing, MOQ details, and OEM options tailored to your business.<br>
                <strong>Day 4+:</strong> Upon mutual agreement, your sample or container order is initiated at our Sialkot facility.
              </div>

              <!-- Copy of submitted message -->
              <h3 style="color:#0f172a;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">
                Your Submitted Message (for your records)
              </h3>
              <div style="background:#f1f5f9;border-radius:8px;padding:16px 20px;margin-bottom:28px;font-size:13px;color:#475569;line-height:1.7;font-style:italic;">
                "${message}"
              </div>

              <!-- Direct contact row -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
                <tr>
                  <td>
                    <a href="https://wa.me/923196085514"
                      style="display:inline-block;background:#25D366;color:#ffffff;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;padding:12px 24px;border-radius:8px;text-decoration:none;margin-right:10px;">
                      💬 WhatsApp Us
                    </a>
                    <a href="mailto:biteinstruments@gmail.com"
                      style="display:inline-block;background:#0A1128;color:#D4AF37;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;padding:12px 24px;border-radius:8px;text-decoration:none;">
                      ✉️ Email Us
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:0;border-top:1px solid #e2e8f0;margin-bottom:20px;">

              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size:11px;color:#94a3b8;line-height:1.5;">
                    <span style="font-weight:bold;color:#475569;">ESPAÑOL:</span> Hemos recibido su consulta. Nuestro equipo le responderá en un plazo de 2 a 4 días hábiles.<br>
                    <span style="font-weight:bold;color:#475569;">DEUTSCH:</span> Wir haben Ihre Anfrage erhalten. Unser Team wird sich innerhalb von 2–4 Werktagen bei Ihnen melden.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="font-size:12px;color:#64748b;margin:0 0 4px;">
                Bite Instruments Ltd. · Small Industrial Estate, Sialkot, Pakistan
              </p>
              <p style="font-size:11px;color:#94a3b8;margin:0;">
                This is an automated confirmation. For urgent matters contact export@biteinstruments.com
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // ── Dispatch via Resend (same transport as /api/quote) ──
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      try {
        // Trigger A — Admin notification
        const adminRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Bite Instruments Contact <onboarding@resend.dev>',
            to: 'biteinstruments@gmail.com',
            subject: `New B2B Inquiry from Contact Form — ${fullName}`,
            html: adminHtml,
          }),
        });

        if (!adminRes.ok) {
          const err = await adminRes.json();
          console.error('❌ Resend admin email failed (contact form):', err);
        } else {
          console.log(`✅ Admin contact notification sent for ${fullName}`);
        }

        // Trigger B — Client confirmation
        const clientRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Bite Instruments <onboarding@resend.dev>',
            to: email,
            subject: 'Thank You for Contacting Bite Instruments — Inquiry Received',
            html: clientHtml,
          }),
        });

        if (!clientRes.ok) {
          const err = await clientRes.json();
          console.error('❌ Resend client confirmation failed (contact form):', err);
        } else {
          console.log(`✅ Client confirmation sent to ${email}`);
        }
      } catch (emailErr) {
        console.error('❌ RESEND CONTACT ERROR (fail-safe):', emailErr);
      }
    } else {
      // Dev mode — log to console
      console.log('\n--- [MOCK CONTACT EMAIL LOG] ---');
      console.log(`Admin notification → biteinstruments@gmail.com`);
      console.log(`Client confirmation → ${email}`);
      console.log('Name:', fullName, '| Phone:', phone || 'N/A');
      console.log('Message:', message);
      console.log('-----------------------------------\n');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in /api/contact route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
