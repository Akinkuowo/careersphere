"use server"

import { AddPostRequestBody } from "@/app/api/route"
import Post from "@/mongodb/models/post"
import { IUser } from "@/types/user"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const createPostAction = async (formData: FormData) => {
    const user = await currentUser()

    if(!user){
        return new NextResponse("unauthorized user", {status: 401})
    }

    const postText = formData.get("postInput") as string
    const image = formData.get("image") as File
    let imageUrl: string | undefined

    if(!postText){
        return new NextResponse("You must provide a text input", {status: 400})
    }

    //define user
    const dbUser: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstname: user.firstName || "John Doe",
        lastname: user.lastName || ""
    }
    
    try{
        if(image.size > 0){
            const body: AddPostRequestBody = {
                user: dbUser,
                text: postText,
                // imageUrl?: imageUrl
            }
        }else{
            const body: AddPostRequestBody = {
                user: dbUser,
                text: postText
            }
    
            await Post.create(body)
        }

    }catch (error){
        throw new Error("An error occurs")
    }
    // upload image if there is one

    // create post in database

    // revalidatePath "/"
}