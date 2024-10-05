import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ArrowUpRight } from "lucide-react";
import { Loader2 } from "lucide-react";
import axios from "axios";

const Home = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isPartofTeam, setIsPartofTeam] = useState(false);
    const [userName, setUsername] = useState<string | undefined>(undefined);
    const [teamId, setTeamId] = useState<string | undefined>(undefined);
    const [alertMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasRollNumber, setHasRollNumber] = useState(false);

    // Ensure cookies are sent with requests
    axios.defaults.withCredentials = true;

    const getFirstLetter = (name: string | undefined) => {
        return name ? name.charAt(0).toUpperCase() : "";
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`http://${import.meta.env.VITE_PROD_URL_BACKEND}/auth/is-logged-in`)
        .then(response => {
            console.log("Logged in: ", response.data)
            setLoggedIn(response.data.success);
            setUsername(response.data.username);

            if (response.data.success) {
                axios.get(`http://${import.meta.env.VITE_PROD_URL_BACKEND}/profile/get-data`, { withCredentials: true })
                .then(response => {
                    console.log(response.data);

                    const isPartofTeamValue = response.data.details.isPartofTeam === 'TRUE';
                    setIsPartofTeam(isPartofTeamValue);
                    setTeamId(response.data.details.teamId || undefined);
                    
                    // Check if roll number is set
                    setHasRollNumber(!!response.data.details.rollNumber);

                    // Redirect to profile if roll number is not set
                    if (!response.data.details.rollNumber) {
                        window.location.href = "/profile";
                    }
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        })
        .catch(error => {
            console.error(error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="text-xl"></p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <nav className="flex justify-between items-center p-4 md:p-6">
            <img src="/motif.svg" alt="Logo" style={{ width: '40px', aspectRatio: '63 / 29' }} className="md:hidden block" />
            <img src="/motif-desk.svg" alt="Logo" style={{ width: '120px', aspectRatio: '155 / 20' }} className="md:block hidden" />
                {isLoggedIn && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar
                                    className="cursor-pointer bg-[#1a1a1a] border border-gray-600"
                                    onClick={() => window.location.href = "/profile"}
                                >
                                    <AvatarFallback className="bg-[#1a1a1a] text-white">
                                        {getFirstLetter(userName)}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Profile</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </nav>

            <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
                <div className="w-full max-w-md space-y-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Welcome to TransfiNITTe</h2>
                    <p className="text-sm md:text-base">
                        Get ready for TransfiNITTe 2024 Hackathon.
                        Join a team or create your own to participate!
                    </p>
                    {alertMessage && (
                        <Alert className="bg-red-500 text-white p-4 rounded-lg">
                            <AlertDescription>{alertMessage}</AlertDescription>
                        </Alert>
                    )}
                    {isLoggedIn ? (
                        hasRollNumber ? (
                            isPartofTeam && teamId ? (
                                <Button 
                                    className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                    onClick={() => window.location.href = `/team/${teamId}`}
                                >
                                    <span>View Dashboard</span>
                                    <ArrowUpRight className="h-5 w-5" />
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <Button
                                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                        onClick={() => window.location.href = "/create-team"}
                                    >
                                        <span>Create Team</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                        onClick={() => window.location.href = "/join-team"}
                                    >
                                        <span>Join Team</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            )
                        ) : (
                            <Button
                                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                onClick={() => window.location.href = "/profile"}
                            >
                                <span>Complete Your Profile</span>
                                <ArrowUpRight className="h-5 w-5" />
                            </Button>
                        )
                    ) : (
                        <Button
                            className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                            onClick={() => window.location.href = "/login"}
                        >
                            <span>Login</span>
                            <ArrowUpRight className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;