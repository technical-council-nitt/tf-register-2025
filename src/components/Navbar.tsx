import { supabase } from "@/utiils/supabase";
// import { Avatar, AvatarFallback } from "./ui/avatar";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "./ui/dropdown-menu";
// import {
//     Tooltip,
//     TooltipProvider,
//     TooltipTrigger,
// } from "./ui/tooltip";
import React from "react";

type NavBarProps = {
    userName?: string;
};

const NavBar: React.FC<NavBarProps> = ({ userName }) => {

    // const handleOptionClick = async (option: string) => {
    //     if (option === "Profile") {
    //         window.location.href = "/profile";
    //     } else if (option === "Logout") {
    //         await supabase.auth.signOut();
    //         window.location.href = "/login";
    //     }
    // };

    // const getFirstLetter = (name: string | undefined) => {
    //     return name ? name.charAt(0).toUpperCase() : "";
    // };

    return (
        <nav className="flex justify-between items-center p-4 md:p-6 border-b-[1px] border-neutral-800 max-h-[64px] font-nhg ">
            <img
                src="/tf badge.svg"
                alt="Logo"
                style={{ width: "40px", aspectRatio: "63 / 29" }}
                className="md:hidden block"
            />
            <img
                src="/tf badge.svg"
                alt="Logo"
                style={{ width: "120px", aspectRatio: "155 / 20" }}
                className="md:block hidden"
            />
            {/* <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar
                                    className="cursor-pointer bg-[#1a1a1a] border border-gray-600"
                                >
                                    <AvatarFallback className="bg-[#1a1a1a] text-white">
                                        {getFirstLetter(userName)}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 relative r-16">
                                <DropdownMenuLabel className="text-normal">
                                    Hi, {userName}
                                </DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOptionClick("Profile")}>
                                    Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500" onClick={() => handleOptionClick("Logout")}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TooltipTrigger>
                </Tooltip>
            </TooltipProvider> */}
        <div className="relative rounded-[4px] p-[1px] bg-gradient-to-r from-[#ff31ad] to-[#a259ff] ">
  <div className="bg-black rounded-[4px] w-full h-full px-2 text-[10px]  md:text-[15px]">
    Registration
  </div>
</div>
        </nav>
    );
};

export default NavBar;
