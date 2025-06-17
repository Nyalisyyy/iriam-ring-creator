import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// R2クライアントを初期化
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Vercel Cron Jobs は GET リクエストを送信します
export async function GET() {
  // 60日前の日付を計算
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // データベースに接続
  const client = createClient({ connectionString: process.env.DIRECT_DATABASE_URL });
  await client.connect();

  try {
    // 60日より古いレコードを取得
    const result = await client.sql`
      SELECT id, image_url FROM icon_rings WHERE created_at < ${sixtyDaysAgo.toISOString()}
    `;

    // 削除対象がなければ終了
    if (result.rows.length === 0) {
      await client.end();
      return NextResponse.json({ message: 'No old images to delete.' }, { status: 200 });
    }

    // 削除処理
    for (const row of result.rows) {
      const imageUrl = row.image_url;
      const filename = imageUrl.split('/').pop(); // URLからファイル名を抽出

      if (filename) {
        // 1. Cloudflare R2から画像を削除
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: filename,
        });
        await s3Client.send(deleteCommand);

        // 2. データベースからレコードを削除
        await client.sql`DELETE FROM icon_rings WHERE id = ${row.id}`;
        
        console.log(`Deleted old image: ${filename}`);
      }
    }

    return NextResponse.json({ message: `Deleted ${result.rows.length} old images.` }, { status: 200 });

  } catch (error) {
    console.error('Error deleting old images:', error);
    return NextResponse.json({ message: 'Error during old image deletion.' }, { status: 500 });

  } finally {
    // 最後に必ず接続を閉じる
    await client.end();
  }
}