// import React, { useState, useEffect } from "react";
import  { useState, useEffect } from "react";
import { Button } from "./ui/button";
// import { ArrowUpRight } from "lucide-react";
import GradientLine from "./ui/gradientline";

import NavBar from "./Navbar";
// import { set } from "animejs";
// import { toast } from "sonner";

const Create_JoinTeam = () => {
    // const [teamCode, setTeamCode] = useState<string>("");
    const [userName, setUsername] = useState<string | undefined>(undefined);

    useEffect(() => {
        setUsername("User");
        // const fetchUser = async () => {
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
        //         setUsername(userData?.name);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // };
        // fetchUser();
    }, []);

    // const handleInputChange = (value: string) => {
    //     setTeamCode(value);
    // };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (!teamCode) {
    //         toast("Whoops!", {
    //             description: "Team code is required.",
    //         });
    //         return;
    //     }

        // try {
        //     const {
        //         data: { user },
        //         error: userError,
        //     } = await supabase.auth.getUser();
        //     if (userError) {
        //         console.error(userError);
        //         return;
        //     }
        //     const { data: userData, error: userDataError } = await supabase
        //         .from("Users")
        //         .select("*")
        //         .eq("user_id", user?.id)
        //         .single();
        //     if (userDataError) {
        //         console.error(userDataError);
        //         return;
        //     }
        //     if (userData?.team_id) {
        //         toast("Uh oh!", {
        //             description: "You are already part of a team.",
        //         });
        //         return;
            // }

            // const { data: memberCount, error: memberCountError } = await supabase.rpc('count_team_members', { team_id_input: teamCode });
            // console.log("memberCount", memberCount);
            // if (memberCountError) {
            //     console.error("Error joining team", memberCountError);
            //     toast("Whoops!", {
            //         description: "Error joining team. Please try again.",
            //     });
            //     return;
            // }

            // if (memberCount && memberCount >= 5) {
            //     toast("Maximum capacity reached!", {
            //         description: "Team already has maximum number of members in it.",
            //     });
            //     return;
            // }

            // const { error } = await supabase
            //     .from("Users")
            //     .update({ team_id: teamCode })
            //     .eq("user_id", user?.id);
            // if (error) {
            //     console.error("Error joining team", error);
            //     toast("Whoops!", {
            //         description: "Error joining team. Please try again.",
            //     });
            //     return;
            // }
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
   

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-nhg  p-2 ">
            <NavBar userName={userName} />
            <div className="flex self-start ml-4  cursor-pointer my-4 justify-center items-center">
                <img src="/Vector-2.png" alt="Logo" style={{ width: '15px', aspectRatio: '13 / 10' }} />
                <a href="/" className="text-neutral-500 text-sm self-center pl-2 hover:text-white transition-[1s] ">GO BACK</a>
            </div>
            <h1 className="md:text-5xl text-3xl  mb-4 md:mb-0 md:ml-0 gradient-text  w-full text-left font-thin md:text-center">Complete your Application</h1>
            <div className="min-h-[30vh] flex flex-col justify-center items-center  pt-40  ">

             <div className="flex flex-col my-50  ">
                    <Button className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg  hover:bg-gray-300 transition duration-300 " onClick={() => window.location.href = '/create-team'}>
                    Create Team
                </Button>
                <GradientLine />
                 <Button className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg  hover:bg-gray-300 transition duration-300 " onClick={() => window.location.href = '/join-team'}>
                    Join a Team
                </Button>
            </div>

                </div>
 
           
           </div>
    );
};

export default Create_JoinTeam;
