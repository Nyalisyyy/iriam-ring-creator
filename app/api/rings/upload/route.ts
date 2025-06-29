import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@vercel/postgres';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // 先ほど作成した設定をインポート

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 【重要】現在のログイン情報を取得
  const session = await getServerSession(authOptions);
  // ログインしていればユーザーIDを、していなければnull（ゲスト）を取得
  const userId = session?.user?.id ?? null;

  const file = await request.blob();
  const filename = request.headers.get('x-vercel-filename') || 'ring.png';
  const fileType = file.type;

  if (!file) {
    return NextResponse.json({ error: "No file body" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueFilename = `${nanoid()}-${filename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: fileType,
    });
    await s3Client.send(command);

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`;
    const ringId = nanoid(12);

    const client = createClient({ connectionString: process.env.DIRECT_DATABASE_URL });
    await client.connect();
    try {
      // 【重要】INSERT文にuser_idを追加
      await client.sql`
        INSERT INTO icon_rings (id, image_url, user_id) 
        VALUES (${ringId}, ${publicUrl}, ${userId});
      `;
    } finally {
      await client.end();
    }
    
    const proto = request.headers.get("x-forwarded-proto") || 'http';
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const shareUrl = `${proto}://${host}/create/${ringId}`;
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 60);

    return NextResponse.json({
      ringId,
      shareUrl,
      deletionDate: deletionDate.toISOString(),
    });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: { message: 'Failed to upload file.' }}, { status: 500 });
  }
}