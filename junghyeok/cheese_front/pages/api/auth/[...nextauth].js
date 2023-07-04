import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: 'c165d9df997c728673a9',
      clientSecret: '7065a743d9d24ec9cb52d0a96c0f7511bff11852',
    }),
  ],
  secret : process.env.JWTK_SECRET_KEY
};
export default NextAuth(authOptions); 