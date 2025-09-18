import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavBar from "./Navbar";
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
import { Loader2 } from "lucide-react";
import WaterDropGrid from "./WaterDropGrid";
import { supabase } from "@/utiils/supabase";

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Others" },
];

type User = {
  name: string;
  personalEmail: string;
  hostel: string;
  rollNumber: string;
  isPartofTeam: string;
  teamId: string;
  gender: string;
  mess: string;
};

const schema = z.object({
  name: z.string().min(1, "Full Name is required"),
  rollNumber: z.string().length(9, "Roll Number must be exactly 9 digits").regex(/^\d+$/, "Roll Number must contain only digits"),
  personalEmail: z.string().email("Invalid email address"),
  hostel: z.string().nonempty("Hostel is required"),
  gender: z.string().nonempty("Gender is required"),
  mess: z.string().nonempty("Mess is required"),
});

const Profile = () => {
  const [_, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      rollNumber: "",
      personalEmail: "",
      hostel: "",
      gender: "",
      mess: "",
    },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();

        if(error) {
          // console.error("Error fetching user details:", error);
          // window.location.href = "/login";
          // return;
        }

        const { data: userData } = await supabase.from("Users").select("*").eq("user_id", user?.id).single();

        if(userData) {
          setUserDetails(userData);
          form.reset({
            name: userData?.name || "",
            rollNumber: userData?.roll_number || "",
            personalEmail: userData?.email || "",
            hostel: userData?.hostel || "",
            gender: userData?.gender || "",
            mess: userData?.mess || "",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    getData();
  }, [form]);

  const onSubmit = async (data: any) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if(error) {
        console.error("Error fetching user details:", error);
        return;
      }

      const { error: upsertError } = await supabase.from("Users").update({
        user_id: user?.id,
        name: data.name,
        roll_number: data.rollNumber,
        email: data.personalEmail,
        hostel: data.hostel,
        mess: data.mess,
        gender: data.gender,
      }).eq("user_id", user?.id);

      if(upsertError) {
        console.error("Error updating user details:", upsertError);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl"></p>
      </div>
    );
  }

  return (
    <>
     <div className="flex flex-col min-h-screen bg-black text-white font-nhg ">
      <NavBar  />
      <div className="flex">
        
        <div className="bg-white w-full md:block hidden overflow-hidden">
          <WaterDropGrid />
        </div>
        <div className="flex flex-col w-full justify-center items-center min-h-screen bg-black p-1">
          <div className="flex self-start ml-4 my-2 cursor-pointer">
            <img src="/Vector-2.png" alt="Logo" style={{ width: '15px', aspectRatio: '13 / 10' }} />
            <a href="/" className="text-gray-300 text-sm self-center pl-2  transition-[1s] font-extralight">GO BACK</a>
          </div>
          <h1 className="md:text-2xl text-3xl ml-8 mb-4 gradient-text md:text-left w-full text-left">Complete your Application</h1>
          <p className="md:text-xs mb-4 ml-4 text-left text-white font-extralight tracking-wide ">
            Please enter your details to attend TransfiNITTe 2024 Hackathon. By entering your information, you acknowledge you have read our <a href="/rulebook" className="underline underline-offset-4 decoration-1 decoration-slate-300">Rulebook</a>.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-white p-2 rounded-lg shadow-md w-full space-y-2"
            >
              {/* First Name */}
              <FormField
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-thin">First Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="First Name" {...field} className="bg-[#1a1a1a] border-[0.5px] border-[#E2E8F033] mt-0 rounded-md p-2" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
               {/* Last Name */}
              <FormField
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-thin">Last Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Last Name" {...field} className="bg-[#1a1a1a] border-[0.5px] border-[#E2E8F033] mt-0 rounded-md p-2" />
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
                    <FormLabel className="font-thin">Roll Number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter Roll Number" {...field} className="bg-[#1a1a1a] border-[0.5px] border-[#E2E8F033] mt-0  rounded-md p-2" />
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
                    <FormLabel className="font-thin">Personal Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your personal email" {...field} className="bg-[#1a1a1a] mt-0 border-[0.5px] border-[#E2E8F033]  rounded-md p-2" disabled />
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
                    <FormLabel className="font-thin">Hostel</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your hostel name" {...field} className="bg-[#1a1a1a] mt-0 border-[0.5px] border-[#E2E8F033] rounded-md p-2" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Mess */}
              <FormField
                name="mess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-thin">Mess</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your Mess name" {...field} className="bg-[#1a1a1a] border-[0.5px] border-[#E2E8F033] mt-0 rounded-md p-2" />
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
                    <FormLabel className="font-thin">Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#1a1a1a] border-[0.5px] border-[#E2E8F033] rounded-md">
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
             
            </form>
          </Form>
           <div className="w-full flex md:flex-row-reverse border-t-[1px] border-[#E2E8F066] my-1 items-center justify-center px-4 pb-2">
                <Button type="submit" className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg  hover:bg-gray-300 transition duration-300" onClick={() => window.location.href = '/createorjoin'}>
                  PROCEED
                </Button>
              </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Profile;
