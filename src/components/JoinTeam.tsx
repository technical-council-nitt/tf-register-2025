import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ArrowUpRight } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import axios from "axios";

const JoinTeam = () => {
  const [teamCode, setTeamCode] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [userName, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    axios.get(`http://${import.meta.env.VITE_PROD_URL_BACKEND}/auth/is-logged-in`, { withCredentials: true })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleInputChange = (value: string) => {
    setTeamCode(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teamCode) {
      setAlertMessage("Team code is required");
      return;
    }
    
    try {
      const response = await axios.post(`http://${import.meta.env.VITE_PROD_URL_BACKEND}/team/join`, { uniqueId: teamCode }, { withCredentials: true });
      setAlertMessage(response.data.message);
      if (response.data.success) window.location.href = "/";
    } catch (error) {
      console.error("Error joining team", error);
      setAlertMessage("Error joining team");
    }
  };

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
          <h2 className="text-3xl md:text-4xl font-bold text-center">Join Team</h2>
          {alertMessage && (
            <Alert className="bg-red-500 text-white p-4 rounded-lg">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="teamCode" className="block text-sm font-medium text-gray-400">
                Enter Team Code <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center">
                <InputOTP
                  value={teamCode}
                  onChange={handleInputChange}
                  maxLength={6}
                >
                  <InputOTPGroup className="flex space-x-2 justify-center">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTPSlot key={index} index={index} className="bg-[#2a2a2a] border border-gray-600 text-white w-12 h-12 text-center rounded-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <Button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2">
              <span>Join Team</span>
              <ArrowUpRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default JoinTeam;