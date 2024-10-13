export interface CVData {
    userId: string;
    education: Education[];
    workExperience: WorkExperience[];
    services: Service[];
    careerBreak: CareerBreak[];
    skills: Skill[];
  }
  
  export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
    _id?: string;
  }
  
  export interface WorkExperience {
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    _id?: string;
  }
  
  export interface Service {
    title: string;
    description: string;
    _id?: string;
  }
  
  export interface CareerBreak {
    reason: string;
    startDate: string;
    endDate: string;
    _id?: string;
  }
  
  export interface Skill {
    name: string;
    proficiency: "Beginner" | "Intermediate" | "Advanced";
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  