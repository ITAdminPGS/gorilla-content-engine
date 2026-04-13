// Vercel serverless function that mirrors the Vite dev proxy in vite.config.js.
// Forwards /api/anthropic/<sub-path> to https://api.anthropic.com/<sub-path>
// and injects the API key + version header server-side so they never reach
// the browser bundle.

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: { message: "ANTHROPIC_API_KEY not set on the server" } });
    return;
  }

  const segments = req.query.path;
  const subPath = Array.isArray(segments) ? segments.join("/") : (segments || "");
  const url = `https://api.anthropic.com/${subPath}`;

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: req.method === "GET" || req.method === "HEAD" ? undefined : JSON.stringify(req.body ?? {}),
    });

    const body = await upstream.text();
    res.status(upstream.status);
    const contentType = upstream.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    res.send(body);
  } catch (err) {
    res.status(502).json({ error: { message: `Proxy error: ${err.message}` } });
  }
}
