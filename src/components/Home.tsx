import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowUpRight } from "lucide-react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";
import { toast } from "sonner";

const handleToast = () => {
     toast("Whoops!", {
        description: "Registration are closed, See you next year!!",
      });
}
const handleProblemStatement = () => {
     toast("Whoops!", {
        description: "Problem Statement are not available right now",
      });
}


const Home = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isPartofTeam, setIsPartofTeam] = useState(false);
    const [userName, setUsername] = useState<string | undefined>(undefined);
    const [teamId, setTeamId] = useState<string | undefined>(undefined);
    const [alertMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasRollNumber, setHasRollNumber] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError) {
                console.error(userError);
                setLoading(false);
                return;
            }
            const { data: userData, error: userDataError } = await supabase
                .from("users")
                .select("*")
                .eq("user_id", user?.id)
                .single();
            if (userDataError) {
                console.error(userDataError);
                setLoading(false);
                return;
            }
            setLoggedIn(true);
            setUsername(userData?.name);
            setIsPartofTeam(userData?.team_id ? true : false);
            setTeamId(userData?.team_id);
            setHasRollNumber(!!userData?.roll_number);
            if (!userData?.roll_number) {
                window.location.href = "/profile";
            }
            setLoading(false);
        };
        fetchUser();
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
            {isLoggedIn && <NavBar userName={userName} />}

            <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
                <div className="w-full max-w-md space-y-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Welcome to TransfiNITTe
                    </h2>
                    <p className="text-sm md:text-base">
                        Get ready for TransfiNITTe 2025 Hackathon. Join a team
                        or create your own to participate!
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
                                    onClick={() =>
                                        (window.location.href = `/team/${teamId}`)
                                    }
                                >
                                    <span>View Dashboard</span>
                                    <ArrowUpRight className="h-5 w-5" />
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <Button
                                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                        onClick={handleToast}
                                    >
                                        <span>Create Team</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                        onClick={handleToast}
                                    >
                                        <span>Join Team</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            )
                        ) : (
                            <Button
                                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                onClick={() =>
                                    (window.location.href = "/profile")
                                }
                            >
                                <span>Complete Your Profile</span>
                                <ArrowUpRight className="h-5 w-5" />
                            </Button>
                        )
                    ) : (<div>
                        <Button
                            className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                            onClick={() => (window.location.href = "/login")}
                        >
                            <span>Login</span>

                            <ArrowUpRight className="h-5 w-5" />
                        </Button>
                        <Button
                            className="w-full mt-6 py-3 bg-white text-white rounded-lg bg-transparent font-bold hover:underline transition duration-300 flex items-center justify-center gap-2"
                            onClick={() =>
                                    (window.location.href = "https://transfinitte.notion.site/")}
                        >
                            <span>Rulebook</span>

                            <ArrowUpRight className="h-5 w-5" />
                        </Button>
                        </div>
                        
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
