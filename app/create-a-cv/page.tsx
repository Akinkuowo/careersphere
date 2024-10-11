"use client";

import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Define the types for the props and state
interface Skill {
  name: string;
  proficiency: string;
}

interface CVFormProps {
  setCvData: (data: any) => void; // Update 'any' to a more specific type if possible
}

const CVForm: React.FC<CVFormProps> = ({ setCvData }) => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCareerBreakOpen, setIsCareerBreakOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  const { userId } = useAuth();
  
  const [cvData, setCvDataLocal] = useState<any>(null);
  console.log(cvData);

  const [education, setEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  });

  const [position, setPosition] = useState({
    jobTitle: "",
    jobType: "",
    company: "",
    years: "",
  });

  const [services, setServices] = useState({
    serviceOffered: "",
    duration: "",
  });

  const [careerBreak, setCareerBreak] = useState({
    reason: "",
    duration: "",
  });

  const [skills, setSkills] = useState<Skill[]>([{ name: "", proficiency: "" }]);

  useEffect(() => {
    if (userId) {
      const fetchCV = async () => {
        try {
          const response = await fetch(`/api/cv?userId=${userId}`);
          const data = await response.json();
          if (data) {
            setCvDataLocal(data);
            setEducation(data.education || {});
            setPosition(data.position || {});
            setServices(data.services || {});
            setCareerBreak(data.careerBreak || {});
            setSkills(data.skills || [{ name: "", proficiency: "" }]);
          }
        } catch (error) {
          console.error("Failed to fetch CV data:", error);
          toast.error("Failed to fetch CV data", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      };
      fetchCV();
    }
  }, [userId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, section: string) => {
    const { name, value } = e.target;
    switch (section) {
      case "education":
        setEducation((prev) => ({ ...prev, [name]: value }));
        break;
      case "position":
        setPosition((prev) => ({ ...prev, [name]: value }));
        break;
      case "services":
        setServices((prev) => ({ ...prev, [name]: value }));
        break;
      case "careerBreak":
        setCareerBreak((prev) => ({ ...prev, [name]: value }));
        break;
      default:
        break;
    }
  };

  const toggleDropdown = (dropdown: string) => {
    switch (dropdown) {
      case "education":
        setIsEducationOpen(!isEducationOpen);
        break;
      case "position":
        setIsPositionOpen(!isPositionOpen);
        break;
      case "services":
        setIsServicesOpen(!isServicesOpen);
        break;
      case "careerBreak":
        setIsCareerBreakOpen(!isCareerBreakOpen);
        break;
      case "skills":
        setIsSkillsOpen(!isSkillsOpen);
        break;
      default:
        break;
    }
  };

  const handleSkillChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newSkills = [...skills];
    newSkills[index][name as keyof Skill] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { name: "", proficiency: "" }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (
      !education.institution ||
      !position.jobTitle ||
      !services.serviceOffered ||
      skills.some(skill => !skill.name || !skill.proficiency)
    ) {
      toast.error("Please fill in all required fields.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const cvPayload = {
      cvId: userId,
      education: [education],
      workExperience: [position],
      services: [services],
      careerBreak: [careerBreak],
      skills,
    };

    try {
      const response = await fetch('/api/cv', {
        method: cvData === null ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvPayload),
      });

      if (response.ok) {
        const data = await response.json();
        setCvData(data);
        toast.success("CV saved successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        toast.error("Error saving CV", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Error saving CV", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add to Profile</h1>
      <p className="text-gray-500 mb-4">Set up your profile in minutes with a resume</p>
      <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4">Get Started</button>
      <h2 className="font-bold mb-2">Manual Setup</h2>

      <div className="mb-4">
        <button type="button" onClick={() => toggleDropdown("education")} className="w-full bg-gray-200 py-2 rounded-md">
          Education
        </button>
        {isEducationOpen && (
          <div className="p-4 bg-gray-100 rounded-md">
            <input
              type="text"
              name="institution" // Use institution instead of school
              placeholder="Institution"
              value={education.institution}
              onChange={(e) => handleChange(e, "education")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree"
              value={education.degree}
              onChange={(e) => handleChange(e, "education")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="fieldOfStudy"
              placeholder="Field of Study"
              value={education.fieldOfStudy}
              onChange={(e) => handleChange(e, "education")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="startDate"
              placeholder="Start Date"
              value={education.startDate}
              onChange={(e) => handleChange(e, "education")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="endDate"
              placeholder="End Date"
              value={education.endDate}
              onChange={(e) => handleChange(e, "education")}
              className="w-full mb-2 p-2 border rounded"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <button type="button" onClick={() => toggleDropdown("position")} className="w-full bg-gray-200 py-2 rounded-md">
          Work Experience
        </button>
        {isPositionOpen && (
          <div className="p-4 bg-gray-100 rounded-md">
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              value={position.jobTitle}
              onChange={(e) => handleChange(e, "position")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="jobType"
              placeholder="Job Type"
              value={position.jobType}
              onChange={(e) => handleChange(e, "position")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={position.company}
              onChange={(e) => handleChange(e, "position")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="years"
              placeholder="Years"
              value={position.years}
              onChange={(e) => handleChange(e, "position")}
              className="w-full mb-2 p-2 border rounded"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <button type="button" onClick={() => toggleDropdown("services")} className="w-full bg-gray-200 py-2 rounded-md">
          Services
        </button>
        {isServicesOpen && (
          <div className="p-4 bg-gray-100 rounded-md">
            <input
              type="text"
              name="serviceOffered"
              placeholder="Service Offered"
              value={services.serviceOffered}
              onChange={(e) => handleChange(e, "services")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={services.duration}
              onChange={(e) => handleChange(e, "services")}
              className="w-full mb-2 p-2 border rounded"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <button type="button" onClick={() => toggleDropdown("careerBreak")} className="w-full bg-gray-200 py-2 rounded-md">
          Career Break
        </button>
        {isCareerBreakOpen && (
          <div className="p-4 bg-gray-100 rounded-md">
            <input
              type="text"
              name="reason"
              placeholder="Reason"
              value={careerBreak.reason}
              onChange={(e) => handleChange(e, "careerBreak")}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={careerBreak.duration}
              onChange={(e) => handleChange(e, "careerBreak")}
              className="w-full mb-2 p-2 border rounded"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <button type="button" onClick={() => toggleDropdown("skills")} className="w-full bg-gray-200 py-2 rounded-md">
          Skills
        </button>
        {isSkillsOpen && (
          <div className="p-4 bg-gray-100 rounded-md">
            {skills.map((skill, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Skill"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(e, index)}
                  className="w-1/2 p-2 border rounded mr-2"
                />
                <input
                  type="text"
                  name="proficiency"
                  placeholder="Proficiency"
                  value={skill.proficiency}
                  onChange={(e) => handleSkillChange(e, index)}
                  className="w-1/2 p-2 border rounded"
                />
                <button type="button" onClick={() => removeSkill(index)} className="ml-2 text-red-500">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addSkill} className="mt-2 bg-green-500 text-white py-2 px-4 rounded-md">
              Add Skill
            </button>
          </div>
        )}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
        Submit
      </button>
    </form>
  );
};

export default CVForm;
