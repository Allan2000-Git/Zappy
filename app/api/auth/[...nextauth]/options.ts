import UserModel from "@/models/User";
import connecToDb from "@/utils/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "john.doe@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "******" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await connecToDb();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { username: credentials.identifier},
                            { email: credentials.identifier}
                        ]
                    });
                    if(!user) {
                        throw new Error("No user found with the provided email or username");
                    }
                    if(!user.isVerified) {
                        throw new Error("Please verify your email address before zappying");
                    }

                    const isSamePassword = await bcrypt.compare(credentials.password, user.password);
                    if(isSamePassword) {
                        return user;
                    } else {
                        throw new Error("You have provided incorrect credentials");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        },
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        }
    }
}