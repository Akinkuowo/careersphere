"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IpostDocument } from "@/mongodb/models/post"
import { useUser } from "@clerk/nextjs"
import { Trash2Icon } from "lucide-react"
import React, { useState } from "react"
import ReactTimeago from "react-timeago"
import { PostOptions } from "../post-options/post-options"
import toast from "react-hot-toast"
import Image from "next/image"


export const Post = ({ post }: { post: IpostDocument }) => {
  const { user } = useUser()

  // Check if the current logged-in user is the author of the post
  const isOwner = user?.id === post.user.userId

  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    // setError(null)

    try {
      const response = await fetch(`/api/posts/${post._id}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        await response.json();
        setError("Failed to delete post. Please try again."); // Set error state for feedback
        toast.error(`An error occurs while trying to delete the post ${error}`, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          }})
      } else {
        toast.success("post deleted Successfully", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          }})
        // Call the onDelete prop to refresh the posts or handle UI update
        location.reload(); // Alternatively, you can refresh the entire page
      }
    } catch (error) {
      console.log(error)      
    } finally {
      setIsDeleting(false)
    }
  }

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
              @{post.user.firstname}-{post.user.userId.toString().slice(-4)}
            </p>
            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>
          {isOwner && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2Icon />
              {isDeleting && <span className="ml-2">Deleting...</span>}
            </Button>
          )}
        </div>
      </div>
      
      <div>
          <p className="px-4 pb-2 mt-2">{post.text}</p>
          {
            post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt="Post Image"
                width={500}
                height={500}
                className="w-full mx-auto"
              />
            )
          }
      </div>

      <PostOptions 
        post={post}
      />

    </div>
  )
}
