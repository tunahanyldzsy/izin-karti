// Vercel için api/screenshot.js örneği
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL parametresi eksik.');
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(), // Vercel ortamında sıkıştırılmış chromium'u açar
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' }); // DOM ve network trafiğinin bitmesini bekler
    
    const screenshot = await page.screenshot({ type: 'png', fullPage: true });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(screenshot);
    
  } catch (error) {
    res.status(500).json({ error: "Render Hatası", details: error.message });
  }
}
