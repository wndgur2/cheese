import axios from "axios";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";

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
            id: "cheese",
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials, req) {
                console.log("LOGIN", req.query);
                try {
                    const res = await axios.post(
                        `http://${process.env.NEXT_PUBLIC_API}/auth`,
                        null,
                        {
                            params: req.query,
                        }
                    );
                    console.log("RES: ", res.data);
                    return {
                        id: res.data.data.id,
                        email: req.query.email,
                        name: res.data.data.nickname,
                        authorization: res.headers.authorization.split(" ")[1],
                        "refresh-token":
                            res.headers["refresh-token"].split(" ")[1],
                    };
                } catch (error) {
                    console.log("LOGINERROR", error.response.data);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/home/signin",
    },
    callbacks: {
        signIn(user, account, profile, email, credentials) {
            return user;
        },
        session: async ({ session, token }) => {
            if (!session) return session;
            session.user.id = token.uid;
            session.user.authorization = token.authorization;
            session.user["refresh-token"] = token["refresh-token"];
            return session;
        },
        jwt: async ({ user, token }) => {
            if (!user) return token;
            token.uid = user.id;
            token.authorization = user.authorization;
            token["refresh-token"] = user["refresh-token"];
            return token;
        },
    },
};
export default NextAuth(authOptions);
