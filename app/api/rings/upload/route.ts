import { put } from '@vercel/blob';
import { createPool } from '@vercel/postgres';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 【重要】データベース接続を、APIが呼び出されたこの瞬間に実行する
  const pool = createPool({
    connectionString: process.env.DIRECT_DATABASE_URL,
  });

  const filename = request.headers.get('x-vercel-filename') || 'ring.png';

  if (!request.body) {
    return NextResponse.json({ error: "No file body" }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: true,
    });
    
    const ringId = nanoid(12);

    await pool.sql`
      INSERT INTO icon_rings (id, image_url) VALUES (${ringId}, ${blob.url});
    `;

    const proto = request.headers.get("x-forwarded-proto") || 'http';
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const shareUrl = `${proto}://${host}/create/${ringId}`;

    return NextResponse.json({ ringId, shareUrl });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: { message: 'Failed to upload file.', error: error } }, { status: 500 });
  }
}