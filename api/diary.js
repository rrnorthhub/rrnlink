const GAS_URL = 'https://script.google.com/macros/s/AKfycbywmZoyoeZhplJWQ5l9vWPf2mS1Fu0W2rADpdXAcTxzbRmOI-a7-cgjmBPEeItI9UlE/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { date, county, content } = req.body;

    if (!date || !county) {
      return res.status(400).json({ ok: false, error: '缺少必要欄位' });
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, county, content }),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { ok: true }; }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
