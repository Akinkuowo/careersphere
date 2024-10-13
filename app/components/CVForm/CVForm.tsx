"use client";

import { CVData, Education, WorkExperience, Service, CareerBreak, Skill } from "@/types/CVData";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CVFormProps {
  initialData: CVData | null;
  onSubmit: (data: CVData) => void;
}

const CVForm: React.FC<CVFormProps> = ({ initialData, onSubmit }) => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCareerBreakOpen, setIsCareerBreakOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  const [education, setEducation] = useState<Education>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [position, setPosition] = useState<WorkExperience>({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [services, setServices] = useState<Service>({
    title: "",
    description: "",
  });

  const [careerBreak, setCareerBreak] = useState<CareerBreak>({
    reason: "",
    startDate: "",
    endDate: "",
  });

  const [skills, setSkills] = useState<Skill[]>([{ name: "", proficiency: "Beginner" }]);

  // Set initial data if provided
  useEffect(() => {
    if (initialData) {
      setEducation(initialData.education[0] || {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setPosition(initialData.workExperience[0] || {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setServices(initialData.services[0] || { title: "", description: "" });
      setCareerBreak(initialData.careerBreak[0] || { reason: "", startDate: "", endDate: "" });
      setSkills(initialData.skills || [{ name: "", proficiency: "Beginner" }]);
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string) => {
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

  const handleSkillChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newSkills = [...skills];

    if (name === "proficiency") {
      newSkills[index].proficiency = value as Skill["proficiency"];
    } else {
      newSkills[index].name = value;
    }

    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { name: "", proficiency: "Beginner" }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !education.institution ||
      !education.degree ||
      !education.fieldOfStudy ||
      !education.startDate ||
      !position.position ||
      !position.company ||
      !position.startDate ||
      !services.title ||
      !services.description ||
      !careerBreak.reason ||
      !careerBreak.startDate ||
      skills.some(skill => !skill.name || !skill.proficiency)
    ) {
      toast.error("Please fill in all required fields.", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
      return;
    }

    const cvPayload: CVData = {
      userId: "placeholder_user_id",  // replace with actual userId
      education: [education],
      workExperience: [position],
      services: [services],
      careerBreak: [careerBreak],
      skills,
    };

    onSubmit(cvPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Add to Profile</h1>
    <p className="text-gray-500 mb-4">Set up your profile in minutes with a resume</p>
    <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4">Get Started</button>
    <h2 className="font-bold mb-2">Manual Setup</h2>

    {/* Education Section */}
    <div className="mb-4">
      <button type="button" onClick={() => toggleDropdown("education")} className="w-full bg-gray-200 py-2 rounded-md">
        Education
      </button>
      {isEducationOpen && (
        <div className="p-4 bg-gray-100 rounded-md">
          <input
            type="text"
            name="institution"
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
            onFocus={(e) => (e.target.type = 'date')} 
            onBlur={(e) => (e.target.type = 'text')}
            onChange={(e) => handleChange(e, "education")}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="endDate"
            placeholder="End Date"
            value={education.endDate}
            onFocus={(e) => (e.target.type = 'date')} 
            onBlur={(e) => (e.target.type = 'text')}
            onChange={(e) => handleChange(e, "education")}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={education.description}
            onChange={(e) => handleChange(e, "education")}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>
      )}
    </div>

    {/* Work Experience Section */}
    <div className="mb-4">
      <button type="button" onClick={() => toggleDropdown("position")} className="w-full bg-gray-200 py-2 rounded-md">
        Work Experience
      </button>
      {isPositionOpen && (
        <div className="p-4 bg-gray-100 rounded-md">
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={position.position}
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
            name="startDate"
            placeholder="Start Date"
            value={position.startDate}
            onFocus={(e) => (e.target.type = 'date')} 
            onBlur={(e) => (e.target.type = 'text')}
            onChange={(e) => handleChange(e, "position")}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="endDate"
            placeholder="End Date"
            value={position.endDate}
            onFocus={(e) => (e.target.type = 'date')} 
            onBlur={(e) => (e.target.type = 'text')}
            onChange={(e) => handleChange(e, "position")}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={position.description}
            onChange={(e) => handleChange(e, "position")}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>
      )}
    </div>

    {/* Services Section */}
    <div className="mb-4">
      <button type="button" onClick={() => toggleDropdown("services")} className="w-full bg-gray-200 py-2 rounded-md">
        Services
      </button>
      {isServicesOpen && (
        <div className="p-4 bg-gray-100 rounded-md">
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={services.title}
            onChange={(e) => handleChange(e, "services")}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Service Description"
            value={services.description}
            onChange={(e) => handleChange(e, "services")}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>
      )}
    </div>

    {/* Career Break Section */}
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
            name="startDate"
            placeholder="Start Date"
            value={careerBreak.startDate}
            onFocus={(e) => (e.target.type = 'date')} 
            onBlur={(e) => (e.target.type = 'text')}
            onChange={(e) => handleChange(e, "careerBreak")}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="endDate"
            placeholder="End Date"
            value={careerBreak.endDate}
            onFocus={(e) => (e.target.type = 'date')} 
            onBlur={(e) => (e.target.type = 'text')}
            onChange={(e) => handleChange(e, "careerBreak")}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>
      )}
    </div>

    {/* Skills Section */}
    <div className="mb-4">
      <button type="button" onClick={() => toggleDropdown("skills")} className="w-full bg-gray-200 py-2 rounded-md">
        Skills
      </button>
      {isSkillsOpen && (
        <div className="p-4 bg-gray-100 rounded-md">
          {skills.map((skill, index) => (
            <div key={index} className={`flex mb-2 ${skill.name}`}>
              <input
                type="text"
                name="name"
                placeholder="Skill"
                value={skill.name}
                onChange={(e) => handleSkillChange(e, index)}
                className="w-1/2 p-2 border rounded mr-2"
              />
              <select
                  name="proficiency"
                  value={skill.proficiency}
                  onChange={(e) => handleSkillChange(e, index)}
                  className="w-1/2 p-2 border rounded"
              >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
              </select>
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
