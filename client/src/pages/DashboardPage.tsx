import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import StreakTracker from "@/components/dashboard/StreakTracker";
import SessionInfoForm, { formSchema } from "@/components/interview/SessionInfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useInterviewStore from "@/store/interviewStore";
import { InterviewSession, JobRoleType } from "@/types/InterviewData";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import useProfileStore from "@/store/profileStore";

const roles = [
  {
    title: "Frontend Developer",
    skills: ["express", "react", "API handling"],
    description:
      "A Frontend Developer should be proficient in HTML, CSS, and JavaScript, along with frameworks.",
  },
  {
    title: "Backend Developer",
    skills: ["nodejs"],
    description:
      "A MERN Stack Developer must have expertise in MongoDB, Express.js, React, and Node.js, along with RESTful APIs.",
  },
  {
    title: "MERN Stack Developer",
    skills: ["react"],
    description:
      "A Java Developer should be skilled in Java, Spring Boot, Hibernate, and database management using SQL.",
  },
]

function DashboardPage() {

  const [interviewSessions, setInterviewSessions] = useState<null | InterviewSession[]>(null)
  const [isPending, setIsPending] = useState(true)
  const { profile, setProfile } = useProfileStore()

  const navigate = useNavigate()
  const { setCandidate } = useInterviewStore()

  const user = useUser().user

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isPending) setIsPending(true)

        if (!user || !user.primaryEmailAddress?.emailAddress) {
          throw new Error("No user found")
        }

        const email = user.primaryEmailAddress.emailAddress;
        const [sessionRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions/all/${email}`, {
            headers: { "Content-Type": "application/json" },
          }),
          axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/users/${email}`, {
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        if (!sessionRes.status || sessionRes.status !== 200) {
          throw new Error("Something went wrong")
        }
        setInterviewSessions(sessionRes.data.response)

        if (!userRes.status || userRes.status !== 201) {
          throw new Error("Something went wrong")
        }
        setProfile({ theme: profile.theme, ...userRes.data.data })

      } catch (error) {
        if (error instanceof AxiosError && error.status === 400) {
          navigate("/dashboard/user/form")
          toast({
            title: "Please fill out the form first",
          })
          return
        }
        toast({
          title: "Something went wrong",
          variant: "destructive"
        })
        console.log(error)
      } finally {
        setIsPending(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours();
  
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCandidate({
      id: user?.id || null,
      email: user?.primaryEmailAddress?.emailAddress || null,
      name: user?.username || null,
      yearsOfExperience: values.yearsOfExperience,
      jobRole: values.jobRole,
      skills: values.skills
    })
    navigate(`/interview/${Date.now()}`)
  }

  if(isPending){
    return <div className="h-full w-screen overflow-x-hidden py-12">
      <div className="w-1/2 mx-auto my-2 py-2 rounded-xl bg-gradient-to-r to-blue-700 from-purple-800 dark:to-blue-700 dark:from-purple-800 flex justify-center items-center">
        <p className="text-zinc-300 dark:text-zinc-300 font-semibold">Loading...</p>
      </div>
    </div>
  }

  return (
    <div className="h-full w-screen overflow-x-hidden py-12 space-y-6">
      <div className="w-1/2 mx-auto my-2 py-2 rounded-xl bg-gradient-to-r to-blue-700 from-purple-800 flex justify-center items-center">
        <p className="text-zinc-300 font-semibold">{getGreeting()} {user?.firstName}, Welcome Back to your Dashboard</p>
      </div>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {roles.map((role, index) => (
            <Card
              key={index}
              className="dark:bg-zinc-800 dark:text-neutral-300 p-6 cursor-pointer transition duration-300 shadow-md hover:scale-[103%] hover:shadow-lg bg-white hover:bg-neutral-100 dark:hover:bg-zinc-700/70"
              onClick={() => onSubmit({ yearsOfExperience: 0, jobRole: role.title as JobRoleType, skills: [...role.skills] as [string, ...string[]] })}
            >
              <CardHeader className="py-1 px-0">
                <CardTitle className="text-2xl font-medium">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 dark:text-gray-400 text-sm">{role.description}</p>
              </CardContent>
            </Card>
          ))}
          <SessionInfoForm />
        </div>
        <h1 className="text-3xl font-bold mb-4 mt-16 rounded-xl py-1 h-15 w-fit text-left transition duration-300">
          Daily stats
        </h1>
        <div className="flex justify-between">
          <DataVisualization />
          {(interviewSessions && interviewSessions.length) ? <StreakTracker interviewSessions={interviewSessions} /> : <div className="space-y-2 pt-4">
            <div className="w-7/12 max-w-sm mx-auto p-4 text-center bg-zinc-200 dark:bg-zinc-800 ml-2"></div>
          </div>
          }
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
