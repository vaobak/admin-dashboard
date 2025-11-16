export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('Fetching Gist from server:', url);
    
    // Add cache busting
    const cacheBuster = `?t=${Date.now()}`;
    const fullUrl = url + cacheBuster;
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Admin-Dashboard',
        'Accept': 'text/plain'
      }
    });

    if (!response.ok) {
      console.error('Gist fetch failed:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: `Failed to fetch: ${response.status} ${response.statusText}` 
      });
    }

    const text = await response.text();
    console.log('Gist fetched successfully, length:', text.length);
    
    return res.status(200).json({ content: text });
  } catch (error) {
    console.error('Error fetching gist:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
