import connectDb from "@/mongodb/db";
import Post from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { post_id: string } }
  ) {
    await connectDb();
  
    try {
      const post = await Post.findById(params.post_id);
  
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
  
      const like = Post.likes
      return NextResponse.json(like)

    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred while trying to fetch the post" },
        { status: 500 }
      );
    }
  }

  export interface likePostBodyRequest{
    userId: string
  }

  export async function POST(
    request: Request,
    { params }: { params: { post_id: string } }
    
) {
    const user = await currentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }    

    await connectDb();

    try {
      const post = await Post.findById(params.post_id);
  
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
  
  
      // Delete the post
      // await Post.findByIdAndDelete(params.post_id);
      await Post.likePost(user.id)
  
      return NextResponse.json({ message: "Post liked successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "An error occurred while trying to like the post" },
        { status: 500 }
      );
    }


  }