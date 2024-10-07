import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ArrowUpRight } from "lucide-react";
import { supabase } from '@/utiils/supabase';


const CreateTeam = () => {
    const [userName, setUsername] = useState<string | undefined>(undefined);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) {
                    console.error(userError);
                    return;
                }
                const { data: userData, error: userDataError } = await supabase.from('Users').select('*').eq('user_id', user?.id).single();
                if (userDataError) {
                    console.error(userDataError);
                    return;
                }
                setUsername(userData?.name);
                setUserInfo(userData);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchUser();
    }, []);

    const generate_team_id = async () => {
        let teamId;
        let isUnique = false;
      
        while (!isUnique) {
          teamId = Math.floor(100000 + Math.random() * 900000).toString();
      
          const { data } = await supabase
            .from('Teams')
            .select('team_id')
            .eq('team_id', teamId);
      
          if (!data || data.length === 0) {
            isUnique = true; 
          }
        }
      
        return teamId;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const teamId = await generate_team_id();

        console.log("This is the team id: ", teamId);

        const { error } = await supabase.rpc('register_team_and_user', {
            team_name: data.name,
            leader_email: userInfo.email,
            contact_number: data.contactNumber,
            user_email_param: userInfo.email,
            new_team_id: teamId,
        });

        if(error) {
            console.error(error);
            setAlertMessage("Error creating team. Please try again.");
            return;
        }

        window.location.href = "/";
    }

    const getFirstLetter = (name: string | undefined) => {
        return name ? name.charAt(0).toUpperCase() : "";
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <nav className="flex justify-between items-center p-4 md:p-6 border-b-[1px] border-neutral-800">
            <img src="/motif.svg" alt="Logo" style={{ width: '40px', aspectRatio: '63 / 29' }} className="md:hidden block" />
            <img src="/motif-desk.svg" alt="Logo" style={{ width: '120px', aspectRatio: '155 / 20' }} className="md:block hidden" />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar
                                className="cursor-pointer bg-[#1a1a1a] border border-gray-600"
                                onClick={() => window.location.href = "/profile"}
                            >
                                <AvatarFallback className="bg-[#1a1a1a] text-white">{getFirstLetter(userName)}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>

            <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
                <div className="w-full max-w-md space-y-6 bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl md:text-4xl font-bold text-center">Create Team</h2>
                    {alertMessage && (
                        <Alert className="bg-red-500 text-white p-4 rounded-lg">
                            <AlertDescription>{alertMessage}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Enter team name"
                                className="bg-[#2a2a2a] text-white border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">
                                Contact Number <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                pattern='[0-9]{10}'
                                id="contactNumber"
                                name="contactNumber"
                                required
                                placeholder="Enter contact number"
                                className="bg-[#2a2a2a] text-white border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                            <span>Create Team</span>
                            <ArrowUpRight className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default CreateTeam;