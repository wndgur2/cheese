import axios from "axios";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from 'next-auth/providers/kakao';
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id : 'cheese',
      name: 'Credentials',
      credentials: {
          email: { type: "email" },
          password: { type: "password" }
      },
      callbacks:{
        signIn(user, account, profile, email, credentials){
          console.log(user, account, profile, email, credentials);
        },
        session: async ({ session, token }) => {
          if (session?.user) {
            session.user.id = token.uid;
          }
          return session;
        },
        jwt: async ({ user, token }) => {
          if (user) {
            token.uid = user.id;
          }
          return token;
        },
      },
      session: {
        strategy: 'jwt',
      },
      async authorize(credentials, req){
        try{
          const res = await axios.post(process.env.NEXT_PUBLIC_API + "/auth", null, {
            params: req.query
          })
          return {id:res.data.data.id, email:req.query.email, name:res.data.data.nickname};
        } catch(error){
          console.log(error);
          return null;
        }
      }
    })
  ],
  pages: {
      signIn: '/home/signin',
  }
};
export default NextAuth(authOptions); 