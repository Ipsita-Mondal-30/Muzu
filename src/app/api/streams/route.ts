import { NextRequest } from "next/server";
import {z} from "zod";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string(),
});
export async function POST(request: NextRequest) {
    try{
        const data= CreateStreamSchema.parse(await request.json());
    } catch (error) {
        console.error("Error parsing request data:", error);
    }{status:411

    }
}