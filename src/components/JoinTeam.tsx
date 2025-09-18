import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
// import { ArrowUpRight } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";
import { toast } from "sonner";

const JoinTeam = () => {
    const [teamCode, setTeamCode] = useState<string>("");
    const [userName, setUsername] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError) {
                    console.error(userError);
                    return;
                }
                const { data: userData, error: userDataError } = await supabase
                    .from("Users")
                    .select("*")
                    .eq("user_id", user?.id)
                    .single();
                if (userDataError) {
                    console.error(userDataError);
                    return;
                }
                setUsername(userData?.name);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (value: string) => {
        setTeamCode(value);
    };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (!teamCode) {
    //         toast("Whoops!", {
    //             description: "Team code is required.",
    //         });
    //         return;
    //     }

    //     try {
    //         const {
    //             data: { user },
    //             error: userError,
    //         } = await supabase.auth.getUser();
    //         if (userError) {
    //             console.error(userError);
    //             return;
    //         }
    //         const { data: userData, error: userDataError } = await supabase
    //             .from("Users")
    //             .select("*")
    //             .eq("user_id", user?.id)
    //             .single();
    //         if (userDataError) {
    //             console.error(userDataError);
    //             return;
    //         }
    //         if (userData?.team_id) {
    //             toast("Uh oh!", {
    //                 description: "You are already part of a team.",
    //             });
    //             return;
    //         }

    //         const { data: memberCount, error: memberCountError } = await supabase.rpc('count_team_members', { team_id_input: teamCode });
    //         console.log("memberCount", memberCount);
    //         if (memberCountError) {
    //             console.error("Error joining team", memberCountError);
    //             toast("Whoops!", {
    //                 description: "Error joining team. Please try again.",
    //             });
    //             return;
    //         }

    //         if (memberCount && memberCount >= 5) {
    //             toast("Maximum capacity reached!", {
    //                 description: "Team already has maximum number of members in it.",
    //             });
    //             return;
    //         }

    //         const { error } = await supabase
    //             .from("Users")
    //             .update({ team_id: teamCode })
    //             .eq("user_id", user?.id);
    //         if (error) {
    //             console.error("Error joining team", error);
    //             toast("Whoops!", {
    //                 description: "Error joining team. Please try again.",
    //             });
    //             return;
    //         }
    //         toast("Success!", {
    //             description: "You have successfully joined the team.",
    //         });
    //         setTimeout(() => {
    //             window.location.href = "/";
    //         }, 1000);
    //     } catch (error) {
    //         console.error("Error joining team", error);
    //         toast("Whoops!", {
    //             description: "Error joining team. Please try again.",
    //         });
    //     }
    // };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-nhg md:justify-center">
            <NavBar userName={userName} />
            <div className="flex self-start ml-4  cursor-pointer my-4">
                <img src="/Vector-2.png" alt="Logo" style={{ width: '15px', aspectRatio: '13 / 10' }} />
                <a href="/" className="text-neutral-500 text-sm self-center pl-2 hover:text-white transition-[1s] ">GO BACK</a>
            </div>
            <h1 className="md:text-5xl text-3xl ml-8 mb-4 md:mb-16 md:ml-0 gradient-text  w-full text-left font-thin md:text-center">Complete your Application</h1>
            <p className="  ml-8 mb-16 md:mb-32  md:ml-0   w-full text-left md:text-center font-thin md:text-2xl">Join Existing Team</p>


            <main className="flex-grow flex flex-col  items-center px-4 md:px-6">


                <form className="space-y-1 ">
                    <div className="space-y-2">

                        <div className="flex justify-center items-center">
                            <InputOTP
                                value={teamCode}
                                onChange={handleInputChange}
                                maxLength={6}
                            >
                                <InputOTPGroup className="flex  justify-center">
                                    {Array.from({ length: 6 }, (_, index) => (
                                        <React.Fragment key={index}>
                                            {/* dash sits before the input at index 3 */}
                                            {index === 3 && (
                                                <span className="mx-2 flex items-center text-white text-2xl" aria-hidden>
                                                    —
                                                </span>
                                            )}

                                            <InputOTPSlot
                                                index={index}
                                                className={
                                                    index === 0
                                                        ? "border-[0.5px] border-[#E2E8F033] text-white w-12 h-12 text-center rounded-l-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        : index === 2
                                                            ? "border-[0.5px] border-[#E2E8F033] text-white w-12 h-12 text-center rounded-r-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            : index === 3
                                                                ? "border-[0.5px] border-[#E2E8F033] text-white w-12 h-12 text-center rounded-l-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                : index === 5
                                                                    ? "border-[0.5px] border-[#E2E8F033] text-white w-12 h-12 text-center rounded-r-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    : "border-r-0 border-[0.5px] border-[#E2E8F033] text-white w-12 h-12 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                }
                                            />
                                        </React.Fragment>
                                    ))}

                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </div>

                </form>

            </main>
            <div className="text-[#61FF61] font-thin text-center py-6 text-sm md:text-lg md:text-md">Joining Shubham's Team</div>
            <div className="p-4 pt-1 border-t border-neutral-800 flex md:justify-end">
                <Button className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg  hover:bg-gray-300 transition duration-300 " onClick={() => window.location.href = '/team/45'}>
                    PROCEED
                </Button>
            </div>
        </div>
    );
};

export default JoinTeam;
