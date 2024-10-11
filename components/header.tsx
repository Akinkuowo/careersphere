import { Briefcase, HomeIcon, MessageSquare, SearchIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <Image 
        src="/logo.png"
        alt="Logo"
        width={150}
        height={100}
        className="rounded-md mr-3"
      />
      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-72">
          <SearchIcon 
            className="h-4 text-gray-600"
          />
          <input 
            type="text" 
            placeholder="Search"
            className="bg-transparent flex-1 outline-none"
          />
        </form>
      </div>
      <div className="flex items-center space-x-4 px-6 ">
        <Link href="/" className="icon hover:text-sky-500">
          <HomeIcon 
            className="h-5"
          />
          <p>Home</p>
        </Link>
        <Link href="/" className="icon hidden md:flex hover:text-sky-500">
          <UserIcon
            className="h-5"
          />
          <p>Network</p>
        </Link>
        <Link href="/jobs/" className="icon hidden md:flex hover:text-sky-500">
          <Briefcase 
            className="h-5"
          />
          <p>Jobs</p>
        </Link>
        {/* Update this link to always go to the message component */}
        <Link href="/message/" className="icon hover:text-sky-500">
          <MessageSquare 
            className="h-5"
          />
          <p>Message</p>
        </Link>

        {/* user button */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* sign in */}
        <SignedOut>
          <Button className="bg-sky-400" asChild>
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
        </SignedOut>
      </div>
    </div>
  );
};
