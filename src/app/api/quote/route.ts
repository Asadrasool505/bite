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

    // Insert into Supabase 'quote_requests' table server-side with precise column mapping
    try {
      console.log(`ℹ️ Supabase: Attempting server-side database insertion for Quote #${quoteId}...`);
      const { error: dbError } = await supabase.from("quote_requests").insert([
        {
          quote_reference: quoteId,
          client_name: name,
          company_name: company || null,
          email: email,
          phone: whatsapp || null,
          cart_items: items,
          custom_branding_text: notes || null,
        },
      ]);

      if (dbError) {
        console.error(`❌ SUPABASE INSERTION FAILURE for Quote #${quoteId}:`, dbError.message, dbError.details);
      } else {
        console.log(`✅ SUPABASE SUCCESS: Quote #${quoteId} saved into quote_requests table.`);
      }
    } catch (dbErr) {
      console.error(`❌ SUPABASE NETWORK ERROR for Quote #${quoteId}:`, dbErr);
    }

    // Build structured HTML table rows for requested items (used in both emails)
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

    // Dynamic production lead time (B2B forged manufacturing average is 12-15 business days)
    const productionLeadTime = "12-15 business days";

    // 1. Premium Client HTML Email Body
    const clientHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote Request Acknowledgment #${quoteId}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A1128 0%, #101F42 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">BITE INSTRUMENTS</h1>
              <p style="color: #D4AF37; font-size: 12px; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.25em;">B2B Bulk Export Acknowledgment</p>
            </td>
          </tr>
          <!-- Content Block -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 14px; color: #64748b; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Inquiry Reference #${quoteId}</p>
              <h2 style="font-size: 20px; color: #0f172a; margin: 0 0 20px 0; font-weight: 700;">Bulk Quotation Acknowledged</h2>
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 16px 0;">
                Dear ${name}, thank you for submitting your bulk order quotation request. Our production and export managers are reviewing your selected instruments list to apply the best wholesale rates.
              </p>
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px 0;">
                Below is a summary of the requested items currently logged under your session:
              </p>

              <!-- Inquired Items Table -->
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; margin: 0; font-size: 13px;">
                  <thead>
                    <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b;">
                      <th style="padding: 12px; text-align: left;">Product</th>
                      <th style="padding: 12px; text-align: left;">SKU</th>
                      <th style="padding: 12px; text-align: center;">Qty</th>
                      <th style="padding: 12px; text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsTableRows}
                    <tr style="background-color: #f8fafc; font-weight: bold; border-top: 2px solid #e2e8f0;">
                      <td colspan="3" style="padding: 16px 12px; text-align: right; color: #475569;">Estimated Bulk Value:</td>
                      <td style="padding: 16px 12px; text-align: right; color: #0A1128; font-size: 15px;">$${totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Production & Branding Terms -->
              <div style="background-color: #f8fafc; border-left: 4px solid #D4AF37; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px; font-size: 13px; color: #334155; line-height: 1.6;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #0f172a; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">B2B Production Timelines</h4>
                <strong>Estimated Forge Lead Time:</strong> ${productionLeadTime}<br>
                <strong>Destination:</strong> ${country}<br>
                <strong>Custom Branding:</strong> Supported (Laser Engraving / Brand Logo applied at Sialkot manufacturing site upon request verification).
              </div>

              <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
                Our export director will contact you via email (<strong>${email}</strong>) or WhatsApp (<strong>${whatsapp}</strong>) within 24 hours to supply the formal, finalized export invoice containing global logistics options.
              </p>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;">

              <!-- Translations Greetings -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    <span style="font-weight: bold; color: #475569;">ESPAÑOL:</span> Hemos recibido su solicitud de cotización para compras al por mayor. Un gerente se comunicará con usted en un plazo de 24 horas.<br>
                    <span style="font-weight: bold; color: #475569;">DEUTSCH:</span> Wir haben Ihre Angebotsanfrage für Großhandelsbestellungen erhalten. Ein Exportleiter wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.
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

    // 2. Premium Admin HTML Email Body
    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Urgent: New B2B Bulk Quote Requested #${quoteId}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0A1128; padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">BITE INSTRUMENTS</h1>
              <p style="color: #D4AF37; margin: 8px 0 0 0; text-transform: uppercase; font-size: 10px; letter-spacing: 3px; font-weight: 700;">URGENT PURCHASE LEAD ALERT</p>
            </td>
          </tr>
          <!-- Content Block -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 10px 0; font-family: Georgia, serif;">New Wholesale Quote Requested</h2>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 24px 0; font-weight: 300; line-height: 1.5;">Assalamu Alaikum Asad. A new bulk quote request has been generated via checkout. Lead parameters:</p>

              <!-- Meta Data Grid -->
              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #334155; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Quote ID:</td>
                  <td style="border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 14px; font-weight: bold;">#${quoteId}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Buyer Name:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Company:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${company || 'Individual / Retailer'}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="font-weight: bold; border-bottom: 1px solid #e2e8f0;">WhatsApp/Phone:</td>
                  <td style="border-bottom: 1px solid #e2e8f0;"><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" target="_blank" style="color: #22c55e; text-decoration: none; font-weight: bold;">${whatsapp} (Chat WhatsApp)</a></td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Country:</td>
                  <td>${country}</td>
                </tr>
              </table>

              <!-- Client Notes / Branding Details -->
              ${notes ? `
                <div style="background-color: #fffbeb; border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 28px; font-size: 13px; color: #78350f; font-style: italic; line-height: 1.5;">
                  <strong>Client Message:</strong> "${notes}"
                </div>
              ` : ''}

              <!-- Requested Items -->
              <h3 style="color: #0f172a; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">Product Cart Breakdown</h3>
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; margin: 0; font-size: 12px;">
                  <thead>
                    <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #64748b;">
                      <th style="padding: 10px 12px; text-align: left;">Product</th>
                      <th style="padding: 10px 12px; text-align: left;">SKU</th>
                      <th style="padding: 10px 12px; text-align: center;">Qty</th>
                      <th style="padding: 10px 12px; text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsTableRows}
                    <tr style="background-color: #f8fafc; font-weight: bold; border-top: 2px solid #e2e8f0;">
                      <td colspan="3" style="padding: 14px 12px; text-align: right; color: #475569;">Cart Value Estimate:</td>
                      <td style="padding: 14px 12px; text-align: right; color: #0A1128; font-size: 14px;">$${totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
                <strong>Next Step:</strong> Review this order breakdown. Finalize shipping freight, custom logo details (if requested), and reply to the buyer immediately via email or WhatsApp to seal the transaction!
              </p>
            </td>
          </tr>
          <!-- Footer Banner -->
          <tr>
            <td style="background-color: #0A1128; padding: 24px; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0; color: #ffffff; font-weight: bold;">BITE INSTRUMENTS EXPORT SYSTEM</p>
              <p style="margin: 4px 0 0 0; color: #64748b;">Sialkot Wholesale Exports Management • Pakistan</p>
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
        console.log(`📤 DISPATCHING DUAL QUOTE EMAILS: Triggering Resend Service for Quote #${quoteId}...`);

        // 1. Dispatch Acknowledgment to Client
        const clientEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Bite Instruments <onboarding@resend.dev>',
            to: email,
            subject: `Receipt Confirmation: Bite Instruments Quote Request #${quoteId}`,
            html: clientHtmlContent,
          }),
        });

        if (!clientEmailRes.ok) {
          const errorData = await clientEmailRes.json();
          console.error(`❌ Resend Client Quote Email Failed for #${quoteId}:`, errorData);
        } else {
          console.log(`✅ Quote acknowledgment dispatched to client at ${email}`);
        }

        // 2. Dispatch Purchase Lead Alert to Admin
        const adminEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Bite Checkout Alert <onboarding@resend.dev>',
            to: 'biteinstruments@gmail.com',
            subject: `🚨 Urgent: New B2B Purchase Lead Quote #${quoteId} from ${company || name}`,
            html: adminHtmlContent,
          }),
        });

        if (!adminEmailRes.ok) {
          const errorData = await adminEmailRes.json();
          console.error(`❌ Resend Admin Quote Email Failed for #${quoteId}:`, errorData);
        } else {
          console.log(`✅ Purchase lead alert successfully sent to Administrator for Quote #${quoteId}`);
        }

      } catch (emailError) {
        console.error("❌ RESEND QUOTE INTEGRATION ERROR: Fail-safe catch triggered. Database transaction preserved.", emailError);
      }
    } else {
      console.log(`\n--- [MOCK EMAIL DISPATCH LOG (BULK ORDER QUOTE #${quoteId})] ---`);
      console.log(`To Client [${email}]:\n`, clientHtmlContent);
      console.log('----------------------------------------------------');
      console.log('To Admin [biteinstruments@gmail.com]:\n', adminHtmlContent);
      console.log('----------------------------------------------------\n');
    }

    return NextResponse.json({ success: true, quoteId });
  } catch (error: any) {
    console.error('Error inside api/quote Route Handler:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
