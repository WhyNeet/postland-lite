import { prisma } from "@/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          username: profile.username ?? profile.email.split("@")[0],
          id: profile.sub,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
          name:
            profile.given_name +
            (profile.family_name ? " " + profile.family_name : ""),
        };
      },
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = (user as any).username;
        session.user.bio = (user as any).bio;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
