"use client"

import { IpostDocument } from "@/mongodb/models/post";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, MessageCircleIcon, Repeat2, Send } from "lucide-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { likePostBodyRequest } from "@/app/api/posts/[post_id]/like/route";
import { unLikePostBodyRequest } from "@/app/api/posts/[post_id]/unlike/route";
import { CommentForm } from "../comment-form/page";
import { CommentFeed } from "../comment-feed/comment-feed";

export const PostOptions = ({ post }: { post: IpostDocument }) => {
  const [likes, setLikes] = useState<string[]>([]);
  const [liked, setIsLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const userId = user?.id;

  useEffect(() => {
    // Fetch the latest likes when the component mounts
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/posts/${post._id}/like`);
        if (!response.ok) {
          throw new Error("Failed to fetch likes");
        }
        const fetchedLikes = await response.json();
        setLikes(fetchedLikes);
        if (userId && fetchedLikes.includes(userId)) {
          setIsLiked(true);
        }
      } catch (error) {
        toast.error("Failed to fetch likes", {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        });
      }
    };

    fetchLikes();
  }, [post._id, userId]);

  const handleMessageClick = async () => {
    if (!userId) {
      toast.error("You need to be logged in to message this user.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      router.push(`/`); // Redirect to login or homepage
      return;
    }
  
    try {
      // Send a request to add the post author to the user's contact list
      
      const response = await fetch(`/api/contact/`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: post.user.userId,
          firstName: post.user.firstname,
          lastName: post.user.lastname,
          imageUrl: post.user.userImage,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add contact");
      }
  
      // Navigate to message page, passing author ID as a query parameter
      router.push(`/message/${post.user.userId}`);
    } catch (error) {
      console.error("Failed to add contact", error);
      toast.error("Failed to add contact. Please try again later.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  


  const likeOrUnlikePost = async () => {
    if (!userId) {
      toast.error("You can't like this post without being logged in.", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
      router.push(`/`);
      return;
    }

    const originalLiked = liked;
    const originalLikes = likes;

    // Update likes locally
    const newLikes: string[] = liked
      ? (likes ?? []).filter((like) => like !== userId)
      : [...(likes ?? []), userId];

    setIsLiked(!liked);
    setLikes(newLikes);

    const body: likePostBodyRequest | unLikePostBodyRequest = {
      userId: userId as string,
    };

    try {
      const response = await fetch(`/api/posts/${post._id}/${liked ? "unlike" : "like"}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setIsLiked(originalLiked);
      setLikes(originalLikes);
      toast.error("Something went wrong", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          {likes && likes.length > 0 && (
            <p className="text-xs text-gray-400 cursor-pointer hover:underline">
              {likes.length} likes
            </p>
          )}
        </div>

        <div>
          {post.comments && post.comments.length > 0 && (
            <p
              onClick={() => setIsCommenting(!isCommenting)}
              className="text-xs text-gray-400 cursor-pointer hover:underline"
            >
              {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
            </p>
          )}
        </div>
      </div>

      <div className="flex p-2 justify-between px-2 border-l border-t">
        <Button variant="ghost" className="postButton" onClick={likeOrUnlikePost}>
          <ThumbsUpIcon className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")} />
          Like
        </Button>

        <Button
          variant="ghost"
          className="postButton"
          onClick={() => setIsCommenting(!isCommenting)}
        >
          <MessageCircleIcon
            className={cn("mr-1", isCommenting && "text-[#4881c2] fill-[#4881c2]")}
          />
          comment
        </Button>

        <Button variant="ghost" className="postButton">
          <Repeat2 className="mr-1" />
          repost
        </Button>

        <Button variant="ghost" className="postButton" onClick={handleMessageClick}>
          <Send className="mr-1" />
          Message
        </Button>
      </div>

      {isCommenting && (
        <>
          <div className="p-4">
            <SignedIn>
            <CommentForm postId={post._id as string} />
            </SignedIn>
            <CommentFeed post={post} />
          </div>
        </>
      )}
    </div>
  );
};
