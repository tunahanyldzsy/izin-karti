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

  function enc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  const mul = p.mulahaza || '(Mülahaza girilmemiş)';
  let tspans = '';
  for (let i = 0; i < 12; i++) {
    const chunk = mul.substr(i * 45, 45);
    if (!chunk) break;
    tspans += `<tspan x='60' dy='${i === 0 ? '0' : '22'}'>${enc(chunk)}</tspan>`;
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 700' width='400' height='700'>
  <rect width='400' height='700' fill='#f8fafc'/>
  <rect x='20' y='20' width='360' height='660' rx='20' fill='white' stroke='#e2e8f0' stroke-width='1.5'/>
  <rect x='20' y='20' width='360' height='80' rx='20' fill='#1e293b'/>
  <rect x='20' y='60' width='360' height='40' fill='#1e293b'/>
  <text x='200' y='58' fill='white' font-family='Arial,sans-serif' font-weight='bold' font-size='18' text-anchor='middle'>İZİN TALEP FORMU</text>
  <text x='200' y='82' fill='#94a3b8' font-size='11' text-anchor='middle' font-family='monospace'>REF: ${enc(p.id)}</text>
  <circle cx='200' cy='128' r='28' fill='#f1f5f9' stroke='#e2e8f0' stroke-width='1.5'/>
  <circle cx='200' cy='122' r='8' fill='#64748b'/>
  <path d='M 188 134 A 14 14 0 0 1 212 134' fill='none' stroke='#64748b' stroke-width='2.5' stroke-linecap='round'/>
  <text x='200' y='178' fill='#0f172a' font-family='Arial,sans-serif' font-weight='bold' font-size='16' text-anchor='middle'>${enc(p.ad)}</text>
  <text x='200' y='198' fill='#64748b' font-family='Arial,sans-serif' font-size='13' text-anchor='middle'>${enc(p.tur)}</text>
  <rect x='40' y='212' width='148' height='50' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='52' y='230' fill='#64748b' font-family='Arial,sans-serif' font-size='10'>İzin Türü</text>
  <text x='52' y='250' fill='#0369a1' font-family='Arial,sans-serif' font-weight='bold' font-size='13'>${enc(p.izinTur)}</text>
  <rect x='200' y='212' width='160' height='50' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='212' y='230' fill='#64748b' font-family='Arial,sans-serif' font-size='10'>İzin Süresi</text>
  <text x='212' y='250' fill='#0f172a' font-family='Arial,sans-serif' font-weight='bold' font-size='13'>${enc(p.sure)}</text>
  <rect x='40' y='270' width='148' height='50' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='52' y='288' fill='#64748b' font-family='Arial,sans-serif' font-size='10'>Mıntıka</text>
  <text x='52' y='308' fill='#0f172a' font-family='Arial,sans-serif' font-weight='bold' font-size='13'>${enc(p.mintika)}</text>
  <rect x='200' y='270' width='160' height='50' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='212' y='288' fill='#64748b' font-family='Arial,sans-serif' font-size='10'>Kurum</text>
  <text x='212' y='308' fill='#0f172a' font-family='Arial,sans-serif' font-weight='bold' font-size='13'>${enc(p.kurum)}</text>
  <rect x='40' y='328' width='148' height='50' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='52' y='346' fill='#64748b' font-family='Arial,sans-serif' font-size='10'>Başlama Tarihi</text>
  <text x='52' y='366' fill='#0f172a' font-family='Arial,sans-serif' font-weight='bold' font-size='12'>${enc(p.baslangic)}</text>
  <rect x='200' y='328' width='160' height='50' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='212' y='346' fill='#64748b' font-family='Arial,sans-serif' font-size='10'>Bitiş Tarihi</text>
  <text x='212' y='366' fill='#0f172a' font-family='Arial,sans-serif' font-weight='bold' font-size='12'>${enc(p.bitis)}</text>
  <rect x='40' y='386' width='320' height='46' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='52' y='404' fill='#64748b' font-family='Arial,sans-serif' font-size='10'>Mıntıka Mesulü Onayı</text>
  <text x='52' y='422' fill='#16a34a' font-family='Arial,sans-serif' font-weight='bold' font-size='13'>${enc(p.onayMes)}</text>
  <rect x='40' y='440' width='320' height='44' rx='10' fill='${d.fill}' stroke='${d.stroke}' stroke-width='1.5'/>
  <text x='200' y='467' fill='${d.text}' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle'>${enc(d.label)}</text>
  <rect x='40' y='492' width='320' height='168' rx='8' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
  <text x='52' y='514' fill='#475569' font-family='Arial,sans-serif' font-size='11' font-weight='bold'>Mıntıka Sekretarya Mülahazası</text>
  <text x='52' y='534' font-family='Arial,sans-serif' font-size='10' fill='#475569'>${tspans}</text>
  <rect x='160' y='672' width='80' height='4' rx='2' fill='#cbd5e1'/>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(svg);
};
