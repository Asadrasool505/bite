import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'BiteAdmin2026!';

    if (password === adminPassword) {
      // Return a simple success flag and a mock session token
      return NextResponse.json({ 
        success: true, 
        token: 'bite_admin_secure_session_2026' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid administrative password' 
    }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Server verification error' 
    }, { status: 500 });
  }
}
