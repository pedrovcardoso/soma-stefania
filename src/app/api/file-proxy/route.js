import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ message: 'URL is required' }, { status: 400 });
  }

  try {
    // Only allow specific domains if security is a concern, 
    // but for now, we'll allow SEI as requested.
    const response = await fetch(targetUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    if (!response.ok) {
      return NextResponse.json({ message: `Failed to fetch: ${response.statusText}` }, { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('File Proxy Error:', error);
    return NextResponse.json({ message: 'Network error in proxy' }, { status: 500 });
  }
}
