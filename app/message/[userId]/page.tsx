"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  user_Id: string;
  createdAt: Date;
  senderFirstname: string;
  senderImageUrl: string;
  senderLastName: string;
  receiverFirstname: string;
  receiverImageUrl: string;
}

interface Contact {
  contactId: any;
  firstName: string;
  imageUrl: string;
  user_Id: string;
  lastMessage?: string;
  lastMessageDate?: Date;
}

const MessagePage = ({ params }: { params: { userId?: string } }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const senderId = user?.id;
  const receiverId = params.userId;

  useEffect(() => {
    if (!senderId) {
      toast.error("You need to be logged in to view messages.");
      router.push(`/`);
      return;
    }

    const fetchMessages = async () => {
      if (receiverId) {
        setLoadingMessages(true);
        try {
          const response = await fetch(`/api/message?senderId=${senderId}&receiverId=${receiverId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch messages");
          }
          const fetchedMessages = await response.json();
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Error fetching messages", error);
          toast.error("Failed to fetch messages", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } finally {
          setLoadingMessages(false);
        }
      }
    };

    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        const response = await fetch(`/api/contact`);
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const fetchedContacts = await response.json();

        const updatedContacts = await Promise.all(
          fetchedContacts.map(async (contact: Contact) => {
            const lastMessageResponse = await fetch(`/api/message?senderId=${contact.user_Id}&receiverId=${senderId}`);
            if (!lastMessageResponse.ok) {
              throw new Error("Failed to fetch last message");
            }
            const lastMessages = await lastMessageResponse.json();
            const lastMessage = lastMessages[lastMessages.length - 1];

            return {
              userId: contact.contactId,
              firstName: contact.firstName,
              imageUrl: contact.imageUrl,
              lastMessage: lastMessage ? lastMessage.text : "No messages yet",
              lastMessageDate: lastMessage ? lastMessage.createdAt : null,
            };
          })
        );

        setContacts(updatedContacts);
      } catch (error) {
        console.error("Error fetching contacts", error);
        toast.error(`Failed to fetch contacts: ${error}`, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchMessages();
    fetchContacts();
  }, [senderId, receiverId, router]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !receiverId) {
      return;
    }

    const senderFirstname = user?.firstName || "";
    const senderLastName = user?.lastName || "";
    const senderImageUrl = user?.imageUrl || "";

    try {
      const response = await fetch(`/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          text: messageText,
          senderFirstname,
          senderImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");

      // Check if the sender is already a contact of the receiver
      const contactExists = contacts.some(contact => contact.contactId === senderId);
      if (!contactExists) {
        // If not, add sender as a contact to the receiver
        const contactResponse = await fetch(`/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_Id: receiverId,
            contactId: senderId,
            firstName: senderFirstname,
            lastName: senderLastName,
            imageUrl: senderImageUrl,
          }),
        });

        if (!contactResponse.ok) {
          throw new Error("Failed to add contact");
        }

        // Optionally, you can fetch updated contacts here or update the state locally
        // const updatedContacts = await fetchContacts();
        // setContacts(updatedContacts);
      }
    } catch (error) {
      console.error("Error sending message", error);
      toast.error("Failed to send message", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
};


  return (
    <SignedIn>
      <div className="flex h-full">
        {/* Left Section - Contacts List */}
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search messages"
              className="w-full p-2 mb-4 border rounded-md"
            />
          </div>
          <ul>
            {loadingContacts ? (
              <div className="flex justify-center p-4">
                <Loader2 />
                <p>Loading</p>
              </div>
            ) : contacts.length > 0 ? (
              contacts.map((contact) => (
                <li
                  key={contact.user_Id}
                  className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
                    contact.user_Id === receiverId ? "bg-gray-200" : ""
                  }`}
                  onClick={() => router.push(`/message/${contact.user_Id}`)}
                >
                  <Image
                    src={contact.imageUrl || "/default-avatar.png"}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-medium">{contact.firstName}</p>
                    <p className="text-sm text-gray-500">{contact.lastMessage}</p>
                    {contact.lastMessageDate && (
                      <p className="text-xs text-gray-400">
                        {new Date(contact.lastMessageDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500">No contacts available.</li>
            )}
          </ul>
        </div>

        {/* Right Section - Conversation and Reply */}
        <div className="w-2/3 flex flex-col h-full">
          <div className="flex-grow p-4 overflow-y-auto">
            {loadingMessages ? (
              <div className="flex justify-center p-4">
                <Loader2 />
                <p>Loading Messages</p>
              </div>
            ) : receiverId ? (
              messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${message.senderId === senderId ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block p-4 rounded-lg ${
                        message.senderId === senderId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No messages to display.</div>
              )
            ) : (
              <div className="text-gray-500">Select a contact to view messages.</div>
            )}
          </div>

          {/* Reply Input */}
          {receiverId && senderId !== receiverId &&(
            <div className="p-4 border-t flex items-center">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message"
                className="flex-grow border p-2 rounded-l-md"
              />
              <Button onClick={handleSendMessage} className="rounded-r-md">
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
    </SignedIn>
  );
};

export default MessagePage;
