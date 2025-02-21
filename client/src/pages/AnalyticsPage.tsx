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

const mockInterviewSession: InterviewSession = {
    sessionId: "session_12345",
    candidate: {
      email: "jane.doe@example.com",
      name: "Jane Doe",
      jobRole: "Frontend Developer",
      skills: ["JavaScript", "React", "TypeScript", "CSS"],
      yearsOfExperience: 4,
    },
    questions: [
      {
        question: "Explain how the event loop works in JavaScript.",
        answer: "The event loop is a mechanism that handles asynchronous operations in JavaScript. It continuously checks the call stack and the task queue. If the stack is empty, it takes tasks from the queue and pushes them to the stack for execution.",
        code: [
          {
            code: "setTimeout(() => console.log('Delayed'), 1000);",
            language: "javascript",
          },
        ],
        answerReview: "Good explanation, but could mention microtasks like Promises.",
        correctAnswer: "The event loop manages the execution of synchronous and asynchronous code in JavaScript by monitoring the call stack, task queue, and microtask queue. It processes tasks when the stack is empty, prioritizing microtasks (e.g., Promises) over macrotasks (e.g., setTimeout).",
        score: 8,
        timeLimit: 300, // 5 minutes in seconds
        round: "technical", // Assuming RoundType could be something like this
        startTime: 1677139200000, // Feb 21, 2025, 08:00:00 UTC
        endTime: 1677139380000, // Feb 21, 2025, 08:03:00 UTC
        faceExpressions: [
          {
            expressionState: "neutral",
            timeStamp: 1677139205000, // 5 seconds into the question
          },
          {
            expressionState: "confident",
            timeStamp: 1677139260000, // 1 minute into the question
          },
        ],
        gazeTracking: [
          {
            timeStamp: 1677139205000,
            x: 500,
            y: 300,
          },
          {
            timeStamp: 1677139260000,
            x: 520,
            y: 310,
          },
        ],
        questionAnswerIndex: 0,
      },
      {
        question: "What is the purpose of useEffect in React?",
        answer: "useEffect is used to handle side effects in React components, like fetching data or updating the DOM.",
        code: [
          {
            code: "useEffect(() => { fetchData(); }, [dependency]);",
            language: "javascript",
          },
        ],
        answerReview: "Correct but lacks detail about the dependency array.",
        correctAnswer: "useEffect is a React Hook that manages side effects in functional components, such as data fetching, subscriptions, or manual DOM updates. It runs after every render by default, but can be controlled with a dependency array to run only when specific values change.",
        score: 7,
        timeLimit: 240, // 4 minutes in seconds
        round: "aptitude",
        startTime: 1677139440000, // Feb 21, 2025, 08:04:00 UTC
        endTime: null, // Still in progress
        faceExpressions: [
          {
            expressionState: "focused",
            timeStamp: 1677139445000, // 5 seconds into the question
          },
        ],
        gazeTracking: [
          {
            timeStamp: 1677139445000,
            x: 510,
            y: 320,
          },
        ],
        questionAnswerIndex: 1,
      },
      {
        question: "What is the purpose of useEffect in React?",
        answer: "useEffect is used to handle side effects in React components, like fetching data or updating the DOM.",
        code: [
          {
            code: "useEffect(() => { fetchData(); }, [dependency]);",
            language: "javascript",
          },
        ],
        answerReview: "Correct but lacks detail about the dependency array.",
        correctAnswer: "useEffect is a React Hook that manages side effects in functional components, such as data fetching, subscriptions, or manual DOM updates. It runs after every render by default, but can be controlled with a dependency array to run only when specific values change.",
        score: 5,
        timeLimit: 240, // 4 minutes in seconds
        round: "aptitude",
        startTime: 1677139440000, // Feb 21, 2025, 08:04:00 UTC
        endTime: null, // Still in progress
        faceExpressions: [
          {
            expressionState: "focused",
            timeStamp: 1677139445000, // 5 seconds into the question
          },
        ],
        gazeTracking: [
          {
            timeStamp: 1677139445000,
            x: 510,
            y: 320,
          },
        ],
        questionAnswerIndex: 1,
      },
      {
        question: "What is the purpose of useEffect in React?",
        answer: "useEffect is used to handle side effects in React components, like fetching data or updating the DOM.",
        code: [
          {
            code: "useEffect(() => { fetchData(); }, [dependency]);",
            language: "javascript",
          },
        ],
        answerReview: "Correct but lacks detail about the dependency array.",
        correctAnswer: "useEffect is a React Hook that manages side effects in functional components, such as data fetching, subscriptions, or manual DOM updates. It runs after every render by default, but can be controlled with a dependency array to run only when specific values change.",
        score: 9,
        timeLimit: 240, // 4 minutes in seconds
        round: "aptitude",
        startTime: 1677139440000, // Feb 21, 2025, 08:04:00 UTC
        endTime: null, // Still in progress
        faceExpressions: [
          {
            expressionState: "focused",
            timeStamp: 1677139445000, // 5 seconds into the question
          },
        ],
        gazeTracking: [
          {
            timeStamp: 1677139445000,
            x: 510,
            y: 320,
          },
        ],
        questionAnswerIndex: 1,
      },
    ],
    startTime: 1677139200000, // Feb 21, 2025, 08:00:00 UTC
    endTime: null, // Session still active
    currentQuestionIndex: 1,
    status: "active",
  };

const AnalyticsPage: React.FC = () => {

    const { socketId } = useSocketStore()
    const user = useUser().user

    const [analyticsData, setAnalyticsData] = useState<null | InterviewSession>(null)
    const [fetchingAnalyticsData, setFetchingAnalyticsData] = useState(false)
    // const [fetchingAnalyticsData, setFetchingAnalyticsData] = useState(true)

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

            // if (!fetchingAnalyticsData) {
            //     setFetchingAnalyticsData(true)
            // }

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
                    <AnalysisComponent userData={userData} analyticsData={mockInterviewSession} />
                    <Certificate name={user?.fullName || "Not found"} role={"Mern stack"} score={85} />
                </>}
        </div>
    );
};

export default AnalyticsPage;
