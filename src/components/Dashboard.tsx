import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ArrowUpRight, Copy, Loader2 } from "lucide-react"; // Import Loader2 for loading UI

type Team = {
  name: string;
  uniqueId: string;
  members: string[];
  paymentStatus: string;
  contactNumber: string;
  leaderName: string;
};

const Dashboard = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userName, setUsername] = useState<string | undefined>(undefined);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true); // Start loading
    axios.get(`http://${process.env['PROD-URL-BACKEND']}/auth/is-logged-in`, { withCredentials: true })
      .then(response => {
        setUsername(response.data.username);
        return axios.get(`http://${process.env['PROD-URL-BACKEND']}/team/${teamId}`, { withCredentials: true });
      })
      .then((response) => {
        console.log("Team data fetched successfully:", response.data);
        setTeam(response.data.team);
        setIsLoading(false); // Stop loading after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Stop loading on error
        setAlertMessage("Error fetching team data. Please try again.");
      });
  }, [teamId]);

  const getFirstLetter = (name: string | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setAlertMessage("Team ID copied to clipboard!");
      setTimeout(() => setAlertMessage(null), 3000); // Clear message after 3 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
      setAlertMessage("Failed to copy Team ID. Please try again.");
    });
  };

  if (isLoading) {
    // Loading screen using Loader2
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!team) {
    return <div className="flex justify-center items-center h-screen text-white">Team not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold">Transfinitte</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                className="cursor-pointer bg-[#1a1a1a] border border-gray-600"
                onClick={() => window.location.href = "/profile"}
              >
                <AvatarFallback className="bg-[#1a1a1a] text-white">{getFirstLetter(userName)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>

      <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
        <div className="w-full max-w-md space-y-6 bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-center">{team.name}</h2>
          {alertMessage && (
            <Alert className="bg-green-500 text-white p-4 rounded-lg">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Team ID:</span>
              <div className="flex items-center">
                <span>{team.uniqueId}</span>
                <Button
                  onClick={() => copyToClipboard(team.uniqueId)}
                  className="ml-2 p-1 bg-transparent hover:bg-gray-700 rounded-full"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Team Members:</h3>
              <ul className="list-disc list-inside space-y-1">
                {team.members.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Payment Status:</span>
              {team.paymentStatus !== "not paid" ? (
                <span className="text-green-400 font-semibold">{team.paymentStatus}</span>
              ) : (
                <Button
                  className="bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                  onClick={() => navigate(`/${team.uniqueId}/pay`)}
                >
                  <span>Pay Now</span>
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
