import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_name, company_name, email, phone, courier_account, product_details } = body;

    // Check required fields
    if (!client_name || !company_name || !email) {
      console.warn("⚠️ SAMPLE REQUEST REJECTED: Missing required fields in payload.");
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    console.log(`🚀 STARTING: Processing B2B Sample Request Lead...`);
    console.log(`Buyer: ${client_name} | Company: ${company_name} | Email: ${email} | Phone: ${phone || 'N/A'} | Courier A/C: ${courier_account || 'None'}`);

    // Insert into Supabase table 'sample_requests'
    try {
      const { error: dbError } = await supabase.from('sample_requests').insert([
        {
          client_name: client_name,
          company_name: company_name,
          email: email,
          phone: phone || null,
          courier_account: courier_account || null,
          product_details: product_details || null,
        }
      ]);

      if (dbError) {
        console.error("❌ SUPABASE SAMPLE INSERTION FAILURE:", dbError.message, dbError.details);
      } else {
        console.log(`✅ SUPABASE SAMPLE SUCCESS: Lead successfully saved to sample_requests table!`);
      }
    } catch (innerErr) {
      console.error("❌ SUPABASE SAMPLE SERVICE UNREACHABLE:", innerErr);
    }

    // DUAL EMAIL ROUTING:
    // Email templates formatted in HTML using inline styles for premium cross-client rendering.
    const courierMessage = courier_account 
      ? `<p style="font-size: 15px; color: #334155; line-height: 1.6;">We have successfully logged your provided shipping handler details (<strong>${courier_account}</strong>). This will significantly accelerate transit preparation through our designated global dispatch center.</p>`
      : `<p style="font-size: 15px; color: #334155; line-height: 1.6;">Since no courier/shipping account was specified in your form, our logistics department will contact you to coordinate shipping options and handle freight details.</p>`;

    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bite Instruments - Factory Sample Request</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0A1128; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">BITE INSTRUMENTS</h1>
              <p style="color: #D4AF37; font-size: 12px; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.25em;">Factory Evaluation Program</p>
            </td>
          </tr>
          <!-- Content Block -->
          <tr>
            <td style="padding: 40px; background-color: #ffffff;">
              <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Sample Logistics Registry</p>
              <h2 style="font-size: 20px; color: #0f172a; margin: 0 0 20px 0; font-weight: 700; line-height: 1.3;">Factory Quality Evaluation Request</h2>
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 16px 0;">
                Dear ${client_name}, thank you for choosing to evaluate the professional quality of Bite Instruments. We are committed to supplying tools that meet the highest standards of hand-forged excellence.
              </p>
              
              ${courierMessage}

              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px 0;">
                Our export and sample-processing department in Sialkot, Pakistan, is verifying your commercial address and business credentials. An evaluation agent will reach out directly to <strong>${email}</strong> within 24 business hours to finalize the item selection and shipping tracking code.
              </p>
              
              <!-- Core Standard Warning / Info -->
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 0 0 24px 0;">
                <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #0f172a; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Evaluation Terms</h4>
                <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                  All evaluation samples are handcrafted under high-spec guidelines (Vacuum Heat Treated standard). We provide complimentary samples to qualified professional distributors, surgical representatives, and catalog partners worldwide.
                </p>
              </div>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;">

              <!-- Translations Greetings -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    <span style="font-weight: bold; color: #475569;">ESPAÑOL:</span> Agradecemos su interés en evaluar nuestras herramientas. Un agente de logística le contactará en 24 horas.<br>
                    <span style="font-weight: bold; color: #475569;">DEUTSCH:</span> Vielen Dank für Ihr Interesse an der Bewertung unserer Instrumente. Ein Logistikmitarbeiter wird Sie innerhalb von 24 Stunden kontaktieren.
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
        <title>New Sample Request Alert</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background-color: #8c0c0c; padding: 30px; text-align: center; color: #ffffff;">
              <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.1em; color: #f87171;">Bite Portal Alert</h2>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; color: #ffffff; font-weight: bold;">New Free Sample Request Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 14px; color: #334155; line-height: 1.5; margin-top: 0;">
                Assalamu Alaikum, Asad. A new distributor wants to run factory evaluations on Bite Instruments. Here is the request details summary:
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #f1f5f9; border-radius: 8px; font-size: 13px; color: #334155; margin-bottom: 24px;">
                <tr>
                  <td width="30%" style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Client Name:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${client_name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Company:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${company_name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Phone:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Product Details:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${product_details || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Courier Account:</td>
                  <td><strong>${courier_account || 'Not Provided (Needs Freight Coordination)'}</strong></td>
                </tr>
              </table>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
                <strong>Next Step Required:</strong> Please verify their professional business profile and contact them directly to organize item selections and ship out evaluation samples using their courier details.
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
        console.log("📤 DISPATCHING SAMPLE DUAL EMAILS: Triggering Resend Service calls...");

        // 1. Dispatch Sample Notification to Client
        const clientEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Bite Instruments <onboarding@resend.dev>',
            to: email,
            subject: 'Confirmation: Your Request for Bite Instruments Factory Evaluation Sample',
            html: clientHtml,
          }),
        });

        if (!clientEmailRes.ok) {
          const errorData = await clientEmailRes.json();
          console.error('❌ Resend Client Sample Email Failed:', errorData);
        } else {
          console.log(`✅ Sample acknowledgment dispatched to client at ${email}`);
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
            subject: `Urgently: New Factory Sample Request from ${company_name}`,
            html: adminHtml,
          }),
        });

        if (!adminEmailRes.ok) {
          const errorData = await adminEmailRes.json();
          console.error('❌ Resend Admin Sample Email Failed:', errorData);
        } else {
          console.log('✅ Lead sample notification dispatched to Administrator.');
        }

      } catch (emailError) {
        console.error("❌ RESEND SAMPLE INTEGRATION ERROR: Fail-safe catch triggered. Database transaction preserved.", emailError);
      }
    } else {
      console.log('\n--- [MOCK EMAIL DISPATCH LOG (SAMPLE REQUEST)] ---');
      console.log(`To Client [${email}]:\n`, clientHtml);
      console.log('----------------------------------------------------');
      console.log('To Admin [biteinstruments@gmail.com]:\n', adminHtml);
      console.log('----------------------------------------------------\n');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error inside api/sample Route Handler:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
