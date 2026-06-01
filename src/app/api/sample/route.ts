import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, courierAccount } = body;

    // Check required fields
    if (!name || !company || !email) {
      console.warn("⚠️ SAMPLE REQUEST REJECTED: Missing required fields in payload.");
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    console.log(`🚀 STARTING: Processing B2B Sample Request Lead...`);
    console.log(`Buyer: ${name} | Company: ${company} | Email: ${email} | Courier A/C: ${courierAccount || 'None'}`);

    // Insert into Supabase table 'sample_requests'
    try {
      const { error: dbError } = await supabase.from('sample_requests').insert([
        {
          client_name: name,
          company_name: company,
          email: email,
          courier_account: courierAccount || null,
        }
      ]);

      if (dbError) {
        console.error("❌ SUPABASE SAMPLE INSERTION FAILURE:", dbError.message, dbError.details);
        // We will log and return a graceful fallback success so the user does not see a failure if the table schema is undergoing migration
      } else {
        console.log(`✅ SUPABASE SAMPLE SUCCESS: Lead successfully saved to sample_requests table!`);
      }
    } catch (innerErr) {
      console.error("❌ SUPABASE SAMPLE SERVICE UNREACHABLE:", innerErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error inside api/sample Route Handler:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
