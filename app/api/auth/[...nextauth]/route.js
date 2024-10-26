import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";

import User from "@models/user";

// Ensure DB connection is cached across requests (for serverless environments)
let isDBConnected = false;

const handler = NextAuth({
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

        })
    ],
    callbacks: {
        async session({ session }){
        try {
            if (!isDBConnected) await connectToDB();
            const sessionUser = await User.findOne({
            email: session.user.email,
        })

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }

        return session;
            
        } catch (error) {
            console.log(error);
        }
        
    },
    async signIn({profile}){
        try {
            if (!isDBConnected) await connectToDB();
            const userExists = await User.findOne({
                email: profile.email
            });

            if(!userExists){
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ","").toLowerCase(),
                    image: profile.picture,
                });
            }
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    }
})

export { handler as GET, handler as POST }; 