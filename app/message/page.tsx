// app/message/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn } from "@clerk/nextjs";
import toast from "react-hot-toast";

const MessageIndexPage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.error("You need to be logged in to view messages.");
      router.push(`/`);
      return;
    }

    // Redirect to default user message, you can modify this logic based on your requirements
    router.push(`/message/${user.id}`); // or any default user ID you want to use
  }, [user, router]);

  return (
    <SignedIn>
      <div className="flex justify-center items-center h-full">
        <h2>Select a contact to view messages.</h2>
      </div>
    </SignedIn>
  );
};

export default MessageIndexPage;
