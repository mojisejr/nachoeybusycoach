import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import type { NextAuthOptions } from 'next-auth';

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  debug: false, // Disable debug mode to prevent _log endpoint calls
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        // Type assertion to safely assign properties
        ;(session.user as any).role = token.role || "runner";
        ;(session.user as any).id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.role = "runner"; // Default role, can be updated based on user data
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
};

// Create and export the NextAuth handler
const handler = NextAuth(authOptions);
export { handler };