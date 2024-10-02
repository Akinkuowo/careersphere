"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { useRef } from "react"

export const CommentForm = ({postId }  : {postId: string}) => {
    const { user } = useUser()
    const ref = useRef<HTMLFormElement>(null)


    return (
        <form ref={ref} action={(FormData) => {}} className="flex space-x-1 items-center">
             <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
                    <input 
                        type="text"
                        name="commentInput"
                        placeholder="add a comment...."
                        className="outline-none flex-1 text-sm bg-transparent"
                    />
                </div>
        </form>
    )
}