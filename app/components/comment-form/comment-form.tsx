"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export const CommentForm = ({ postId }: { postId: string }) => {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const [commenting, setCommenting] = useState(false);

  const handleComment = async (FormData: FormData): Promise<void> => {
    if (!user?.id) {
      toast.error("User is not authorized", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    setCommenting(true);

    const commentInput = FormData.get("commentInput") as string;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, text: commentInput }),
      });

      if (response) {
        toast.success("Comment added successfully", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        ref.current?.reset();
        location.reload()
      } else {
        const errorData = await response;
        throw new Error(`An error occours ${errorData}`);
      }
    } catch (error) {
      toast.error(`Error creating comment: ${error}`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setCommenting(false);
    }
  };

  return (
    <form
      ref={ref}
      action={(FormData) => {
        handleComment(FormData);
      }}
      className="flex space-x-1 items-center"
    >
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
          placeholder="Add a comment..."
          className="outline-none flex-1 text-sm bg-transparent"
          disabled={commenting}
        />
        <button type="submit" disabled={commenting}>
          {commenting ? "Commenting..." : "Comment"}
        </button>
      </div>
    </form>
  );
};
