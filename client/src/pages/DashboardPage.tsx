import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import SelectRoles from "@/components/general/SelectRoles";
import StreakTracker from "@/components/general/StreakTracker";
import SessionInfoForm from "@/components/interview/SessionInfoForm";
import { Link } from "react-router-dom";
function DashboardPage() {
  return (
    <div className="h-full w-screen overflow-x-hidden py-12 space-y-6">
      <div className="w-1/2 mx-auto my-2 py-2 rounded-xl bg-gradient-to-r to-blue-700 from-purple-800 flex justify-center items-center">
        <p className="text-zinc-300 font-semibold"><Link to="/dashboard/form" className="text-zinc-100 font-semibold hover:underline">Visit form</Link> to get started</p>
      </div>
      <SessionInfoForm />
      <Container>
        <div>
          <SelectRoles />
        </div>
        <h1 className="text-3xl font-bold mb-4 mt-16 rounded-xl py-1 h-15 w-fit text-left transition duration-300">
          Daily stats
        </h1>
        <div className="flex justify-between">
          <DataVisualization />
          <StreakTracker />
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
