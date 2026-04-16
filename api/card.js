module.exports = async (req, res) => {
  const params = new URLSearchParams(req.query).toString();
  const targetUrl = `https://tunahanyldzsy.github.io/izin-karti/?${params}`;
  
  // Ücretsiz screenshot servisi
  const screenshotUrl = `https://api.screenshotone.com/take?url=${encodeURIComponent(targetUrl)}&viewport_width=420&viewport_height=900&selector=.card-wrap&format=png&access_key=free`;
  
  const response = await fetch(screenshotUrl);
  const buffer = await response.arrayBuffer();
  
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(Buffer.from(buffer));
};
