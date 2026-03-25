export default async function handler(req, res) {
  // CORSを最初に全部設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
          sorts: [
            {
              property: '日付',
              direction: 'descending',
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const posts = data.results.map(page => ({
      id:    page.id,
      title: page.properties['名前']?.title?.[0]?.plain_text || '無題',
      date:  page.properties['日付']?.date?.start || '',
      body:  page.properties['テキスト']?.rich_text?.[0]?.plain_text || '',
    }));

    return res.status(200).json({ posts });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}