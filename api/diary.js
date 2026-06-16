const GAS_URL = 'https://script.google.com/macros/s/AKfycbywmZoyoeZhplJWQ5l9vWPf2mS1Fu0W2rADpdXAcTxzbRmOI-a7-cgjmBPEeItI9UlE/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { date, county, content } = req.body;
    if (!date || !county) return res.status(400).json({ ok: false, error: '缺少必要欄位' });

    // 用 GET 參數方式呼叫 Apps Script（避免 Apps Script POST 解析問題）
    const params = new URLSearchParams({ action: 'write', date, county, content: content || '' });
    const gasRes = await fetch(`${GAS_URL}?${params.toString()}`, { redirect: 'follow' });
    const text = await gasRes.text();

    let data;
    try { data = JSON.parse(text); } catch { data = { ok: true }; }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
