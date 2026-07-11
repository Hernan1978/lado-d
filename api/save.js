export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SHEET_API = 'https://script.google.com/macros/s/AKfycbwO7TVauAJNFXsK8mAQrePvbGEeZIMjvOX81HP2LGMmO9i1TzKmyswVdhpzK3USDwk/exec';

  try {
    const body = req.body;
    const params = new URLSearchParams();
    params.append('action', 'save');
    params.append('data', JSON.stringify(body));

    const response = await fetch(`${SHEET_API}?${params.toString()}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}
