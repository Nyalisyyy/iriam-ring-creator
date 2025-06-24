import { AuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@vercel/postgres";

// next-authの型定義を拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.id || !user.email) return false;
      const client = createClient({ connectionString: process.env.DIRECT_DATABASE_URL });
      await client.connect();
      try {
        await client.sql`
          INSERT INTO users (id, name, email, image)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${user.image})
          ON CONFLICT (id) DO UPDATE
          SET name = EXCLUDED.name, image = EXCLUDED.image;
        `;
        return true;
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false;
      } finally {
        await client.end();
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
}