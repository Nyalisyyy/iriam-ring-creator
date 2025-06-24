'use server';

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from '../lib/auth';

export async function deleteRingAction(formData: FormData) {
  const ringId = formData.get('ringId') as string;
  const imageUrl = formData.get('imageUrl') as string;

  if (!ringId || !imageUrl) {
    throw new Error("Missing required form data.");
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a ring.");
  }
  const userId = session.user.id;

  const client = createClient({ connectionString: process.env.DIRECT_DATABASE_URL });
  await client.connect();
  try {
    // 削除しようとしているリングが本当に本人のものか確認
    const { rowCount } = await client.sql`
      DELETE FROM icon_rings WHERE id = ${ringId} AND user_id = ${userId}
    `;

    // 自分のリングでなければ（または存在しなければ）エラー
    if (rowCount === 0) {
      throw new Error("Ring not found or permission denied.");
    }
    
    // R2クライアントを初期化
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    const filename = imageUrl.split('/').pop();
    if(filename) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: filename,
      });
      await s3Client.send(deleteCommand);
    }
  } catch(error) {
    console.error("Failed to delete ring:", error);
    // エラーを再スローして、フロントエンドでハンドリングすることも可能
    throw new Error("リングの削除に失敗しました。");
  } finally {
    await client.end();
  }
  
  // ページを再検証して、一覧を更新する
  revalidatePath('/');
}