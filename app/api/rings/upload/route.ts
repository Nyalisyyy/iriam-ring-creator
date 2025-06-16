import { put } from '@vercel/blob';
import { createPool } from '@vercel/postgres'; // ここを変更
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

// 新しい環境変数を使って、データベースの接続プールを作成
const pool = createPool({
  connectionString: process.env.DIRECT_DATABASE_URL,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
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

    // pool.sqlを使ってクエリを実行
    await pool.sql`
      INSERT INTO icon_rings (id, image_url) VALUES (${ringId}, ${blob.url});
    `;

    const proto = request.headers.get("x-forwarded-proto") || 'http';
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const shareUrl = `${proto}://${host}/create/${ringId}`;

    return NextResponse.json({ ringId, shareUrl });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}