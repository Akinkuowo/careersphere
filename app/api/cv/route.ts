// app/api/cv/route.ts

import connectDb from '@/mongodb/db';
import { NextRequest, NextResponse } from 'next/server';
import { CV, ICVDocument } from '@/mongodb/models/post'; // Adjust this path as necessary

interface ICVRequestBody extends Partial<ICVDocument> {
  // Removed cvId; use userId instead
}

export async function POST(req: NextRequest) {
  await connectDb(); // Ensure the database connection is established

  try {
    const cvData: ICVRequestBody = await req.json(); // Parse the request body

    const { userId, education, workExperience, services, careerBreak, skills } = cvData;

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    // Check if a CV already exists for this user
    const existingCV = await CV.findOne({ userId });
    if (existingCV) {
      return NextResponse.json({ message: 'CV already exists for this user. Use PUT to update.' }, { status: 400 });
    }

    // Create a new CV instance
    const newCV = new CV({
      userId,
      education,
      workExperience,
      services,
      careerBreak,
      skills,
    });

    await newCV.save(); // Save the new CV to the database

    return NextResponse.json({ message: 'CV created successfully', cv: newCV }, { status: 201 });
  } catch (error) {
    console.error('Error creating CV:', error);
    return NextResponse.json({ message: 'Error creating CV' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDb(); // Ensure the database connection is established

  try {
    const cvData: ICVRequestBody = await req.json(); // Parse the request body

    const { userId, education, workExperience, services, careerBreak, skills } = cvData;

    if (!userId) {
      return NextResponse.json({ message: 'userId is required for update' }, { status: 400 });
    }

    // Find the existing CV by userId
    const existingCV = await CV.findOne({ userId });
    if (!existingCV) {
      return NextResponse.json({ message: 'CV not found' }, { status: 404 });
    }

    // Update the existing CV fields
    existingCV.education = education || existingCV.education;
    existingCV.workExperience = workExperience || existingCV.workExperience;
    existingCV.services = services || existingCV.services;
    existingCV.careerBreak = careerBreak || existingCV.careerBreak;
    existingCV.skills = skills || existingCV.skills;

    await existingCV.save(); // Save the updated CV

    return NextResponse.json({ message: 'CV updated successfully', cv: existingCV });
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

    const cv = await CV.findOne({ userId }); // Fetch the CV by userId
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
