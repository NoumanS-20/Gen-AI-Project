import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'Only http(s) allowed' }, { status: 400 });
    }

    const res = await fetch(parsed.toString(), {
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; SmartReachBot/1.0; +https://smartreach.ai)',
        accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Fetch failed: ${res.status}` }, { status: 502 });
    }

    const html = await res.text();
    const text = extractText(html).slice(0, 6000);
    const title = (html.match(/<title>([^<]+)<\/title>/i)?.[1] || '').trim();

    return NextResponse.json({ title, text });
  } catch (e: any) {
    console.error('scrape error:', e);
    return NextResponse.json({ error: e?.message || 'Scrape failed' }, { status: 500 });
  }
}

function extractText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
