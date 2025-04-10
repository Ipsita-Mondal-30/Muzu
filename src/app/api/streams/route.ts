import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../../../../lib/db";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = 
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(request: NextRequest) {
    try {
      const data = CreateStreamSchema.parse(await request.json());
  
      const match = data.url.match(YT_REGEX);
      if (!match) {
        return NextResponse.json(
          { message: "Wrong URL format" },
          { status: 400 }
        );
      }
  
      const extractedId = match[1];

     const res= await youtubesearchapi.GetVideoDetails(extractedId);
     console.log(res.title);
     console.log(res.thumbnail.thumbnails);
     const thumbnails = res.thumbnail.thumbnails;
     thumbnails.sort((a: {width: number}, b: {width:number }) => a.width<b.width ? 1 : -1);

  
      const stream = await prismaClient.stream.create({
        data: {
          url: data.url,
          userID: data.creatorId,
          videoUrl: data.url,
          extractedId, // ✅ lowercase only
          type: "Youtube",
          title: res.title ? res.title : "Can't find video",
          smallImage:(thumbnails.length>1?thumbnails[thumbnails.length-2].url:thumbnails[thumbnails.length-1].url)?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV1RlrbxJfEqwRJACDSVzfUmCqSdrP8QUkYA&s",
          largeImage:thumbnails[thumbnails.length-1].url ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV1RlrbxJfEqwRJACDSVzfUmCqSdrP8QUkYA&s",
        },
      });
  
      return NextResponse.json({
        message: "Stream added successfully",
        id: stream.id,
      });
    } catch (e) {
      console.error("Stream creation error:", e);
      return NextResponse.json(
        { message: "Error while adding a stream" },
        { status: 400 }
      );
    }
  }
  