import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set(['source.unsplash.com', 'images.unsplash.com']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(targetUrl.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
  }

  const upstream = await fetch(targetUrl.toString(), {
    headers: {
      Accept: 'image/*',
      'User-Agent': 'Mozilla/5.0',
    },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: 'Upstream failed' }, { status: upstream.status });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  headers.set('cache-control', 'public, max-age=86400, s-maxage=86400');

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
