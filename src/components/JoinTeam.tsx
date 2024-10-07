import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowUpRight } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";

const JoinTeam = () => {
    const [teamCode, setTeamCode] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!teamCode) {
            setAlertMessage("Team code is required");
            return;
        }

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
            if (userData?.team_id) {
                setAlertMessage("You are already part of a team");
                return;
            }
            const { error } = await supabase
                .from("Users")
                .update({ team_id: teamCode })
                .eq("user_id", user?.id);
            if (error) {
                console.error("Error joining team", error);
                setAlertMessage("Error joining team");
                return;
            }
            setAlertMessage("Successfully joined team");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } catch (error) {
            console.error("Error joining team", error);
            setAlertMessage("Error joining team");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <NavBar userName={userName} />

            <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
                <div className="w-full max-w-md space-y-6 bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Join Team
                    </h2>
                    {alertMessage && (
                        <Alert className="bg-red-500 text-white p-4 rounded-lg">
                            <AlertDescription>{alertMessage}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="teamCode"
                                className="block text-sm font-medium text-gray-400"
                            >
                                Enter Team Code{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex justify-center">
                                <InputOTP
                                    value={teamCode}
                                    onChange={handleInputChange}
                                    maxLength={6}
                                >
                                    <InputOTPGroup className="flex space-x-2 justify-center">
                                        {Array.from(
                                            { length: 6 },
                                            (_, index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className="bg-[#2a2a2a] border border-gray-600 text-white w-12 h-12 text-center rounded-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            )
                                        )}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                        >
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
