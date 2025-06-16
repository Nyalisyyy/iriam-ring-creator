import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const filename = request.headers.get('x-vercel-filename') || 'ring.png';

  if (!request.body) {
    return NextResponse.json({ error: "No file body" }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'image/png',
      // 【重要】この一行を追加します
      addRandomSuffix: true, 
    });
    
    const ringId = nanoid(12);

    await sql`
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