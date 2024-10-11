// Add the "use client" directive to enable hooks
"use client";

import { useUser } from "@clerk/nextjs"; // Import useUser to get the current user
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the User interface according to your needs
interface User {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
}

export const UserInformation = () => {
    const { user } = useUser(); // Use useUser hook to get the current user
    const [cvExists, setCvExists] = useState(false); // State to check if CV exists
    const [localUser, setLocalUser] = useState<User | null>(null); // State to store user info

    useEffect(() => {
        // Set the user data from Clerk to local user state
        if (user) {
            setLocalUser({
                id: user.id,
                firstName: user.firstName || '', // Provide fallback
                lastName: user.lastName || '',   // Provide fallback
                imageUrl: user.imageUrl || '',   // Provide fallback
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchCV = async () => {
            if (localUser) {
                try {
                    const response = await fetch(`/api/cv?userId=${user?.id}`);
                    const data = await response.json();
                    
                    if (response.ok && data) {
                        console.log(data)
                        setCvExists(!!data); // Set to true if CV exists
                    }
                } catch (error) {
                    console.error("Failed to fetch CV:", error);
                }
            }
        };

        fetchCV();
    }, [localUser]);

    return (
        <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-6">
            <Avatar>
                {localUser?.imageUrl ? (
                    <AvatarImage src={localUser.imageUrl} />
                ) : (
                    <AvatarImage src="https://github.com/shadcn.png" />
                )}
                <AvatarFallback>
                    {localUser?.firstName?.charAt(0)}
                    {localUser?.lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <SignedIn>
                <div className="text-center">
                    <p className="font-semibold">
                        {localUser?.firstName} {localUser?.lastName}
                    </p>

                    <p className="text-xs">
                        @{localUser?.firstName}
                        {localUser?.lastName}-{localUser?.id?.slice(-4)}
                    </p>

                    <Link href={cvExists ? "view-cv" : "create-a-cv"}>
                        <Button className="mt-4 bg-sky-400">
                            {cvExists ? "View CV" : "Create CV"}
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

            <hr className="w-full border-gray-200 my-5" />

            <div className="flex justify-between w-full px-4 text-sm">
                <p className="semi-bold text-gray-400">Posts</p>
                <p className="text-blue-400">0</p>
            </div>

            <div className="flex justify-between w-full px-4 text-sm">
                <p className="semi-bold text-gray-400">Comments</p>
                <p className="text-blue-400">0</p>
            </div>
        </div>
    );
};
