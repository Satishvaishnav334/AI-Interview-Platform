import { toast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const InterviewForm = () => {

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    linkedin: "",
    higherEducation: "",
    college: "",
    jobRole: "",
    achievements: "",
    skills: "",
    projects: "",
  });

  const user = useClerk().user

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true)

    try {
      const data = {
        name: formData.name,
        phone: formData.phone,
        email: user?.emailAddresses[0].emailAddress,
        linkedin: formData.linkedin,
        higherEducation: formData.higherEducation,
        college: formData.college,
        jobRole: formData.jobRole,
        achievements: formData.achievements,
        skills: formData.skills,
        projects: formData.projects,
      }
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/v1/user`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });

      if (res.status === 201) {
        {
          toast({
            title: "Form submitted successfully",
          })
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
        })
      } else {
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <main className="flex items-center justify-center min-h-[85vh]">
      <div
        className="max-w-xl w-full bg-zinc-200 dark:bg-zinc-800 shadow-lg rounded-2xl p-6"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Interview AI Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="Enter your LinkedIn profile URL"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="text"
            name="higherEducation"
            value={formData.higherEducation}
            onChange={handleChange}
            placeholder="Enter your higher education (e.g. Bachelor's degree)"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter your college name"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="text"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
            placeholder="Enter your job role (e.g. Software Developer) if any or leave it blank"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Input
            type="url"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            placeholder="GitHub repository URL"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="List your key achievements"
            className="w-full border bg-zinc-100/70 dark:bg-zinc-700/70 rounded-lg !text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default InterviewForm