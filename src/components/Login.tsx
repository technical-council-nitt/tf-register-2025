import React from 'react';
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import axios from "axios";

const Login = () => {
    const handleLogin = async () => {
        try {
            const response = await axios.get(`http://${process.env['PROD-URL-BACKEND']}/auth/get-url`);
            console.log(response);
            window.location.href = response.data.url; // Redirect to Google OAuth consent screen
        } catch (error) {
            console.error('Error getting OAuth URL:', error);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <nav className="flex justify-between items-center p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold">Transfinitte</h1>
            </nav>

            <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
                <div className="w-full max-w-md space-y-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Login to your account</h2>
                    <p className="text-sm md:text-base text-gray-400">
                        Sign in with your Google account to participate in TransfiNITTe 2024 Hackathon.
                    </p>
                    <Button
                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                        onClick={handleLogin}
                    >
                        <span>Login with Google</span>
                        <ArrowUpRight className="h-5 w-5" />
                    </Button>
                </div>
            </main>
        </div>
    );
}

export default Login;