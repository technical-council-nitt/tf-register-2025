import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react"; // Import Loader2 for loading UI

// Gender options
const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Others" },
];

type User = {
  firstName: string;
  lastName: string;
  personalEmail: string;
  hostel: string;
  rollNumber: string;
  isPartofTeam: string;
  teamId: string;
};

// Zod schema for form validation
const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  rollNumber: z.string().length(9, "Roll Number must be exactly 9 digits").regex(/^\d+$/, "Roll Number must contain only digits"),
  personalEmail: z.string().email("Invalid email address"),
  hostel: z.string().nonempty("Hostel is required"),
  gender: z.string().nonempty("Gender is required"),
});

const Profile = () => {
  const [_, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state to handle loading screen

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      rollNumber: "",
      personalEmail: "",
      hostel: "",
      gender: "",
    },
  });

  // Fetch user data and update form values
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://${process.env['PROD_URL_BACKEND']}/profile/get-data`, { withCredentials: true });
        const userData = response.data.details;
        setUserDetails(userData);

        // Reset form values with the fetched user data
        form.reset({
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          rollNumber: userData?.rollNumber || "",
          personalEmail: userData?.personalEmail || "",
          hostel: userData?.hostel || "",
          gender: userData?.gender || "",
        });
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false); // Stop loading on error
      }
    };

    getData();
  }, [form]); // Add form as a dependency to avoid re-initializing

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`http://${process.env['PROD_URL_BACKEND']}/profile/update`, data, { withCredentials: true });
      if (response.data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  if (loading) {
    // Render loading screen
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black p-4">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Complete your Application</h1>
      <p className="mb-4 text-center text-white">
        Please enter your details to attend TransfiNITTe 2024 Hackathon. By entering your information, you acknowledge you have read our Rulebook.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-transparent text-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6"
        >
          {/* First Name */}
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Full Name" {...field} className="bg-[#1a1a1a] border border-gray-600 rounded-md p-2" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Roll Number */}
          <FormField
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter Roll Number" {...field} className="bg-[#1a1a1a] border border-gray-600 rounded-md p-2" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Personal Email */}
          <FormField
            name="personalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your personal email" {...field} className="bg-[#1a1a1a] border border-gray-600 rounded-md p-2" disabled />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Hostel */}
          <FormField
            name="hostel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hostel</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your hostel name" {...field} className="bg-[#1a1a1a] border border-gray-600 rounded-md p-2" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Gender (Select) */}
          <FormField
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border border-gray-600 rounded-md">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-2 px-4 bg-white text-black rounded-lg font-bold hover:bg-gray-300 transition duration-300">
            Proceed
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
