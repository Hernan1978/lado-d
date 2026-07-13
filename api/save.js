export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const SHEET_API = 'https://script.google.com/macros/s/AKfycbxfEtCvNYk3cWjuhLk2giOX2W1dPFo5I0Z761DK90jRUPGsFK0WsOs5lRvLNo7kxyEt/exec';

  try {
    const data = req.body;
    const params = new URLSearchParams();
    params.append('action', 'save');
    params.append('data', JSON.stringify(data));

    const response = await fetch(`${SHEET_API}?${params.toString()}`);
    const result = await response.json();
    res.status(200).json(result);
  } catch(err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}
