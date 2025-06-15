import { sql } from '@vercel/postgres';
import { IconRing } from '@/types';

export async function getRingById(id: string): Promise<IconRing | null> {
  try {
    const result = await sql<IconRing>`SELECT * FROM icon_rings WHERE id = ${id}`;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch ring:', error);
    return null;
  }
}