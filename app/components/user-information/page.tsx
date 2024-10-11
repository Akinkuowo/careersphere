import { auth, currentUser } from "@clerk/nextjs/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"



export const UserInformation = async () => {
    const user = await currentUser()
    return (
        <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-6">
            <Avatar>
                {user?.id ? (
                    <AvatarImage src={user?.imageUrl} />
                ) : (
                    <AvatarImage src="https://github.com/shadcn.png" />
                )}
                <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>
             </Avatar>

             <SignedIn>
                <div className="text-center">
                    <p className="font-semibold">
                        {user?.firstName} {user?.lastName}
                    </p>

                    <p className="text-xs">
                        @{user?.firstName}
                        {user?.lastName}-{user?.id?.slice(-4)}
                    </p>

                    <Link href="create-a-cv">
                        <Button className="mt-4 bg-sky-400">
                            Create CV
                        </Button>
                    </Link>
                </div>
             </SignedIn>

             <SignedOut>
                <div className="text-center space-y-2">
                    <p className="semi-bold">You are not Signed in</p>
                </div>

                <Button asChild className="bg-sky-400 text-white">
                    <Link href="/signin">
                        Sign In
                    </Link>
                </Button>
             </SignedOut>

            <hr className="w-full border-gray-200 my-5"  />

            <div className="flex justify-between w-full px-4 text-sm">
                <p className="semi-bold text-gray-400">Posts</p>
                {/* <p className="text-blue-400">userPost.length</p> */}
                <p className="text-blue-400">0</p>
            </div>

            <div className="flex justify-between w-full px-4 text-sm">
                <p className="semi-bold text-gray-400">Comments</p>
                {/* <p className="text-blue-400">userComments.length</p> */}
                <p className="text-blue-400">0</p>
            </div>
            
        </div>
    )
}