"use server"

import { AdddCommentRequestBody } from "@/app/api/posts/[post_id]/comments/route";
import Post from "@/mongodb/models/post";
import { IcommentBase } from "@/types/comments";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createCommentAction = async (postId: string, FormData: FormData) => {
    const user = await currentUser();
    const commentInput = FormData.get("commentInput") as string;

    // Validate postId
    if (!postId) {
        throw new Error("Post ID is required");
    }

    // Validate commentInput
    if (!commentInput) {
        throw new Error("Comment input is required");
    }

    // Validate if user is authenticated
    if (!user) {
        throw new Error("Unauthorized");
    }

    // Fetch post by ID
    const post = await Post.findById(postId);

    // Validate if post exists
    if (!post) {
        throw new Error("Post not found");
    }

    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstname: user.firstName || "",
        lastname: user.lastName || "",
        imageUrl: ""
    };

    const comment: IcommentBase = {
        user: userDB,
        text: commentInput
    };

    try {
        await post.commentOnPost(comment); // Assuming this method is async
        revalidatePath("/"); // Revalidate path to refresh the page
    } catch (error) {
        throw new Error(`An error occurred while adding a comment: ${error}`);
    }
};
