import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Copy, Loader2 } from "lucide-react";
import { supabase } from "@/utiils/supabase";

type TeamMember = {
  name: string;
  email: string;
  roll_number: string;
  pfp: string;
};

type Team = {
  name: string;
  team_id: string;
  members: TeamMember[];
  payment_status: string;
  contact: string;
  leader: string;
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
    const fetchDetails = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error(userError);
          window.location.href = "/login";
          return;
        }
        const { data: userData, error: userDataError } = await supabase.from('Users').select('*').eq('user_id', user?.id).single();
        if (userDataError) {
          console.error(userDataError);
          return;
        }
        setUsername(userData?.name);
        const { data: team, error: e } = await supabase
          .from('Teams')
          .select(`
          *,
          members: Users(*)
        `)
          .eq('team_id', teamId)
          .single();
        if (e) {
          console.error('Error fetching team:', e);
          return;
        }
        setTeam(team);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    fetchDetails();
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

  console.log("Team: ", team)

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <nav className="flex lg:max-h-[64px] justify-between items-center p-4 md:p-6 border-b-[1px] border-neutral-800">
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

      <div className="flex-grow flex flex-col justify-between h-full">
        <div className="flex-grow flex flex-col lg:flex-row-reverse lg:justify-between items-center lg:items-start px-4 md:px-6 pt-8">
          <div
            className="lg:w-[40%] md:w-1/2 w-full"
            style={{
              backgroundImage: `url('/team-card.svg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              aspectRatio: '343 / 216',
              position: "relative",
            }}
          >
            <h2 className="text-[1.4em] font-geist absolute bottom-0 left-0 p-[1em] md:p-[1.6em] max-w-[50%]">{team.name}</h2>
            <div className="absolute bottom-0 right-0 p-6 pb-4">
              {(team.payment_status === "Pending" || team.payment_status === "Failed") && team.members.length >= 4 && team.members.length <= 5 &&
                <Button
                  className="bg-white text-black rounded-[120px] font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2"
                  onClick={() => navigate(`/${team.team_id}/pay`)}
                >
                  <img src="/pay.svg" />
                </Button>}
            </div>
          </div>
          <div className="lg:w-[60%] lg:pr-8">
            <div className="w-full pt-3 mt-4 flex flex-col">
              <h1 className="font-spacegrotesk text-3xl lg:text-5xl font-medium">Dashboard</h1>
              <span className="text-neutral-500 pt-2">Invite your teammates by sharing the team ID. </span>
            </div>
            <div className="w-full space-y-6 pt-8">
              {alertMessage && (
                <Alert className="bg-green-500 text-white p-4 rounded-lg">
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 w-full py-4 pb-8">
                <div className="pb-8 w-full">
                  <ul className="flex flex-wrap gap-6 w-full">
                    {team.members && team.members.map((member, index) => {
                      console.log(member.pfp)
                      return (
                        <li key={index} className="flex items-center space-x-2 w-full lg:bg-neutral-900 lg:rounded-lg lg:border-[1px] lg:border-neutral-600 lg:p-4">
                          <Avatar>
                            <AvatarImage src={member.pfp} height={10} width={10} />
                            <AvatarFallback className="text-black">{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-white text-[16px]">{member.name}</span>
                            <span className="text-white text-[12px] opacity-60">{member.roll_number}</span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8 w-full py-4 border-t-[1px] border-neutral-800">
          {team.members.length >= 4 && team.members.length <= 5 && (team.payment_status === "Pending" || team.payment_status === "Failed") ?
            <div className="text-green-400 py-4">Minimum criteria of members met. Please proceed with payment.</div>
            : team.members.length < 4 || team.members.length > 5 ?
              <div className="text-yellow-400">Minimum criteria of members per team not met. Invite your teammates to make the payment.</div>
              : <></>
          }
          <div className="flex justify-between items-center">
            <span className="font-semibold w-full">Payment Status: </span>
            <span className="font-semibold w-full text-right">{team.payment_status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Team ID:</span>
            <div className="flex items-center">
              <span>{team.team_id}</span>
              <Button
                onClick={() => copyToClipboard(team.team_id)}
                className="ml-2 p-1 bg-transparent hover:bg-gray-700 rounded-full"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;