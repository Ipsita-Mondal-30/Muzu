import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "../../../../../lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",  
  callbacks: {
    async signIn(params) {
      if(!params.user.email) {
        return false;
      }
      console.log(params);
      try{
      await prismaClient.user.create({
        data:{
          email:params.user.email ?? "",  
          provider:"Google", 
        }

      })
    }catch(e){
        
    }
      return true;
    },
  },

  // 👇 Tell NextAuth to use custom pages
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
});

export { handler as GET, handler as POST };
