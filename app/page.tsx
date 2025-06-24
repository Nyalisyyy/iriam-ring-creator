import { RingUploader } from "@/components/RingUploader";
import { Sparkles } from "lucide-react"; // 【重要】不要なTrash2とShare2を削除しました
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRingsForUser } from "@/lib/db";
import { RingList } from "@/components/RingList";
import { revalidatePath } from "next/cache";
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from "@vercel/postgres";

// Ringの型定義
type Ring = {
  id: string;
  image_url: string;
  created_at: Date;
};

// サーバーアクション
async function deleteRingAction(formData: FormData) {
  'use server';
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
    const { rowCount } = await client.sql`
      DELETE FROM icon_rings WHERE id = ${ringId} AND user_id = ${userId}
    `;
    if (rowCount === 0) {
      throw new Error("Ring not found or permission denied.");
    }
    
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
    throw new Error("リングの削除に失敗しました。");
  } finally {
    await client.end();
  }
  
  revalidatePath('/');
}

// メインのページコンポーネント
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  let rings: Ring[] = [];

  if (session?.user?.id) {
    const userRings = await getRingsForUser(session.user.id);
    rings = userRings.map(ring => ({
      id: ring.id,
      image_url: ring.image_url,
      created_at: new Date(ring.created_at) 
    }));
  }

  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center p-4 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-10 w-10 text-pastel-pink" />
          リングドリップ
          <Sparkles className="h-10 w-10 text-pastel-pink" />
        </h1>
        <p className="text-lg text-slate-600">
          あなただけのアイコンリングをファンに届けよう
        </p>
      </div>
      
      <RingUploader />

      {session?.user && (
        <div className="w-full max-w-md mt-12">
          <h2 className="text-xl font-bold text-white text-center">Myリング一覧</h2>
          <RingList rings={rings} deleteAction={deleteRingAction} />
        </div>
      )}
    </main>
  );
}