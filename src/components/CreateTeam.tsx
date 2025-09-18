import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
// import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";
import { toast } from "sonner";
import GradientLine from "./ui/gradientline";

const CreateTeam = () => {
    const [userName, setUsername] = useState<string | undefined>(undefined);
    const [userInfo, setUserInfo] = useState<any | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError) {
                    // console.error(userError);
                    // return;
                }
                const { data: userData, error: userDataError } = await supabase
                    .from("Users")
                    .select("*")
                    .eq("user_id", user?.id)
                    .single();
                if (userDataError) {
                    // console.error(userDataError);
                    // return;
                }
                setUsername(userData?.name);
                setUserInfo(user);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    const generate_team_id = async () => {
        let teamId;
        let isUnique = false;

        while (!isUnique) {
            teamId = Math.floor(100000 + Math.random() * 900000).toString();

            const { data } = await supabase
                .from("Teams")
                .select("team_id")
                .eq("team_id", teamId);

            if (!data || data.length === 0) {
                isUnique = true;
            }
        }

        return teamId;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const teamId = await generate_team_id();

        console.log("This is the team id: ", teamId);

        const { data: teamData, error: teamError } = await supabase.from("Teams").select("*").eq("name", data.name);

        if (teamError) {
            console.error(teamError);
            toast("Whoops!", {
                description: "Error creating team. Please try again.",
            });
            return;
        }

        if (teamData && teamData.length > 0) {
            toast("Whoops!", {
                description: "A Team already exists with that name. Please try another name.",
            });
            return;
        }

        const { error } = await supabase.rpc("register_team_and_user", {
            team_name: data.name,
            leader_email: userInfo.email,
            leader_user_id: userInfo.id,
            contact_number: data.contactNumber,
            user_email_param: userInfo.email,
            new_team_id: teamId,
        });

        if (error) {
            console.error(error);
            toast("Whoops!", {
                description: "Error creating team. Please try again.",
            });
            return;
        }

        window.location.href = "/";
    };

    return (
                       
        <div className="flex flex-col min-h-screen bg-black text-white font-nhg p-3">
            <NavBar userName={userName} />

            <main className="flex-grow flex flex-col  md:items-center   ">

                <div className="flex self-start  my-2 lg:my-4 cursor-pointer">
                    <img src="/Vector-2.png" alt="Logo" style={{ width: '15px', aspectRatio: '13 / 10' }} />
                    <a href="/" className="text-neutral-500 text-sm self-center pl-2 hover:text-white transition-[1s]">GO BACK</a>
                </div>
                <h1 className="md:text-4xl text-3xl  mb-2 gradient-text  w-full text-left md:text-center font-thin">Complete your Application</h1>

                <h2 className="text-sm md:text-2xl font-thin my-3">Creating Team</h2>
               
                <form onSubmit={handleSubmit} className="space-y-6 ">
                    <div className="space-y-6">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300 md:text-lg md:my-6"
                        >
                            Team Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Team name"
                            className="bg-[#2a2a2a] text-white border-[0.5px] border-[#E2E8F033] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />


                        <label
                            htmlFor="domain"
                            className="block text-sm font-medium text-gray-300 md:text-lg md:my-6"
                        >
                            Domain <span className="text-red-500">*</span>
                        </label>

                        <select
                            id="domain"
                            name="domain"
                            required
                            className="bg-[#2a2a2a] font-thin text-white border-[0.5px] border-[#E2E8F033] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full min-h-10 rounded-lg"
                        >
                            <option value="software" className="">Software</option>
                            <option value="hardware" className="">Hardware</option>
                            <option value="management" className="">Management</option>
                            <option value="entrepreneurship" className="">Entrepreneurship</option>
                        </select>
                        <GradientLine />
                    </div>

                    <div className="space-y-6">
                        <label
                            htmlFor="contactNumber"
                            className="block text-sm font-medium text-gray-300 md:text-lg md:my-6"
                        >
                            Team Invite Code{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div

                            id="contactNumber"

                            className="min-h-10 bg-[#2a2a2a] rounded-lg text-white border-[0.5px] border-[#E2E8F033] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center flex justify-center items-center font-thin md:text-lg md:my-6"
                        >
                            042-072
                        </div>
                    </div>
                      <Button
                       
                        className="w-full  mx-left font-thin bg-white hover:bg-gray-200 text-black  py-3 rounded-lg flex items-center justify-center gap-2 md:text-lg md:my-6 "
                    >
                        <span>SHARE</span>
                        
                    </Button>

                  
                </form>

            </main>
            <div className="border-t border-neutral-500 p-2 flex justify-center md:justify-end items-center">

              <Button
                        type="submit"
                        className="w-full md:w-1/4 font-thin bg-white hover:bg-gray-200 text-black  py-3 rounded-lg flex items-center justify-center gap-2"
                        onClick={() => window.location.href = '/team/45'}
                    >
                        <span>PROCEED</span>
                        
                    </Button>
                        </div>
          
        </div>
          
                      
    );
};

export default CreateTeam;
