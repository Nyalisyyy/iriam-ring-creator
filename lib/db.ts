import { createClient } from '@vercel/postgres';
import type { IconRing } from '@/types';

export async function getRingById(id: string): Promise<IconRing | null> {
  // createClient() を使用して、直接接続クライアントを作成
  const client = createClient({
    connectionString: process.env.DIRECT_DATABASE_URL,
  });
  // データベースに接続
  await client.connect();

  try {
    // client.sql を使ってクエリを実行
    const result = await client.sql<IconRing>`SELECT * FROM icon_rings WHERE id = ${id}`;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch ring:', error);
    return null;
  } finally {
    // 【重要】処理が終わったら、必ず接続を閉じる
    await client.end();
  }
}

export async function getRingsForUser(userId: string) {
  const client = createClient({ connectionString: process.env.DIRECT_DATABASE_URL });
  await client.connect();
  try {
    const result = await client.sql`
      SELECT id, image_url, created_at FROM icon_rings 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    return result.rows;
  } finally {
    await client.end();
  }
}