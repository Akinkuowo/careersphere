// app/api/cv/route.ts
import connectDb from '@/mongodb/db';
import { NextRequest, NextResponse } from 'next/server';
import { CV, ICVDocument } from '@/mongodb/models/post'; // Adjust this path as necessary

interface ICVRequestBody extends Partial<ICVDocument> {
  cvId?: string; // Optional cvId for updates
}

export async function POST(req: NextRequest) {
  await connectDb(); // Ensure the database connection is established

  try {
    const cvData: ICVRequestBody = await req.json(); // Use req.json() to parse the request body

    // Validation can be added here if needed

    const newCV = new CV(cvData); // Create a new CV instance
    await newCV.save(); // Save the new CV to the database

    return NextResponse.json({ message: 'CV created successfully', cvId: newCV._id }, { status: 201 });
  } catch (error) {
    console.error('Error creating CV:', error);
    return NextResponse.json({ message: 'Error creating CV' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDb(); // Ensure the database connection is established

  try {
    const { cvId, ...cvData }: ICVRequestBody = await req.json(); // Expect cvId to be sent for the update

    console.log(cvId)
    // Validate cvId and data here if necessary
    if (!cvId) {
      return NextResponse.json({ message: 'cvId is required for update' }, { status: 400 });
    }

    const existingCV = await CV.findById(cvId); // Find the CV by ID
    if (!existingCV) {
      return NextResponse.json({ message: 'CV not found' }, { status: 404 });
    }

    // Use the addOrUpdateCV method to update the CV
    await existingCV.addOrUpdateCV(cvData);
    
    return NextResponse.json({ message: 'CV updated successfully' });
  } catch (error) {
    console.error('Error updating CV:', error);
    return NextResponse.json({ message: 'Error updating CV' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDb(); // Ensure the database connection is established

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // Expecting userId in the query

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const cv = await CV.getUserCV(userId); // Fetch the CV by userId
    if (cv) {
      return NextResponse.json(cv);
    } else {
      return NextResponse.json({ message: 'CV not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json({ message: 'Error fetching CV' }, { status: 500 });
  }
}
