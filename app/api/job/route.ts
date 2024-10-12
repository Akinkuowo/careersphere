import { NextResponse, NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import connectDb from '@/mongodb/db';
import { Job } from '@/mongodb/models/post';
import { getAuth } from '@clerk/nextjs/server';

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const jobTitle = formData.get('jobTitle')?.toString();
    const companyName = formData.get('companyName')?.toString();
    const companyImage = formData.get('companyImage') as File; // Cast as File
    const jobLocation = formData.get('jobLocation')?.toString();
    const salaryRange = formData.get('salaryRange')?.toString();
    const employmentType = formData.get('employmentType')?.toString();
    const description = formData.get('description')?.toString();
    const requirements = formData.get('requirements')?.toString().split(',');

    // Check for missing required fields
    if (!jobTitle || !companyName || !jobLocation || !description || !companyImage) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Authenticate the user and get the user ID from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let companyImageUrl: string | undefined;

    if (companyImage && companyImage.size > 0) {
      // Ensure it's an image MIME type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(companyImage.type)) {
        return NextResponse.json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' }, { status: 400 });
      }

      // Ensure file size is within acceptable limits (e.g., 5MB max)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (companyImage.size > MAX_FILE_SIZE) {
        return NextResponse.json({ message: 'File size too large. Maximum size allowed is 5MB.' }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), 'public', 'companyImage');

      // Create the upload directory if it doesn't exist
      await fs.mkdir(uploadDir, { recursive: true });

      // Create a unique file name
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
      const newFileName = `${uniqueSuffix}-${companyImage.name}`;
      const newFilePath = path.join(uploadDir, newFileName);

      // Save the file to the upload directory
      const buffer = Buffer.from(await companyImage.arrayBuffer());
      await fs.writeFile(newFilePath, buffer);

      // Set the relative image URL (public path)
      companyImageUrl = `/companyImage/${newFileName}`; // Corrected path
    }

    // Connect to the database
    await connectDb();

    // Create the job entry using the Job model
    const newJob = await Job.create({
      title: jobTitle,
      description,
      companyName,
      companyImageUrl, // Using the correct image URL
      location: jobLocation,
      salaryRange,
      employmentType,
      postedBy: userId, // Use the authenticated user ID as the postedBy field
      requirements,
    });

    return NextResponse.json({ message: 'Job posted successfully', jobId: newJob._id }, { status: 200 });
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json({ message: 'Failed to post job', error}, { status: 500 });
  }
}
