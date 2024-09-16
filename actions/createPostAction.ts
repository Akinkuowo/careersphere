"use server"

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

    // upload image if there is one

    // create post in database

    // revalidatePath "/"
}