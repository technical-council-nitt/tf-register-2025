import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Copy, Loader2 } from "lucide-react";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";
import { IoExitOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VscDebugRestart } from "react-icons/vsc";
import { toast } from "sonner";

type TeamMember = {
  user_id: string;
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
  leader_user_id: string;
};

const Dashboard = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userName, setUsername] = useState<string | undefined>(undefined);
  const [isLead, setIsLead] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchDetails = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) {
          console.error(userError);
          window.location.href = "/login";
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
        console.log(user);
        setUserInfo(user);
        setUsername(userData?.name);
        const { data: team, error: e } = await supabase
          .from("Teams")
          .select(
            `
          *,
          members: Users(*)
        `
          )
          .eq("team_id", teamId)
          .single();
        if (e) {
          console.error("Error fetching team:", e);
          return;
        }
        if (team.leader_user_id === user?.id) {
          setIsLead(true);
        }
        setTeam(team);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handlePay = () => {
    if(team?.members.length && team.members.length < 4) {
      toast("Whoops!", {
          description: "You need at least 4 members in your team to submit payment.",
        });
      return;
    }
  }

  const generate_team_id = async () => {
    let teamId;
    let isUnique = false;

    while (!isUnique) {
      teamId = Math.floor(100000 + Math.random() * 900000).toString();

      const { data } = await supabase
        .from("Teams")
        .select("team_id")
        .eq("team_id", teamId);

      if (!data || data.length === 0) {
        isUnique = true;
      }
    }

    return teamId;
  };

  const handleGenerateNewTeamId = async () => {
    const newTeamId = await generate_team_id();

    if (team && isLead) {
      const { error } = await supabase
        .from("Teams")
        .update({ team_id: newTeamId })
        .eq("team_id", team.team_id);

      if (error) {
        console.error("Error generating new team ID: ", error);
        return;
      }
      
      setTimeout(() => {
        window.location.href = `/team/${newTeamId}`;
      }, 1000);
      window.location.href = `/team/${newTeamId}`;
    }
  }


    const handleLeaveTeam = async () => {
      if (team) {
        const { error } = await supabase
          .from("Users")
          .update({ team_id: null })
          .eq("user_id", userInfo.id);

        if (error) {
          console.error("Error leaving team: ", error);
          return;
        }

        navigate("/");
      }
    }

    const handleDiscardTeam = async () => {
      if (!isLead) {
        return;
      }
      if (team) {
        const { error } = await supabase
          .from("Teams")
          .delete()
          .eq("team_id", team.team_id);

        if (error) {
          console.error("Error discarding team: ", error);
          return;
        }

        navigate("/");
      }
    }

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text).then(
        () => {
          toast("Copied!", {
            description: "Team ID copied to clipboard.",
          });
        },
        (err) => {
          console.error("Could not copy text: ", err);
          toast("Whoops!", {
            description: "Could not copy team ID to clipboard.",
          });
        }
      );
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
      return (
        <div className="flex justify-center items-center h-screen text-white">
          Team not found
        </div>
      );
    }

    console.log("Team: ", team);

    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <NavBar userName={userName} />

        <div className="flex flex-col justify-between h-full flex-grow">
          <div className="flex-grow flex flex-col lg:flex-row-reverse lg:justify-between items-center lg:items-start px-4 md:px-6 pt-8">
            <div
              className="lg:w-[40%] md:w-1/2 w-full"
              style={{
                backgroundImage: `url('/team-card.svg')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                aspectRatio: "343 / 216",
                position: "relative",
              }}
            >
              <h2 className="text-[1.4em] font-semibold absolute bottom-0 left-0 p-[1em] md:p-[1.6em]">
                {team.name}
              </h2>
              <div className="absolute bottom-0 right-0 p-6 pb-4">
                {(team.payment_status === "Pending" ||
                  team.payment_status === "Failed") && (
                    <Button
                      className="bg-white text-black rounded-[120px] font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2"
                      onClick={handlePay}
                    >
                      <img src="/pay.svg" />
                    </Button>
                  )}
              </div>
            </div>
            <div className="lg:w-[60%] h-full lg:pr-8">
              <div className="w-full h-full pt-3 mt-4 flex flex-col">
                <h1 className="font-spacegrotesk text-3xl lg:text-5xl font-medium">
                  Dashboard
                </h1>
                <span className="text-neutral-500 pt-2">
                  Invite your teammates by sharing the team ID.{" "}
                </span>
              </div>
              <div className="h-full w-full space-y-6 pt-8">
                <div className="space-y-4 h-full w-full py-4 pb-8">
                  <div className="pb-8 w-full h-full flex flex-col justify-between">
                    <ul className="flex flex-wrap gap-6 w-full">
                      {team.members &&
                        team.members
                          .sort((a, _) => (a.user_id === team.leader_user_id ? -1 : 1))
                          .map((member, index) => {
                            return (
                              <li
                                key={index}
                                className="flex items-center space-x-2 w-full lg:bg-neutral-900 lg:rounded-lg lg:border-[1px] lg:border-neutral-600 lg:p-4 relative"
                              >
                                <Avatar>
                                  <AvatarImage src={member.pfp} height={10} width={10} />
                                  <AvatarFallback className="text-black">
                                    {member.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-white text-[16px]">{member.name} {index === 0 && "(Lead)"}</span>
                                  <span className="text-white text-[12px] opacity-60">
                                    {member.roll_number}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                    </ul>
                    <div>
                      {isLead ?
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="m-5 text-black hover:bg-neutral-400">
                              Discard Team <FaRegTrashAlt className="text-[16px] ml-2" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Discard Team</DialogTitle>
                              <DialogDescription>
                                Discarding this team will remove all members from the team and erase its traces from our servers. Are you sure you want to discard this team?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button type="submit" onClick={handleDiscardTeam}>Confirm</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        :
                        <Button variant="outline" className="m-5 text-black hover:bg-neutral-400" onClick={handleLeaveTeam}>
                          Leave Team <IoExitOutline className="text-xl ml-2" />
                        </Button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t-[1px] p-4 px-8 border-neutral-800">
            <div className="flex justify-between items-center">
              <span className="font-semibold w-full">
                Payment Status:{" "}
              </span>
              <span className="font-semibold w-full text-yellow-500 text-right">
                {team.payment_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Team ID:</span>
              <div className="flex items-center">
                <span>{team.team_id}</span>
                <Button
                  onClick={() =>
                    copyToClipboard(team.team_id)
                  }
                  className="ml-2 p-1 bg-transparent hover:bg-gray-700 rounded-full"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {isLead && <Button
                  onClick={handleGenerateNewTeamId}
                  className="ml-2 p-1 bg-transparent hover:bg-gray-700 rounded-full"
                >
                  <VscDebugRestart className="h-4 w-4" />
                </Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Dashboard;
