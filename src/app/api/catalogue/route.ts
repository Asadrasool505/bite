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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error inside api/catalogue Route Handler:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
