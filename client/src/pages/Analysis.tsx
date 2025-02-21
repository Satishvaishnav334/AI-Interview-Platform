import { InterviewSession } from "@/types/InterviewData";
import { FaUser, FaPhone, FaLinkedin, FaGraduationCap, FaBriefcase, FaBullseye } from "react-icons/fa";
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

interface Skill {
  name: string;
  level: number;
}

interface UserData {
  name: string;
  phone: string;
  linkedin: string;
  higherEducation: string;
  jobRole: string;
  goals: string;
  skills: Skill[];
}

// Update the AnalysisComponent props to use the UserData interface
interface AnalysisComponentProps {
  userData: UserData;
  analyticsData: InterviewSession | null
}

const chartConfig = {
  level: {
    label: "Level",
    color: "hsl(var(--chart-1))",
  },
  name: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

const AnalysisComponent = ({ userData, analyticsData }: AnalysisComponentProps) => {

  const skillLevel = analyticsData?.questions.map(({ score, round }) => (
    {
      name: round,
      level: score
    }
  ))

  return (
    <div className="p-6 shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Interview Analysis</h2>


      {/* User Info Section */}
      <div className="grid grid-cols-1 max-w-4xl mx-auto sm:grid-cols-2 text-zinc-900 dark:text-zinc-100 gap-6">
        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaUser className="text-blue-500" />
          <span className="font-semibold">Full Name:</span>
          <p className="text-gray-700 dark:text-gray-300">{userData.name}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaPhone className="text-blue-500" />
          <span className="font-semibold">Phone:</span>
          <p className="text-gray-700 dark:text-gray-300">{userData.phone}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaLinkedin className="text-blue-500" />
          <span className="font-semibold">LinkedIn:</span>
          <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {userData.linkedin}
          </a>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaGraduationCap className="text-blue-500" />
          <span className="font-semibold">Education:</span>
          <p className="text-gray-700 dark:text-gray-300">{userData.higherEducation}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaBriefcase className="text-blue-500" />
          <span className="font-semibold">Job Role:</span>
          <p className="text-gray-700 dark:text-gray-300">{userData.jobRole}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaBullseye className="text-blue-500" />
          <span className="font-semibold">Career Goals:</span>
          <p className="text-gray-700 dark:text-gray-300">{userData.goals}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2 max-w-[90rem] mx-auto">
        {/* Skills Bar Chart */}
        <div className="mt-10">
          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle>Skill Proficiency</CardTitle>
              <CardDescription>Current Skill Assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  data={skillLevel}
                  layout="vertical"
                  margin={{
                    right: 16,
                  }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <XAxis dataKey="level" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="level"
                    fill="var(--color-level)"
                    radius={4}
                  >
                    <LabelList
                      dataKey="name"
                      position="insideLeft"
                      offset={8}
                      className="fill-zinc-900"
                      fontSize={16}
                    />
                    <LabelList
                      dataKey="level"
                      position="right"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Your skills are trending up! <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Keep honing those skills and continue your journey of improvement.
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Skills Bar Chart */}
        <div className="mt-10">
          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle>Skill Proficiency</CardTitle>
              <CardDescription>Current Skill Assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadarChart data={skillLevel}>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarGrid gridType="circle" />
                  <PolarAngleAxis dataKey="month" />
                  <Radar
                    dataKey="level"
                    fill="var(--color-level)"
                    fillOpacity={0.6}
                    dot={{
                      r: 4,
                      fillOpacity: 1,
                    }}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Your skills are trending up! <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Keep honing those skills and continue your journey of improvement.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>

    </div >
  );
};

export default AnalysisComponent;