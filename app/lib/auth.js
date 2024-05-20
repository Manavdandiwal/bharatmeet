import { dbConnect } from "./dbConnect";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserSchema from "@/models/user";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "SSO Details",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            async authorize(credentials, req) {
                try {
                    await dbConnect();
                    const user = await UserSchema.findOne({
                        email: credentials.email,
                        password: credentials.password,
                    });
                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (err) {
                    console.error("Error during authorization:", err);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.role) {
                session.user.role = token.role;
                session.user.id = token.id;
                session.user.name = token.name;
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
};

export default NextAuth(authOptions);
