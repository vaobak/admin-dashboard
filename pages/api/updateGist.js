export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gistId, filename, content } = req.body;

  if (!gistId || !filename || content === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [filename]: {
            content: content
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub API error:', error);
      return res.status(response.status).json({ error: 'Failed to update gist' });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating gist:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
