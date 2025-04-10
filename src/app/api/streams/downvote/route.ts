import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession as getSession } from "next-auth";
import { prismaClient } from "../../../../../lib/db";

const UpvoteSchema = z.object({
StreamId: z.string(), 
})
export async function POST(request: Request) {
    const session=await getServerSession( );
     const user=await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? "",
        },
     });
     if(!session?.user?.email){
        return NextResponse.json(
            {
                message: "Unauthenticated",
            },
            { 
                status: 403,
            }
        )
     } 
     try{
        const data=UpvoteSchema.parse(await request.json());
        await prismaClient.upvote.delete({
            where:{
                streamID_userID: {
                    userID: user?.id ?? "",
                    streamID: data.StreamId,
                }
            }
        })
    } catch(e){
        return NextResponse.json(
            {
                message: "Error while upvoting",
            },
            {
                status: 400,
            }
        )

    }
     }
     export async function GET(request: NextRequest) {
        const creatorId= request.nextUrl.searchParams.get("creatorId");
        const streams=await prismaClient.user.findMany({
            where:{
                id: creatorId ?? "",

            }
        })
        return NextResponse.json({
            streams

        })
 
     }

   
async function getServerSession() {
    try {
        const session = await getSession();
        return session;
    } catch (error) {
        console.error("Error fetching server session:", error);
        return null;
    }
}
