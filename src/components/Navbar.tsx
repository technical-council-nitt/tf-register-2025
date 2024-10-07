import { Avatar, AvatarFallback } from "./ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import React, { useState } from "react";

type NavBarProps = {
    userName?: string;
};

const NavBar: React.FC<NavBarProps> = ({ userName }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleOptionClick = (option: string) => {
        if (option === "Profile") {
            window.location.href = "/profile";
        } else if (option === "Logout") {
            window.location.href = "/logout";
        }
        setIsDropdownOpen(false);
    };

    const getFirstLetter = (name: string | undefined) => {
        return name ? name.charAt(0).toUpperCase() : "";
    };

    return (
        <nav className="flex justify-between items-center p-4 md:p-6 border-b-[1px] border-neutral-800">
            <img
                src="/motif.svg"
                alt="Logo"
                style={{ width: "40px", aspectRatio: "63 / 29" }}
                className="md:hidden block"
            />
            <img
                src="/motif-desk.svg"
                alt="Logo"
                style={{ width: "120px", aspectRatio: "155 / 20" }}
                className="md:block hidden"
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative">
                            <Avatar
                                className="cursor-pointer bg-[#1a1a1a] border border-gray-600"
                                onClick={toggleDropdown}
                            >
                                <AvatarFallback className="bg-[#1a1a1a] text-white">
                                    {getFirstLetter(userName)}
                                </AvatarFallback>
                            </Avatar>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                                    <ul className="py-1">
                                        <li
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            onClick={() =>
                                                handleOptionClick("Profile")
                                            }
                                        >
                                            Edit Profile
                                        </li>
                                        <li
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            onClick={() =>
                                                handleOptionClick("Logout")
                                            }
                                        >
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Profile</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </nav>
    );
};

export default NavBar;
