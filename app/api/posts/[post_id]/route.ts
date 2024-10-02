import connectDb from "@/mongodb/db";
import Post from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET method to fetch a post by ID
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

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while trying to fetch the post" },
      { status: 500 }
    );
  }
}

// DELETE method to delete a post by ID
export async function DELETE(
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

    if (post.user.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    // Delete the post
    // await Post.findByIdAndDelete(params.post_id);
    await Post.removePost()

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while trying to delete the post" },
      { status: 500 }
    );
  }
}
