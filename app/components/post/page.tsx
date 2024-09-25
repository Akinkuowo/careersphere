"use client"

import DeletePostAction from "@/actions/deletePostAction"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IpostDocument } from "@/mongodb/models/post"
import { useUser } from "@clerk/nextjs"
import { Trash2Icon } from "lucide-react"
import ReactTimeago from "react-timeago"

export const Post = ({ post }: { post: IpostDocument }) => {
  const { user } = useUser()

  // Check if the current logged-in user is the author of the post
  const isOwner = user?.id === post.user.userId

  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        <div>
          <Avatar>
            <AvatarImage src={post.user.userImage} alt={`${post.user.firstname} ${post.user.lastname}`} />
            <AvatarFallback>
              {post.user.firstname.charAt(0)}
              {post.user.lastname?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between flex-1">
          <div>
            <p className="font-semibold" key={post.user.userId}>
              {post.user.firstname} {post.user.lastname}{" "}
              {isOwner && (
                <Badge className="ml-2" variant="secondary">
                  Author
                </Badge>
              )}
            </p>
            <p className="text-xs text-gray-400">
              @{post.user.firstname}
              {post.user.firstname}-{post.user.userId.toString().slice(-4)}
            </p>
            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>
            {isOwner && (
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                        const promise = DeletePostAction(post._id)
                    }}
                >
                    <Trash2Icon />
                </Button>
            )}

        </div>
      </div>
    </div>
  )
}

