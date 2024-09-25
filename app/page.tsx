import connectDb from "@/mongodb/db";
import { PostForm } from "./components/post-form/page";
import { UserInformation } from "./components/user-information/page";
import Post from "@/mongodb/models/post";
import { SignedIn } from "@clerk/nextjs";
import { PostFeed } from "./components/post-feed/page";

export const revalidate = 0

export default async function Home() {
  await connectDb()

  const posts = await Post.getAllPosts()
 
  return (
    <div className="grid grid-cols-8 mt-5 sm:py-5">
      <section className="hidden md:inline md:col-span-2 ml-4">
        <UserInformation />
      </section>
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>
        
        <PostFeed 
          posts={posts}
        />
      </section>
      <section className="hidden xl:inline justify-center col-span-2">

      </section>
    </div>
  );
}
