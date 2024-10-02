import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ArrowUpRight } from "lucide-react";
import axios from 'axios';


const CreateTeam = () => {
    const [userName, setUsername] = useState<string | undefined>(undefined);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`http://${process.env['PROD_URL_BACKEND']}/auth/is-logged-in`, { withCredentials: true })
            .then(response => {
                setUsername(response.data.username);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Using Create React App
        axios.get(`http://${process.env.PROD_URL_BACKEND}/auth/is-logged-in`, { withCredentials: true })

            .then(response => {
              console.log(response.data);
              if (response.data.success) {
                window.location.href = '/';
              } else {
                setAlertMessage(response.data.message || "Error creating team");
              }
            })
            .catch(error => {
              console.error(error);
              setAlertMessage("Error creating team. Please try again.");
            });
          
    }

    const getFirstLetter = (name: string | undefined) => {
        return name ? name.charAt(0).toUpperCase() : "";
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <nav className="flex justify-between items-center p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold">Transfinitte</h1>
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