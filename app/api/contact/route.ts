import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/mongodb/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Contact, Message } from "@/mongodb/models/post"; 

// Fetch contact list for the authenticated user
export async function GET() {
  try {
    // Authenticate user
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDb();

    // Fetch contacts from both messages and the Contact collection
    const messageContacts = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
      },
      {
        $group: {
          _id: null,
          contacts: {
            $addToSet: {
              $cond: [
                { $eq: ["$senderId", userId] },
                "$receiverId",
                "$senderId",
              ],
            },
          },
        },
      },
      {
        $unwind: "$contacts",
      },
      {
        $project: { _id: 0, contactId: "$contacts" },
      },
    ]);

    // Fetch contacts from the Contact collection
    const contactDocs = await Contact.find({ userId }).select("contactId firstName lastName imageUrl");

    // Merge contacts from messages and contacts collection
    const uniqueContactsSet = new Set([...messageContacts.map(c => c.contactId), ...contactDocs.map(c => c.contactId)]);
    const contactIds = Array.from(uniqueContactsSet); // Convert Set to Array

    // Fetch detailed information from Contact collection
    const contacts = await Contact.find({ contactId: { $in: contactIds } }).select("contactId firstName lastName imageUrl");

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch contacts", error);
    return NextResponse.json(
      { message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId: contactId, firstName, lastName, imageUrl } = await request.json();

    if (!contactId) {
      return NextResponse.json({ message: "Invalid contact data" }, { status: 400 });
    }

    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // Connect to the database
    await connectDb();

    // Create or update the contact for the current user
    const existingContact = await Contact.findOne({ userId, contactId });
    if (!existingContact) {
      await Contact.create({
        userId,
        contactId,
        firstName,
        lastName,
        imageUrl,
      });
    }

    // Create or update the contact for the other user (reverse contact)
    const existingReverseContact = await Contact.findOne({ userId: contactId, contactId: userId });
    if (!existingReverseContact) {
      await Contact.create({
        userId: contactId,
        contactId: userId,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        imageUrl: user?.imageUrl || "",
      });
    }

    return NextResponse.json({ message: "Contacts added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to add contact", error);
    return NextResponse.json(
      { message: "Failed to add contact" },
      { status: 500 }
    );
  }
}
