"use server"

import Post from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export default async function deletePostAction(postId: string) {
    const user = await currentUser();
    
    if (!user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await Post.findById(postId);  // Await the result

    if (!post) {
        return new NextResponse("Post not found", { status: 400 });
    }

    // Check if the current user is the post's owner
    if (post.user.userId !== user.id) {
        return new NextResponse("You are not authorized to delete this post", { status: 403 });
    }

    try {     
        // Delete the post if the user is the owner
        await Post.removePost()
    
        revalidatePath("/")
    } catch (error) {
        return new NextResponse("An error occurs while trying to delete post", {status: 400})
    }
}
