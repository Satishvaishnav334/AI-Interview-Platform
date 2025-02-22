import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewSession } from "@/types/InterviewData";
import { getDateAndDay } from "@/utils/formatTime";

const MAX_STREAK = 10; // Maximum streak count for a full circle

const StreakCircle = ({ interviewSessions }: { interviewSessions: InterviewSession[] }) => {

    const getStreak = () => {
        if (!interviewSessions || interviewSessions?.length === 0) {
            return 0;
        }

        let currentStreak = 0;
        let lastDate = null;
        for (let i = 0; i < interviewSessions.length; i++) {
            const session = interviewSessions[i];
            const sessionDate = new Date(session.startTime);
            if (lastDate && sessionDate.getDate() === lastDate.getDate()) {
                currentStreak++;
                if (currentStreak === MAX_STREAK) {
                    return MAX_STREAK;
                }
            } else {
                currentStreak = 1;
            }
            lastDate = sessionDate;
        }
        return currentStreak;
    };

    return (
        <Card className="w-7/12 max-w-sm mx-auto p-4 text-center bg-zinc-200 dark:bg-zinc-800 ml-2">
            <h1 className="text-3xl font-bold rounded-xl py-3  w-full text-center">
                Streak Track
            </h1>

            <CardHeader>
                <CardTitle>Streak Tracker</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative flex justify-center items-center w-40 h-40 mx-auto">
                    {/* SVG Circular Progress */}
                    <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle cx="50" cy="50" r="40" strokeWidth="10" fill="none" className="stroke-gray-300" />
                        {/* Streak Progress Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            strokeWidth="10"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (getStreak() / MAX_STREAK) * 251.2}
                            strokeLinecap="round"
                            className="stroke-[#f59e0b] transition-all duration-500 ease-in-out"
                        />
                    </svg>

                    {/* Streak Count in the Center */}
                    <span className="absolute text-3xl font-bold text-[#f59e0b] ">{getStreak()}</span>
                </div>

                <div className="py-6 space-y-2">
                    {interviewSessions && interviewSessions.sort((a, b) => b.startTime - a.startTime).map((session, index) => (
                        <p key={index}>{getDateAndDay(session.startTime)}</p>
                    ))}
                </div>

            </CardContent>
        </Card>
    );
};

export default StreakCircle;
