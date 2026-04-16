const { createCanvas } = require('@napi-rs/canvas');

module.exports = async (req, res) => {
  const q = req.query;
  const p = {
    id:        q.id        || 'TLP-001',
    ad:        q.ad        || 'Ad Soyad',
    tur:       q.tur       || 'Personel',
    izinTur:   q.izinTur   || 'Yıllık İzin',
    sure:      q.sure      || '3 gün',
    mintika:   q.mintika   || '—',
    kurum:     q.kurum     || '—',
    baslangic: q.baslangic || '—',
    bitis:     q.bitis     || '—',
    onayMes:   q.onayMes   || 'Evet',
    durum:     (q.durum    || 'bekliyor').toLowerCase().trim(),
    mulahaza:  q.mulahaza  || '',
  };

  const durumCfg = {
    bekliyor:    { fill:'#fef9c3', stroke:'#facc15', text:'#b45309', label:'ONAY BEKLİYOR' },
    onaylandi:   { fill:'#dcfce7', stroke:'#22c55e', text:'#15803d', label:'ONAYLANDI'     },
    reddedildi:  { fill:'#fee2e2', stroke:'#ef4444', text:'#b91c1c', label:'ONAYLANMADI'   },
    onaylanmadi: { fill:'#fee2e2', stroke:'#ef4444', text:'#b91c1c', label:'ONAYLANMADI'   },
  };
  const d = durumCfg[p.durum] || durumCfg.bekliyor;

  const W = 720, H = 1280;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const s = 2; // scale

  // Arka plan
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);

  // Kart
  ctx.fillStyle = 'white';
  roundRect(ctx, 40, 40, 640, 1200, 32);
  ctx.fill();

  // Header
  ctx.fillStyle = '#1e293b';
  roundRectTop(ctx, 40, 40, 640, 140, 32);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('İZİN TALEP FORMU', W/2, 110);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px monospace';
  ctx.fillText('REF: ' + p.id, W/2, 145);

  // Avatar
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.arc(W/2, 230, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // İsim
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(p.ad, W/2, 320);
  ctx.fillStyle = '#64748b';
  ctx.font = '24px sans-serif';
  ctx.fillText(p.tur, W/2, 355);

  // Grid alanlar
  ctx.textAlign = 'left';
  drawField(ctx, 80, 385, 270, 84, 'İzin Türü', p.izinTur, '#0369a1');
  drawField(ctx, 370, 385, 310, 84, 'İzin Süresi', p.sure, '#0f172a');
  drawField(ctx, 80, 480, 270, 84, 'Mıntıka', p.mintika, '#0f172a');
  drawField(ctx, 370, 480, 310, 84, 'Kurum', p.kurum, '#0f172a');
  drawField(ctx, 80, 575, 270, 84, 'Başlama', p.baslangic, '#0f172a');
  drawField(ctx, 370, 575, 310, 84, 'Bitiş', p.bitis, '#0f172a');

  // Mesul onayı
  drawField(ctx, 80, 670, 600, 76, 'Mıntıka Mesulü Onayı', p.onayMes, '#16a34a');

  // Durum banner
  ctx.fillStyle = d.fill;
  roundRect(ctx, 80, 758, 600, 76, 16);
  ctx.fill();
  ctx.strokeStyle = d.stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = d.text;
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(d.label, W/2, 804);

  // Mülahaza
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, 80, 848, 600, 340, 12);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Mıntıka Sekretarya Mülahazası', 96, 878);
  ctx.font = '18px monospace';
  ctx.fillStyle = '#475569';
  const words = p.mulahaza || '(Mülahaza girilmemiş)';
  wrapText(ctx, words, 96, 908, 568, 22);

  // Footer
  ctx.fillStyle = '#cbd5e1';
  roundRect(ctx, 280, 1210, 160, 8, 4);
  ctx.fill();

  const png = await canvas.encode('png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.send(png);
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function roundRectTop(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawField(ctx, x, y, w, h, label, value, valueColor) {
  ctx.fillStyle = '#f8fafc';
  roundRect(ctx, x, y, w, h, 12);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#64748b';
  ctx.font = '18px sans-serif';
  ctx.fillText(label, x + 16, y + 28);
  ctx.fillStyle = valueColor;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(value, x + 16, y + 58);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
