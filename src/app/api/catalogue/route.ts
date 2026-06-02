import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone } = body;

    // Check required fields
    if (!name || !company || !email || !phone) {
      console.warn("⚠️ CATALOG REQUEST REJECTED: Missing required fields in payload.");
      return NextResponse.json({ success: false, error: "Missing required catalog fields" }, { status: 400 });
    }

    console.log(`🚀 STARTING: Processing B2B Catalog Request Lead...`);
    console.log(`Buyer: ${name} | Company: ${company} | Contact: ${email} / ${phone}`);

    // Insert into Supabase table 'catalogue_requests'
    const { error: dbError } = await supabase.from('catalogue_requests').insert([
      {
        client_name: name,
        company_name: company,
        email: email,
        phone: phone,
      }
    ]);

    if (dbError) {
      console.error("❌ SUPABASE CATALOG INSERTION FAILURE:", dbError.message, dbError.details);
      return NextResponse.json({ success: false, error: `Database insertion failed: ${dbError.message}` }, { status: 500 });
    }

    console.log(`✅ SUPABASE CATALOG SUCCESS: Lead successfully saved to catalogue_requests table!`);

    // DUAL EMAIL ROUTING:
    // Email templates formatted in HTML using inline styles for premium cross-client rendering.
    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Bite Instruments</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0A1128; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">BITE INSTRUMENTS</h1>
              <p style="color: #D4AF37; font-size: 12px; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.25em;">Premium Surgical & Grooming Shears</p>
            </td>
          </tr>
          <!-- Content Block -->
          <tr>
            <td style="padding: 40px; background-color: #ffffff;">
              <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Global Export Division</p>
              <h2 style="font-size: 20px; color: #0f172a; margin: 0 0 20px 0; font-weight: 700; line-height: 1.3;">Welcome to Bite Instruments, ${name}</h2>
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 16px 0;">
                Thank you for requesting our professional manufacturing catalogue and bulk OEM price index. We are thrilled to welcome <strong>${company}</strong> to our network of premium international distributors.
              </p>
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px 0;">
                Our export department in Sialkot, Pakistan, is currently preparing your digital catalog package and a custom wholesale price structure tailored to your profile. A dedicated sales manager will email the full dossier directly to <strong>${email}</strong> within 24 business hours.
              </p>
              
              <!-- Quick Accents / Corporate Greetings -->
              <div style="border-left: 3px solid #D4AF37; padding-left: 16px; margin: 0 0 24px 0;">
                <p style="font-size: 13px; font-style: italic; color: #475569; margin: 0; line-height: 1.5;">
                  "We fuse centuries of Sialkot blade-crafting heritage with vacuum heat treatment technologies to create products that redefine professional ergonomics."
                </p>
              </div>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
                <tr>
                  <td align="center" style="background-color: #D4AF37; border-radius: 6px;">
                    <a href="https://biteinstruments.com" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 13px; font-weight: 700; color: #0A1128; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 6px;">
                      Explore Our Products
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;">

              <!-- Translations Greetings -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    <span style="font-weight: bold; color: #475569;">ESPAÑOL:</span> Nuestro departamento de exportación le enviará nuestro catálogo digital completo en 24 horas. ¡Bienvenidos!<br>
                    <span style="font-weight: bold; color: #475569;">DEUTSCH:</span> Unsere Exportabteilung wird Ihnen unseren vollständigen digitalen Katalog innerhalb von 24 Stunden zusenden. Willkommen!
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer Banner -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 6px 0;">Bite Instruments Ltd. · Small Industrial Estate, Sialkot, Pakistan</p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">This is an automated notification. For support, please contact export@biteinstruments.com</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Catalog Lead Alert</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background-color: #0c1a30; padding: 30px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.1em; color: #e2e8f0;">Bite Portal Alert</h2>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; color: #facc15; font-weight: bold;">New Catalogue Request Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 14px; color: #334155; line-height: 1.5; margin-top: 0;">
                Assalamu Alaikum, Asad. A new buyer has submitted a request for the Bite Instruments corporate catalogue. Detailed lead credentials are listed below:
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #f1f5f9; border-radius: 8px; font-size: 13px; color: #334155; margin-bottom: 24px;">
                <tr>
                  <td width="30%" style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Buyer Name:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Company:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${company}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Phone:</td>
                  <td><a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a></td>
                </tr>
              </table>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
                <strong>Next Step Required:</strong> Please email our export catalog (.pdf format) and B2B pricing sheets to the buyer's email above, or contact them directly via WhatsApp/Phone at your earliest convenience to close the lead.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
              Bite Instruments Web Portal Engine · Small Industrial Estate, Sialkot
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Resend direct HTTP trigger logic wrapped in strict try/catch block (fail-safe)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        console.log("📤 DISPATCHING DUAL EMAILS: Triggering Resend Service calls...");

        // 1. Dispatch Welcome Email to Client
        const clientEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Bite Instruments <onboarding@resend.dev>',
            to: email,
            subject: 'Your Request for Bite Instruments Manufacturing Catalogue',
            html: clientHtml,
          }),
        });

        if (!clientEmailRes.ok) {
          const errorData = await clientEmailRes.json();
          console.error('❌ Resend Client Email Failed:', errorData);
        } else {
          console.log(`✅ Welcome email dispatched to client at ${email}`);
        }

        // 2. Dispatch Alert Email to Admin
        const adminEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Bite Portal Alerts <onboarding@resend.dev>',
            to: 'biteinstruments@gmail.com',
            subject: `New B2B Lead Alert - Catalogue Request from ${company}`,
            html: adminHtml,
          }),
        });

        if (!adminEmailRes.ok) {
          const errorData = await adminEmailRes.json();
          console.error('❌ Resend Admin Email Failed:', errorData);
        } else {
          console.log('✅ Lead notification dispatched to Administrator (Asad Rasool).');
        }

      } catch (emailError) {
        console.error("❌ RESEND INTEGRATION ERROR: Fail-safe catch triggered. Database transaction preserved.", emailError);
      }
    } else {
      console.log('\n--- [MOCK EMAIL DISPATCH LOG (CATALOGUE REQUEST)] ---');
      console.log(`To Client [${email}]:\n`, clientHtml);
      console.log('----------------------------------------------------');
      console.log('To Admin [biteinstruments@gmail.com]:\n', adminHtml);
      console.log('----------------------------------------------------\n');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error inside api/catalogue Route Handler:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
