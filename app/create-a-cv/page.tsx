"use client";

import { useAuth } from "@clerk/nextjs";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Define the types for the props and state
interface Skill {
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced"; // Enum values
}

interface CVData {
  education: string[];
  workExperience: string[];
  services: string[];
  careerBreak: string[];
  skills: Skill[];
}

interface CVFormProps {
  setCvData: (data: CVData) => void;
}

const CVForm: React.FC<CVFormProps> = ({ setCvData }) => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCareerBreakOpen, setIsCareerBreakOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  const { userId } = useAuth();
  const [cvData, setCvDataLocal] = useState<CVData | null>(null);

  const [education, setEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [position, setPosition] = useState({
    position: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [services, setServices] = useState({
    title: "",
    description: "",
  });

  const [careerBreak, setCareerBreak] = useState({
    reason: "",
    startDate: "",
    endDate: "",
  });

  const [skills, setSkills] = useState<Skill[]>([{ name: "", proficiency: "Beginner" }]);

  useEffect(() => {
    if (userId) {
      const fetchCV = async () => {
        try {
          const response = await fetch(`/api/cv?userId=${userId}`);
          const data = await response.json();

          if (response.ok && data) {
            setCvDataLocal(data);
            // Initialize state with fetched data or empty object
            setEducation(data.education[0] || { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" });
            setPosition(data.workExperience[0] || { position: "", company: "", startDate: "", endDate: "", description: "" });
            setServices(data.services[0] || { title: "", description: "" });
            setCareerBreak(data.careerBreak[0] || { reason: "", startDate: "", endDate: "" });
            setSkills(data.skills || [{ name: "", proficiency: "Beginner" }]);
          } else {
            toast.error(data.message || "Failed to fetch CV data", {
              style: { borderRadius: "10px", background: "#333", color: "#fff" },
            });
          }
        } catch (error) {
          console.error("Failed to fetch CV data:", error);
          toast.error("Failed to fetch CV data", {
            style: { borderRadius: "10px", background: "#333", color: "#fff" },
          });
        }
      };
      fetchCV();
    }
  }, [userId]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form...");

    // Validate all required fields
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

    const cvPayload = {
      userId,
      education: [education],
      workExperience: [position],
      services: [services],
      careerBreak: [careerBreak],
      skills,
    };

    try {
      const method = cvData ? 'PUT' : 'POST'; // Use PUT if CV exists
      const response = await fetch('/api/cv', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvPayload),
      });

      if (response.ok) {
        const data = await response.json();
        setCvData(data.cv); // Update parent state with the CV object
        setCvDataLocal(data.cv); // Update local state
        toast.success("CV saved successfully!", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save CV", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Error saving CV", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Education Section */}
      <div>
        <h2 onClick={() => toggleDropdown("education")}>Education</h2>
        {isEducationOpen && (
          <div>
            <input name="institution" value={education.institution} onChange={(e) => handleChange(e, "education")} placeholder="Institution" required />
            <input name="degree" value={education.degree} onChange={(e) => handleChange(e, "education")} placeholder="Degree" required />
            <input name="fieldOfStudy" value={education.fieldOfStudy} onChange={(e) => handleChange(e, "education")} placeholder="Field of Study" required />
            <input name="startDate" value={education.startDate} onChange={(e) => handleChange(e, "education")} placeholder="Start Date" required />
            <input name="endDate" value={education.endDate} onChange={(e) => handleChange(e, "education")} placeholder="End Date" />
            <textarea name="description" value={education.description} onChange={(e) => handleChange(e, "education")} placeholder="Description"></textarea>
          </div>
        )}
      </div>

      {/* Work Experience Section */}
      <div>
        <h2 onClick={() => toggleDropdown("position")}>Work Experience</h2>
        {isPositionOpen && (
          <div>
            <input name="position" value={position.position} onChange={(e) => handleChange(e, "position")} placeholder="Position" required />
            <input name="company" value={position.company} onChange={(e) => handleChange(e, "position")} placeholder="Company" required />
            <input name="startDate" value={position.startDate} onChange={(e) => handleChange(e, "position")} placeholder="Start Date" required />
            <input name="endDate" value={position.endDate} onChange={(e) => handleChange(e, "position")} placeholder="End Date" />
            <textarea name="description" value={position.description} onChange={(e) => handleChange(e, "position")} placeholder="Description"></textarea>
          </div>
        )}
      </div>

      {/* Services Section */}
      <div>
        <h2 onClick={() => toggleDropdown("services")}>Services</h2>
        {isServicesOpen && (
          <div>
            <input name="title" value={services.title} onChange={(e) => handleChange(e, "services")} placeholder="Service Title" required />
            <textarea name="description" value={services.description} onChange={(e) => handleChange(e, "services")} placeholder="Service Description" required></textarea>
          </div>
        )}
      </div>

      {/* Career Break Section */}
      <div>
        <h2 onClick={() => toggleDropdown("careerBreak")}>Career Break</h2>
        {isCareerBreakOpen && (
          <div>
            <input name="reason" value={careerBreak.reason} onChange={(e) => handleChange(e, "careerBreak")} placeholder="Reason" required />
            <input name="startDate" value={careerBreak.startDate} onChange={(e) => handleChange(e, "careerBreak")} placeholder="Start Date" required />
            <input name="endDate" value={careerBreak.endDate} onChange={(e) => handleChange(e, "careerBreak")} placeholder="End Date" />
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div>
        <h2 onClick={() => toggleDropdown("skills")}>Skills</h2>
        {isSkillsOpen && (
          <div>
            {skills.map((skill, index) => (
              <div key={index}>
                <input
                  name="name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(e, index)}
                  placeholder="Skill Name"
                  required
                />
                <select
                  name="proficiency"
                  value={skill.proficiency}
                  onChange={(e) => handleSkillChange(e, index)}
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button type="button" onClick={() => removeSkill(index)}>Remove Skill</button>
              </div>
            ))}
            <button type="button" onClick={addSkill}>Add Skill</button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit">Save CV</button>
    </form>
  );
};

export default CVForm;
