"use server"

import { AddPostRequestBody } from "@/app/api/posts/route"
import Post from "@/mongodb/models/post"
import { IUser } from "@/types/user"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { promises as fs } from "fs"
import path from "path"
import { revalidatePath } from "next/cache"

export const createPostAction = async (formData: FormData) => {
    const user = await currentUser()

    if (!user) {
        return new NextResponse("Unauthorized user", { status: 401 })
    }

    const postText = formData.get("postInput") as string
    const image = formData.get("image") as File | null

    if (!postText) {
        return new NextResponse("You must provide a text input", { status: 400 })
    }

    // Define user information
    const dbUser: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstname: user.firstName || "John Doe",
        lastname: user.lastName || ""
    }

    let imageUrl: string | undefined

    if (image && image.size > 0) {
        // Ensure it's an image MIME type
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"]
        if (!validImageTypes.includes(image.type)) {
            return new NextResponse("Invalid file type. Only JPEG, PNG, and GIF are allowed.", { status: 400 })
        }

        // Ensure file size is within acceptable limits (e.g., 5MB max)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (image.size > MAX_FILE_SIZE) {
            return new NextResponse("File size too large. Maximum size allowed is 5MB.", { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        // Create the upload directory if it doesn't exist
        await fs.mkdir(uploadDir, { recursive: true })

        // Create a unique file name
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9)
        const newFileName = `${uniqueSuffix}-${image.name}`
        const newFilePath = `${uploadDir}/${newFileName}`

        // Save the file to the upload directory
        const buffer = Buffer.from(await image.arrayBuffer())
        await fs.writeFile(newFilePath, buffer)

        // Set the relative image URL (public path)
        imageUrl = `/uploads/${newFileName}`
        // console.log("image uploaded successful " + imageUrl)

        // Create post object
        const body: AddPostRequestBody = {
            user: dbUser,
            text: postText,
            imageUrl: imageUrl // Include imageUrl if an image was uploaded
        }

        try {
            await Post.create(body)
            return new NextResponse("Post created successfully", { status: 201 })
        } catch (error) {
            console.error("An error occurred:", error)
            return new NextResponse("Failed to create post", { status: 500 })
        }
    }else{
        // Create post object
        const body: AddPostRequestBody = {
            user: dbUser,
            text: postText,
            
        }

        try {
            await Post.create(body)
            return new NextResponse("Post created successfully", { status: 201 })
            
        } catch (error) {
            console.error("An error occurred:", error)
            return new NextResponse("Failed to create post", { status: 500 })
        }
    }

    revalidatePath("/")
}
