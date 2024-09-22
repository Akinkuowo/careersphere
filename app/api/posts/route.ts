import connectDb from '@/mongodb/db';
import Post, { IpostBase } from '@/mongodb/models/post';
import { IUser } from '@/types/user';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export interface AddPostRequestBody {
    user: IUser;
    text: string;
    imageUrl?: string | null;
}

export async function POST(request: Request) {
    const user = currentUser()

    if(!user){
        return new NextResponse("Unauthorized", { status: 500 });
    }

    try {

        await connectDb();

        const { user, text, imageUrl }: AddPostRequestBody = await request.json() 
    
        const postData: IpostBase = {
            user,
            text,
            ...(imageUrl && { imageUrl })
        }
    
        const post = await Post.create(postData) 

        return NextResponse.json({ post }, { status: 200 });
    } catch (error) {
        return new NextResponse("An error occurred while trying to create the post", { status: 500 });

    }

}

export async function GET(request: Request) {
    try {
        await connectDb(); // Connect to the database
        console.log("Connected to DB");
        const posts = await Post.getAllPosts(); // Fetch all posts
        console.log("Posts retrieved:", posts);

        // Return posts as JSON
        return NextResponse.json({ posts });
    } catch (error) {
        return new NextResponse("An error occurred while trying to retrieve posts from the database", { status: 500 });
    }
}
