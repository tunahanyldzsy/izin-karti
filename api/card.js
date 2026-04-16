const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  const params = new URLSearchParams(req.query).toString();
  const targetUrl = `https://tunahanyldzsy.github.io/izin-karti/?${params}`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 420, height: 900 },
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: 'networkidle0' });

  // Sadece kartı screenshot al
  const element = await page.$('.card-wrap');
  const screenshot = await element.screenshot({ type: 'png' });

  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(screenshot);
};
