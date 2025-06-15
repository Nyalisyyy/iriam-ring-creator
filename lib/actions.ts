// lib/actions.ts

'use server';

import { sql } from '@vercel/postgres';
import { IconRing } from '@/types';
import { unstable_noStore as noStore } from 'next/cache';

/**
 * IDを指定してアイコンリングの情報をデータベースから取得します。
 * @param id リングのID
 * @returns IconRingオブジェクト or null
 */
export async function getRingById(id: string): Promise<IconRing | null> {
  // 動的なデータを扱うため、キャッシュを無効化します。
  noStore();
  
  try {
    const result = await sql<IconRing>`
      SELECT id, image_url, created_at FROM icon_rings WHERE id = ${id}
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database Error: Failed to fetch ring data.', error);
    // エラーが発生した場合はnullを返すか、エラーをスローするか選択できます。
    // ここではnullを返して、呼び出し元で404ページなどを表示させます。
    return null;
  }
}