import AnalysisComponent from "@/pages/Analysis";
import React, { useEffect, useState } from "react";
import Certificate from "../components/dashboard/Certificate";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import useSocketStore from "@/store/socketStore";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { InterviewSession } from "@/types/InterviewData";
import { Loader2 } from "lucide-react";
import { IoMdArrowBack } from "react-icons/io";

const AnalyticsPage: React.FC = () => {

  const { socketId } = useSocketStore()
  const user = useUser().user

  const [analyticsData, setAnalyticsData] = useState<null | InterviewSession>(null)
  // const [fetchingAnalyticsData, setFetchingAnalyticsData] = useState(false)
  const [fetchingAnalyticsData, setFetchingAnalyticsData] = useState(true)

  const userData = {
    name: user?.firstName || "Not found",
    phone: user?.primaryPhoneNumber?.phoneNumber || user?.phoneNumbers[0]?.phoneNumber || "Not found",
    linkedin: "https://linkedin.com/in/johndoe",
    higherEducation: "Master's in Computer Science",
    jobRole: "Full Stack Developer",
    experience: 5,
    achievements: ["Best Developer Award", "Hackathon Winner", "Employee of the Year"],
    projects: ["E-commerce App", "AI Chatbot", "Portfolio Website"],
    goals: "Become a CTO in 5 years",
    skills: [
      { name: "Aptitude", level: 85 },
      { name: "System Design", level: 90 },
      { name: "Technical", level: 80 },
      { name: "Behavioral", level: 75 },
    ],
  };

  useEffect(() => {
    const fetchSessionData = async () => {

      if (!fetchingAnalyticsData) {
          setFetchingAnalyticsData(true)
      }

      if (!socketId) {
        toast({
          title: "Socket id not found",
          variant: "destructive"
        })
        return
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions//data/${socketId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (res.status !== 200) {
          toast({
            title: "Something went wrong while fetching analytics data",
            variant: "destructive"
          })
          return
        }

        setAnalyticsData(res.data.response)

      } catch (error) {
        toast({
          title: "Something went wrong while fetching analytics data",
          variant: "destructive"
        })
        console.log(error)
      } finally {
        setFetchingAnalyticsData(false)
      }

    }
    fetchSessionData()
  }, [])

  return (
    <div className="p-6">
      <Link to="/dashboard" className="text-3xl fixed top-8 left-8 h-12 w-12 flex justify-center items-center hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-full">
        <IoMdArrowBack />
      </Link>
      {fetchingAnalyticsData ?
        <div className="h-full w-full flex justify-center items-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        :
        <>
          <AnalysisComponent userData={userData} analyticsData={analyticsData} />
          <Certificate name={user?.fullName || "Not found"} role={"Mern stack"} score={85} />
        </>}
    </div>
  );
};

export default AnalyticsPage;
