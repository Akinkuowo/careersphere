"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const PostJob = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [workplaceType, setWorkplaceType] = useState('On-site');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [requirements, setRequirements] = useState('');
  const [companyImage, setCompanyImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();
  const { userId } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle || !companyName || !jobLocation || !jobDescription || !companyImage) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setLoading(true); // Set loading to true when form submission starts
    setErrorMessage('');

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append('jobTitle', jobTitle);
    formData.append('companyName', companyName);
    formData.append('jobLocation', jobLocation);
    formData.append('salaryRange', salaryRange);
    formData.append('employmentType', jobType);
    formData.append('description', jobDescription);
    formData.append('requirements', requirements);
    formData.append('companyImage', companyImage);
    formData.append('userId', userId!);

    try {
      const res = await fetch('/api/job', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.push('/jobs');
      } else {
        setErrorMessage('Error posting job.');
      }
    } catch (err) {
      setErrorMessage('Error posting job.');
    } finally {
      setLoading(false); // Set loading to false when submission is complete
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-gray-100 py-5">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Post a Job for Free</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Job Title</label>
            <input
              type="text"
              placeholder="Enter the title you are hiring for"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading} // Disable input when loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter the company's name"
              disabled={loading} // Disable input when loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Workplace Type</label>
            <select
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading} // Disable input when loading
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Job Location</label>
            <input
              type="text"
              placeholder="Enter job location"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading} // Disable input when loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading} // Disable input when loading
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Salary Range</label>
            <input
              type="text"
              placeholder="Enter salary range (optional)"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={loading} // Disable input when loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Job Description</label>
            <textarea
              placeholder="Enter job description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-2 border rounded h-24"
              disabled={loading} // Disable input when loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Requirements</label>
            <textarea
              placeholder="Enter job requirements (optional)"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full p-2 border rounded h-24"
              disabled={loading} // Disable input when loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Company Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCompanyImage(e.target.files ? e.target.files[0] : null)}
              className="w-full p-2 border rounded"
              disabled={loading} // Disable input when loading
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {loading && <p className="text-blue-500 text-sm">Posting job...</p>} {/* Show loading message */}

          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-4 rounded w-full ${loading ? 'opacity-50' : ''}`}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
