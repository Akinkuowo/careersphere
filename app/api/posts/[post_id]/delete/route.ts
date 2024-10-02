// app/api/posts/[post-id]/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Post from '@/mongodb/models/post';
import connectDb from '@/mongodb/db';
import { currentUser } from '@clerk/nextjs/server';


export async function DELETE(req: NextRequest, { params }: { params: { 'post_id': string } }) {
  await connectDb();

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDb();

  const { 'post_id': postId } = params;
  console.log("Attempting to delete post with ID:", postId); 
  
  const post = await Post.findById(postId);
  if (!post) {
    console.log(`Post with ID ${postId} not found in the database.`);
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }
  if (post.user.userId !== user.id) {
    return NextResponse.json({ message: 'You are not authorized to delete this post' }, { status: 403 });
  }

  try{

    await post.removePost();
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    
  }catch(error){
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}
