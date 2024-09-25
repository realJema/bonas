import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import prisma from "./prisma/client";
import { getUserById } from "./data/user";
import { Account } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/signin",
    // error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        const existingUser = await getUserById(user.id!);

        if (!existingUser?.emailVerified) {
          return false;

          // TODO: Add 2FA Check
        }
      }

      if (account?.provider === "google" && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          include: { accounts: true },
        });

        if (existingUser) {
          // Check if this Google account is already linked to the user
          const existingAccount = existingUser.accounts.find(
            (acc: Account) =>
              acc.provider === "google" &&
              acc.providerAccountId === account.providerAccountId
          );

          if (existingAccount) {
            // The account is already linked, proceed with sign in
            return true;
          }

          // If the account is not linked, link it now
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });

          // Update user info
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: profile.name || existingUser.name,
              image: profile.picture || existingUser.image,
              emailVerified: new Date(),
            },
          });

          return true;
        } else {
          // Create new user
          await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name || undefined,
              image: profile.picture || undefined,
              emailVerified: new Date(), // Set email as verified for new users
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              },
            },
          });
          return true;
        }
      }
      return true; // Allow sign in for other providers
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
