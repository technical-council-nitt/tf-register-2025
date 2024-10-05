import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Copy, Loader2 } from "lucide-react";

type TeamMember = {
  name: string;
  email: string;
  rollnumber: string;
  pfp: string;
};

type Team = {
  name: string;
  uniqueId: string;
  members: TeamMember[];
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
    setIsLoading(true);
    axios.get(`http://${import.meta.env.VITE_PROD_URL_BACKEND}/auth/is-logged-in`, { withCredentials: true })
      .then(response => {
        console.log("Logged: ", response.data)
        setUsername(response.data.username);
        return axios.get(`http://${import.meta.env.VITE_PROD_URL_BACKEND}/team/${teamId}`, { withCredentials: true });
      })
      .then((response) => {
        console.log("Team data fetched successfully:", response.data);
        setTeam(response.data.team);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        setAlertMessage("Error fetching team data. Please try again.");
      });
  }, [teamId]);

  const getFirstLetter = (name: string | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setAlertMessage("Team ID copied to clipboard!");
      setTimeout(() => setAlertMessage(null), 3000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setAlertMessage("Failed to copy Team ID. Please try again.");
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl"></p>
      </div>
    );
  }

  if (!team) {
    return <div className="flex justify-center items-center h-screen text-white">Team not found</div>;
  }

  console.log("Team: ",team)

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center p-4 md:p-6">
      <img src="/motif.svg" alt="Logo" style={{ width: '40px', aspectRatio: '63 / 29' }} className="md:hidden block" />
      <img src="/motif-desk.svg" alt="Logo" style={{ width: '120px', aspectRatio: '155 / 20' }} className="md:block hidden" />
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

      <main className="flex-grow flex flex-col items-center px-4 md:px-6 pt-8">
        <div style={{
          backgroundImage: `url('/team-card.svg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // height: '216px',
          width: '100%',
          aspectRatio: '343 / 216',
          position: "relative",
        }}>
          <h2 className="text-md md:text-md font-geist absolute bottom-0 left-0 p-6">{team.name}</h2>
          <div className="absolute bottom-0 right-0 p-6 pb-4">
                {team.paymentStatus !== "not paid" ? (
                  <span className="text-green-400 font-semibold">{team.paymentStatus}</span>
                ) : (
                  <Button
                    className="bg-white text-black rounded-[120px] font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                    onClick={() => navigate(`/${team.uniqueId}/pay`)}
                  >
                    <img src="/pay.svg" />
                  </Button>
                )}
              </div>
        </div>
        <div className="w-full max-w-md space-y-6 pt-3 mt-4">
          <h1 className="font-spacegrotesk text-3xl font-medium space-y-2">Dashboard</h1>
        </div>
        <div className="w-full max-w-md space-y-6 pt-8">
          {alertMessage && (
            <Alert className="bg-green-500 text-white p-4 rounded-lg">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <ul className="space-y-2">
                {team.members.map((member, index) => {
                  console.log(member.pfp)
                  return (
                    <li key={index} className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={member.pfp} height={10} width={10} />
                        <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-white text-[16px]">{member.name}</span>
                        <span className="text-white text-[12px] opacity-60">{member.rollnumber}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Payment Status:</span>
            </div>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;