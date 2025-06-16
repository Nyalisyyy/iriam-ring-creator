import { createPool } from '@vercel/postgres';
import type { IconRing } from '@/types';

export async function getRingById(id: string): Promise<IconRing | null> {
  // 【重要】データベース接続を、関数が呼び出されたこの瞬間に実行する
  const pool = createPool({
    connectionString: process.env.DIRECT_DATABASE_URL,
  });

  try {
    const result = await pool.sql<IconRing>`SELECT * FROM icon_rings WHERE id = ${id}`;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch ring:', error);
    return null;
  }
}