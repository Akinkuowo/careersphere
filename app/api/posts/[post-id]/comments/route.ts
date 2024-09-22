import connectDb from "@/mongodb/db";
import Post from "@/mongodb/models/post";
import { IcommentBase } from "@/types/comments";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET: Fetch all comments for a specific post
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

    // Fetch all comments using instance method
    const comments = await post.getAllComments();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while trying to fetch the post" },
      { status: 500 }
    );
  }
}

// POST: Add a comment to a specific post
export interface CommentPostBodyRequest {
  text: string;
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

  // Extract comment text from the request body
  const { text }: { text: string } = await request.json();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create a new comment object
    const comment: IcommentBase = {
      user: {
          userId: user.id,
          userImage: user.imageUrl || "",
          firstname: user.firstName || "unknown"
      },
      text
    };

    // Add the comment to the post using the instance method
    await post.commentOnPost(comment);

    return NextResponse.json({ message: "Comment added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while trying to add a comment on the post" },
      { status: 500 }
    );
  }
}
