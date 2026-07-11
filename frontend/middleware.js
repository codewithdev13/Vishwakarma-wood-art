const CRAWLER_PATTERN = /bot|crawl|spider|facebook|whatsapp|twitter|linkedin|slack|telegram|discord|preview/i;

export const config = {
  matcher: '/product/:path*',
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';

  if (!CRAWLER_PATTERN.test(userAgent)) {
    return;
  }

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/product\/([^/]+)\/?$/);

  if (!match) {
    return;
  }

  const rewriteUrl = new URL(`/api/og/${match[1]}`, request.url);

  return new Response(null, {
    headers: {
      'x-middleware-rewrite': rewriteUrl.toString(),
    },
  });
}
