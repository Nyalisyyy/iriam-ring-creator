import { put } from '@vercel/blob';
import { createClient } from '@vercel/postgres'; // ここを変更
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // createClient() を使用して、直接接続クライアントを作成
  const client = createClient({
    connectionString: process.env.DIRECT_DATABASE_URL,
  });
  // データベースに接続
  await client.connect();

  const filename = request.headers.get('x-vercel-filename') || 'ring.png';

  if (!request.body) {
    await client.end(); // エラー時も接続を閉じる
    return NextResponse.json({ error: "No file body" }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: true,
    });
    
    const ringId = nanoid(12);

    // client.sql を使ってクエリを実行
    await client.sql`
      INSERT INTO icon_rings (id, image_url) VALUES (${ringId}, ${blob.url});
    `;

    const proto = request.headers.get("x-forwarded-proto") || 'http';
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const shareUrl = `${proto}://${host}/create/${ringId}`;

    return NextResponse.json({ ringId, shareUrl });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: { message: 'Failed to upload file.' }}, { status: 500 });
  } finally {
    // 【重要】処理が終わったら、必ず接続を閉じる
    await client.end();
  }
}