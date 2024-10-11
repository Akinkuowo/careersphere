"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const CVViewer: React.FC = () => {
    const { user } = useUser();
    
    const userId = user?.id
    
    const [cvData, setCvData] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      const fetchCV = async () => {
        try {
          const response = await fetch(`/api/cv?userId=${userId}`);
          const data = await response.json();

          if (response.ok && data) {
            setCvData(data); // Set CV data if found
          } else {
            console.error(data.message || "Failed to fetch CV data");
          }
        } catch (error) {
          console.error("Failed to fetch CV data:", error);
        }
      };
      fetchCV();
    }
  }, [userId]);

  if (!cvData) {
    return <div className="text-center">Loading CV data...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center"></h1>
      

      <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
      <div className="mb-4 border rounded bg-gray-100 p-5">
            <div className="flex items-center">
                <p className="font-semibold text-blue-400 mr-5">First Name: </p>
                <p className="text-2xl mb-2"> {user?.firstName}</p>
            </div>

            <div className="flex items-center">
                <p className="font-semibold text-blue-400 mr-5">Last Name: </p>
                <p className="text-2xl mb-2"> {user?.lastName}</p>
            </div>
            {/* <p>{edu.institution}</p>
            <p>{edu.startDate} - {edu.endDate}</p>
            <p>{edu.description}</p> */}
     </div>


      {/* Education Section */}
      <h2 className="text-xl font-semibold mb-2">Education</h2>
      {cvData.education && cvData.education.length > 0 ? (
        cvData.education.map((edu: any, index: number) => (
          <div key={index} className="mb-4 p-5 border rounded bg-gray-100">
                <p className="font-bold text-2xl mb-2"> {edu.institution}</p>
                <p className="font-bold">{edu.degree}, {edu.fieldOfStudy}</p>
                <p className="text-blue-400">
                    {new Date(edu.startDate).toISOString().split('T')[0]} - {new Date(edu.endDate).toISOString().split('T')[0]}
                </p>

            
            {/* 
            <p>{edu.description}</p> */}
          </div>
        ))
      ) : (
        <p>No education data available.</p>
      )}

      {/* Work Experience Section */}
      <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
      {cvData.workExperience && cvData.workExperience.length > 0 ? (
        cvData.workExperience.map((work: any, index: number) => (
          <div key={index} className="mb-4 p-5 border rounded bg-gray-100">
                <p className="font-bold text-2xl mb-2"> {work.company}</p>
                <p className="font-bold">{work.position}</p>
                <p className="text-blue-400">
                    {new Date(work.startDate).toISOString().split('T')[0]} - {new Date(work.endDate).toISOString().split('T')[0]}
                </p>
          </div>
        ))
      ) : (
        <p>No work experience data available.</p>
      )}

      {/* Services Section */}
      <h2 className="text-xl font-semibold mb-2">Services</h2>
      {cvData.services && cvData.services.length > 0 ? (
        cvData.services.map((service: any, index: number) => (
          <div key={index} className="mb-4 p-5 border rounded bg-gray-100">
             <p className="font-bold text-2xl mb-2"> {service.title}</p>
             <p className="font-bold">{service.description}</p>
          </div>
        ))
      ) : (
        <p>No service data available.</p>
      )}

      {/* Career Break Section */}
      <h2 className="text-xl font-semibold mb-2">Career Break</h2>
      {cvData.careerBreak && cvData.careerBreak.length > 0 ? (
        cvData.careerBreak.map((breakDetail: any, index: number) => (
          <div key={index} className="mb-4 p-2 border rounded bg-gray-100">
            <p className="font-bold">Reason: {breakDetail.reason}</p>
            {/* <p>{breakDetail.startDate} - {breakDetail.endDate}</p> */}
          </div>
        ))
      ) : (
        <p>No career break data available.</p>
      )}

      {/* Skills Section */}
      <h2 className="text-xl font-semibold mb-2">Skills</h2>
      {cvData.skills && cvData.skills.length > 0 ? (
        <ul className="list-disc list-inside">
          {cvData.skills.map((skill: any, index: number) => (
            <li key={index}>
              {skill.name} - {skill.proficiency}
            </li>
          ))}
        </ul>
      ) : (
        <p>No skills data available.</p>
      )}
    </div>
  );
};

export default CVViewer;
