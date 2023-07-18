import NextAuth from "next-auth";
import axiosPrivate from "@/app/config/axiosPrivate";

import CredentialsProvider from "next-auth/providers/credentials";

const handle = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {},
      type: "credentials",
      authorize: async (credentials, req) => {
        const { email, password } = credentials;
        try {
          const res = await axiosPrivate.post(`/auth/login`, {
            email,
            password,
          });

          return res.data;
        } catch (err) {
          const error = err;
          if (error.response) {
            throw new Error(error.response.data.message);
          } else {
            throw new Error(error.message);
          }
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
    jwt: async ({ token, user, account, session, trigger }) => {
      if (user) token.user = user;
      if (trigger === "update" && session) {
        if (session.accessToken) {
          token.user.accessToken = session.accessToken;
        }
        if (session.accessToken) {
          token.user.refreshToken = session.refreshToken;
        }
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret:
    "3cc80b75056bd4ab892c977d6b9f7bd2bab0d52e487254463522a09e6f116c1b69a1d8f31ea5100e2efbffc2840f43d1",
  pages: {
    signIn: "/auth/sign-in",
  },
});

export { handle as GET, handle as POST };
