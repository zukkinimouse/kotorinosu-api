export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    try {
      const response = await fetch(
        `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filter: {
              property: '公開',
              checkbox: { equals: true },
            },
          }),
        }
      );
  
      const data = await response.json();
  
      // 生データをそのまま返す（デバッグ用）
      return res.status(200).json(data);
  
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }