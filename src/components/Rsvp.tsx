import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowUpRight } from "lucide-react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";

const Rsvp = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isPartofTeam, setIsPartofTeam] = useState(false);
    const [userName, setUsername] = useState<string | undefined>(undefined);
    const [teamId, setTeamId] = useState<string | undefined>(undefined);
    const [alertMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasRollNumber, setHasRollNumber] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(0); 

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
                return;
            }
            
            // Fetch team data if user has a team
            if (userData?.team_id) {
                await fetchTeamData(userData.team_id);
            } else {
                setLoading(false);
            }
        };
        
        const fetchTeamData = async (currentTeamId: string) => {
            const {
                data: team,
                error: teamError,
            } = await supabase
                .from("teams")
                .select("*")
                .eq("team_id", currentTeamId)
                .single();
            if (teamError) {
                console.error(teamError);
                setLoading(false);
                return;
            }
            console.log(team.payment_status);
            if(team.payment_status==="PAID") {
                setPaymentStatus(1);
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
                   {isLoggedIn&&isPartofTeam && ( <div>{paymentStatus === 1 ? (
                        <>
                            <h2 className="text-3xl md:text-4xl font-bold">
                             Claim Your Digital SWAG now! 

                            </h2>
                            <p className="text-sm md:text-base">
                             Share your personalised RSVPs on your socials and win prizes.
Click on this downloaded link if the file doesn't start downloading automatically
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl md:text-4xl font-bold">
                               Get Your Digital SWAG now!

                            </h2>
                            <p className="text-sm md:text-base">
                              Complete your team registration to claim it. Share it on your socials to win prizes.
                            </p>
                            <Button
                            className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                            onClick={() => (window.location.href = "/team/"+teamId)}
                        >
                            <span>Dashboard</span>
                            <ArrowUpRight className="h-5 w-5" />
                        </Button>
                        </>
                    )}
                    </div>)}
                    {alertMessage && (
                        <Alert className="bg-red-500 text-white p-4 rounded-lg">
                            <AlertDescription>{alertMessage}</AlertDescription>
                        </Alert>
                    )}
                    {isLoggedIn ? (
                        hasRollNumber ? (
                            isPartofTeam && teamId ? (
                               <div></div>
                            ) : (
                                <div className="space-y-4">
                                    <Button
                                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                        onClick={() =>
                                            (window.location.href =
                                                "/create-team")
                                        }
                                    >
                                        <span>Create Team</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                        onClick={() =>
                                            (window.location.href =
                                                "/join-team")
                                        }
                                    >
                                        <span>Join Team</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            )
                        ) : (<div>
                            <h2 className="text-3xl md:text-4xl font-bold">
                            You Are Not Part of Any Team

                            </h2>
                            <p className="text-sm md:text-base">
                                Complete your team registration to claim it.
                            </p>
                            <Button
                                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                onClick={() =>
                                    (window.location.href = "/profile")
                                }
                            > 
                                <span>Complete Your Profile</span>
                                <ArrowUpRight className="h-5 w-5" />
                            </Button>
                            </div>
                        )
                    ) : (
                        <>
                            <h2 className="text-3xl md:text-4xl font-bold">
                               Welcome to TransfiNITTe

                            </h2>
                            <p className="text-sm md:text-base">
                              Get ready for TransfiNITTe 2025 Hackathon. Join a team or create your own to participate!
                            </p>
                        
                        <Button
                            className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                            onClick={() => (window.location.href = "/login")}
                        >
                            <span>Login</span>
                            <ArrowUpRight className="h-5 w-5" />
                        </Button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Rsvp;
{/* <Button
                                    className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                                    onClick={() =>
                                        (window.location.href = `/team/${teamId}`)
                                    }
                                >
                                    <span>View Dashboard</span>
                                    <ArrowUpRight className="h-5 w-5" />
                                </Button> */}
