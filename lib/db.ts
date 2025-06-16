import { createPool } from '@vercel/postgres';
import type { IconRing } from '@/types';

// 新しい環境変数を使って、データベースの接続プールを作成
const pool = createPool({
  connectionString: process.env.DIRECT_DATABASE_URL,
});

export async function getRingById(id: string): Promise<IconRing | null> {
  try {
    // pool.sqlを使ってクエリを実行
    const result = await pool.sql<IconRing>`SELECT * FROM icon_rings WHERE id = ${id}`;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch ring:', error);
    return null;
  }
}