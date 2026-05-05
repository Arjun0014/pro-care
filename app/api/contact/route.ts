import { NextRequest, NextResponse } from 'next/server';

// Phase 1 stub — proxies to Web3Forms when WEB3FORMS_KEY is set.
// TODO: replace stub with full validation (Zod) in Phase 3 when the contact form is built.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const apiKey = process.env.WEB3FORMS_KEY;
  if (!apiKey) {
    // In development without a key, return a mock success.
    return NextResponse.json({ success: true, mock: true });
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: apiKey, ...body }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
  }
}
