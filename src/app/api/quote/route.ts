import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, name, company, email, country, whatsapp, notes, items, totalAmount } = body;

    if (!quoteId || !name || !email || !items) {
      console.warn("⚠️ SUBMISSION REJECTED: Missing required fields in POST /api/quote payload.");
      return NextResponse.json({ success: false, error: "Missing required submission fields" }, { status: 400 });
    }

    console.log(`🚀 STARTING: Processing Checkout Submission for Quote #${quoteId}...`);
    console.log(`Buyer: ${name} (${company || "Individual"}) | Contact: ${email} / ${whatsapp}`);

    // Insert into Supabase 'quotes' table server-side with precise column mapping
    try {
      console.log(`ℹ️ Supabase: Attempting server-side database insertion for Quote #${quoteId}...`);
      const { error: dbError } = await supabase.from("quotes").insert([
        {
          id: quoteId,
          client_name: name,
          company_name: company || null,
          email: email,
          phone: whatsapp || null,
          shipping_address: country || "Unknown",
          items: items,
        },
      ]);

      if (dbError) {
        console.error(`❌ SUPABASE INSERTION FAILURE for Quote #${quoteId}:`, dbError.message, dbError.details);
        throw new Error(`Database insertion failed: ${dbError.message}`);
      } else {
        console.log(`✅ SUPABASE SUCCESS: Quote #${quoteId} saved into quotes table.`);
      }
    } catch (dbErr) {
      console.error(`❌ SUPABASE NETWORK ERROR for Quote #${quoteId}:`, dbErr);
    }

    // Build structured HTML table rows for requested items
    let itemsTableRows = '';
    for (const item of items) {
      itemsTableRows += `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; text-align: left; font-size: 13px; color: #1e293b; font-weight: 500;">${item.name}</td>
          <td style="padding: 12px; text-align: left; font-family: monospace; font-size: 12px; color: #64748b;">${item.sku || 'N/A'}</td>
          <td style="padding: 12px; text-align: center; font-size: 13px; color: #1e293b; font-weight: 600;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right; font-size: 13px; color: #0f172a; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }

    // Beautiful Premium HTML Email Body
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        
        <!-- Header banner -->
        <div style="background: linear-gradient(135deg, #0A1128 0%, #101F42 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 400; letter-spacing: 3px; text-transform: uppercase;">BITE INSTRUMENTS</h1>
          <div style="display: inline-block; background-color: #D4AF37; height: 2px; width: 40px; margin: 12px auto;"></div>
          <p style="color: #D4AF37; margin: 0; text-transform: uppercase; font-size: 10px; letter-spacing: 3px; font-weight: 700;">B2B Wholesale & Exports</p>
        </div>

        <!-- Notification Header -->
        <div style="padding: 32px 32px 16px 32px;">
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 10px 0; font-family: Georgia, serif;">New Wholesale Quote Requested</h2>
          <p style="color: #64748b; font-size: 14px; margin: 0; font-weight: 300; line-height: 1.5;">A new bulk quote inquiry was received from the online client checkout portal. Details are listed below:</p>
        </div>

        <!-- Section: Meta Details -->
        <div style="padding: 0 32px 24px 32px;">
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 35%;">Quote Reference:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: bold; font-family: monospace; font-size: 15px;">#${quoteId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Buyer Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Company Name:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${company || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Email Address:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #c5a85c; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">WhatsApp/Phone:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${whatsapp}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Destination Country:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${country}</td>
              </tr>
            </table>
          </div>

          <!-- Notes -->
          ${notes ? `
            <div style="background-color: #fffbeb; border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 28px; font-size: 14px; color: #78350f; font-style: italic; line-height: 1.5;">
              <strong>Client Instructions:</strong> "${notes}"
            </div>
          ` : ''}

          <!-- Items Table -->
          <h3 style="color: #0f172a; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">Inquired Instruments</h3>
          <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin: 0;">
              <thead>
                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <th style="padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Product</th>
                  <th style="padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">SKU</th>
                  <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
                <tr style="background-color: #f8fafc; font-weight: bold; border-top: 2px solid #e2e8f0;">
                  <td colspan="3" style="padding: 16px 12px; text-align: right; font-size: 14px; color: #475569;">Estimated Total Value:</td>
                  <td style="padding: 16px 12px; text-align: right; font-size: 16px; color: #0A1128; font-weight: 800;">$${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0A1128; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
          <p style="margin: 0; color: #ffffff; font-weight: bold; font-size: 13px;">BITE INSTRUMENTS LTD.</p>
          <p style="margin: 4px 0 0 0;">Wholesale Manufacturing Exports Department • Sialkot</p>
          <p style="margin: 12px 0 0 0; font-size: 10px; color: #64748b; border-t: 1px solid #1e293b; padding-top: 12px;">This is an automated system notification dispatched directly from the client B2B checkout portal.</p>
        </div>
      </div>
    `;

    // Process using Resend Email Service via direct HTTP call (Zero extra NPM dependencies)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'Bite Instruments Portal <onboarding@resend.dev>',
          to: 'biteinstruments@gmail.com',
          subject: `New B2B Bulk Quote Request - #${quoteId}`,
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Resend API Call Failed:', errorData);
      } else {
        console.log(`SUCCESS: Resend Email Notification sent successfully for Quote #${quoteId}`);
      }
    } else {
      console.log('\n--- [MOCK EMAIL DISPATCH LOG] ---');
      console.log('To: biteinstruments@gmail.com');
      console.log(`Subject: New B2B Bulk Quote Request - #${quoteId}`);
      console.log('Body (HTML Rendered):\n', htmlContent);
      console.log('-----------------------------------\n');
    }

    return NextResponse.json({ success: true, quoteId });
  } catch (error: any) {
    console.error('Error inside api/quote Route Handler:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
