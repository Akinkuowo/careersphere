import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "@/mongodb/db";
import { Contact, Message } from "@/mongodb/models/post"; // Make sure you import your Contact model

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const senderId = searchParams.get("senderId");
  const receiverId = searchParams.get("receiverId");

  await connectDb();

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Error fetching messages", error);
    return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDb();

  const { senderId, receiverId, text, senderFirstname, senderImageUrl, receiverFirstname, receiverImageUrl } = await req.json();

  try {
    // Check if the contact already exists
    const contactExists = await Contact.findOne({
      $or: [
        { userId: senderId, contactId: receiverId },
        { userId: receiverId, contactId: senderId },
      ],
    });

    // Create a contact if it doesn't exist
    if (!contactExists) {
      await Contact.create({
        userId: senderId,
        contactId: receiverId,
        senderFirstname, // Store sender's first name
        senderImageUrl,  // Store sender's image URL
        receiverFirstname, // Store receiver's first name
        receiverImageUrl, // Store receiver's image URL
      });
    }

    // Create the new message with additional fields
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      senderFirstname, // Store sender's first name
      senderImageUrl,  // Store sender's image URL
      receiverFirstname, // Store receiver's first name
      receiverImageUrl, // Store receiver's image URL
      createdAt: new Date(),
    });

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error("Error sending message", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
  }
}
