export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TOKEN = process.env.NOTION_TOKEN;
  const DB_ID = process.env.NOTION_DB_ID;

  if (!TOKEN || !DB_ID) {
    return res.status(500).json({ error: '環境變數未設定' });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: '截止日期',
              date: { is_not_empty: true }
            }
          ]
        },
        sorts: [
          { property: '截止日期', direction: 'ascending' }
        ],
        page_size: 100
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();

    // 整理資料格式給甘特圖用
    const tasks = data.results.map(page => {
      const props = page.properties;

      // 取得名稱
      const name = props['工作項目']?.title?.[0]?.plain_text || '未命名';

      // 取得類型
      const type = props['類型']?.select?.name || '專案任務';

      // 取得狀態
      const status = props['狀態']?.status?.name || props['狀態']?.select?.name || '待辦理';

      // 取得日期
      const dateObj = props['截止日期']?.date;
      const start = dateObj?.start || null;
      const end = dateObj?.end || dateObj?.start || null;

      // 取得負責人
      const assignees = props['負責人']?.people?.map(p => p.name) || [];

      // 取得備註
      const note = props['備註']?.rich_text?.[0]?.plain_text || '';

      // 取得優先度
      const priority = props['優先度']?.select?.name || '';

      return { id: page.id, name, type, status, start, end, assignees, note, priority };
    }).filter(t => t.start); // 只保留有日期的

    return res.status(200).json({ tasks });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
