// app/create-a-cv/page.tsx

"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CVForm from "../components/CVForm/CVForm";
import { CVData } from "@/types/CVData";
import toast from "react-hot-toast";

const CreateCVPage: React.FC = () => {
  const { userId } = useAuth();
  const [cvData, setCvData] = useState<CVData | null>(null);

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const response = await fetch(`/api/cv/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch CV data");
        const data: CVData = await response.json();
        setCvData(data);
      } catch (error) {
        toast.error("Error fetching CV data: " + error.message);
      }
    };

    fetchCVData();
  }, [userId]);

  const handleSubmit = async (data: CVData) => {
    try {
      const response = await fetch(`/api/cv/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit CV data");

      toast.success("CV data submitted successfully!");
    } catch (error) {
      toast.error("Error submitting CV data: " + error.message);
    }
  };

  return (
    <div>
      <CVForm initialData={cvData} onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCVPage;
