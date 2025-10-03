import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/utiils/supabase";

const Login = () => {
    const handleLogin = async () => {
        try {
            supabase.auth.signInWithOAuth({
                provider: 'google',
            })
        } catch (error) {
            console.error('Error getting OAuth URL:', error);
        }
       
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <nav className="flex justify-between items-center p-4 md:p-6 border-b-[1px] border-neutral-800">
                <img src="/motif-desk2.svg" alt="Logo" style={{ width: '40px', aspectRatio: '63 / 29' }} className="md:hidden block" />
                <img src="/motif-desk2.svg" alt="Logo" style={{ width: '120px', aspectRatio: '155 / 20' }} className="md:block hidden" />
            </nav>

            <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
                <div className="w-full max-w-md space-y-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Login to your account</h2>
                    <p className="text-sm md:text-base text-gray-400">
                        Sign in with your Google account to participate in TransfiNITTe 2025 Hackathon.
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