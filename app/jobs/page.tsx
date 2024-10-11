import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import connectDb from '@/mongodb/db';
import { Job } from '@/mongodb/models/post';
import { SignedIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const JobsPage = async () => {
  const user = await currentUser();

  // Connect to the database
  await connectDb();

  // Fetch all jobs from the database
  let jobs: any[] = [];
  let fetchError = null; // Variable to track fetch error

  try {
    jobs = await Job.getAllJobs();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    fetchError = error; // Store error for display
  }

  return (
    <div className="container mx-auto p-4">
      {/* Sidebar and Main Content Wrapper */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside>
          <div className="w-full md:w-3/4 p-4 bg-white shadow-md rounded-md mb-6 md:mb-5">
            {/* User Profile */}
            <div className="flex items-center space-x-4 mb-6 text-center">
              <div>
                <div className="text-center py-5">
                  <Avatar className="w-20 h-20 mx-auto">
                    {user?.id ? (
                      <AvatarImage src={user?.imageUrl} />
                    ) : (
                      <AvatarImage src="https://github.com/shadcn.png" />
                    )}
                    <AvatarFallback>
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <SignedIn>
                  <div>
                    <h2 className="text-xl font-bold">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-gray-500">A freelance full stack web developer and graphic designer</p>
                    <p className="text-sm text-gray-400">Nigeria</p>
                    <p className="text-sm text-gray-400">Self-employed</p>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4 p-4 bg-white shadow-md rounded-md mb-6 md:mb-0">
            {/* Links */}
            <nav className="flex flex-col space-y-4">
              <Link href="/find-jobs/" className="flex text-gray-400 hover:text-sky-500">
                <Briefcase className="h-5 mr-2" />
                <p>Find Jobs With AI</p>
              </Link>
              <Link href="/my-jobs" className="flex text-gray-400 hover:text-sky-500">
                <Briefcase className="h-5 mr-2" />
                <p>My Jobs</p>
              </Link>
              <Link href="/career-insights" className="flex text-gray-400 hover:text-sky-500">
                <Briefcase className="h-5 mr-2" />
                <p>My Career Insights</p>
              </Link>
            </nav>

            {/* Post a Free Job Button */}
            <div className="mt-6">
              <Link href="/post-a-job/" className="w-full p-2 bg-blue-600 text-white rounded-md">
                Post a free job
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-6 p-4 bg-white shadow-md rounded-md">
          {/* Hiring Section */}
          <div className="bg-gray-100 p-6 rounded-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Hi {user?.firstName}, are you hiring?</h2>
            <p>Post a Job for free</p>
            <div className="mt-4 space-x-4">
              <button className="bg-blue-600 text-white p-2 rounded-md">Yes, I’m hiring</button>
            </div>
          </div>

          {/* Job Picks Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Job picks for you</h2>
            {fetchError ? (
              <p className="text-red-500">Error fetching jobs</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id.toString()} className="bg-white shadow-md p-4 rounded-md mb-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={job.companyImageUrl || '/default-job-logo.png'} // Fallback image
                      alt={`${job.companyName} Logo`}
                      width={48}
                      height={48}
                      className="rounded-md"
                    />
                    <div className="flex-1">
                      <Link href={`/jobs/${job._id.toString()}/`}>
                        <h3 className="text-lg font-bold text-blue-600">
                          {job.title} - {job.employmentType}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">{job.companyName}</p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                      <p className="text-sm text-gray-500">{job.salaryRange || 'Salary not provided'}</p>
                    </div>
                    <button className="text-gray-400 hover:text-red-600">&times;</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No jobs available at the moment.</p>
            )}
          </div>
        </main>
      </div>

      {/* Footer Section */}
      {/* <footer className="mt-6 text-center text-gray-500">
        <div className="text-sm mb-4">
          <p>About · Accessibility · Help Center</p>
          <p>Privacy & Terms · Ad Choices · Advertising · Business Services</p>
          <p>Get the LinkedIn app · More</p>
        </div>
        <p>LinkedIn Corporation © 2024</p>
      </footer> */}
    </div>
  );
};

export default JobsPage;
