import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Copy, Loader2 } from "lucide-react";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";
import { IoExitOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
// import { timeStamp } from "console";
const problem_statements = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
];
const domains = [
  { value : "software" , label:"software" },
  { value : "hardware" , label:"hardware" },
  { value : "management" , label:"management" },
  { value : "entrepreneurship", label:"entrepreneurship" },
];


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
  problem_statement:string;
  domain:string;
};



const Dashboard = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userName, setUsername] = useState<string | undefined>(undefined);
  const [isLead, setIsLead] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();
  const schema = z.object({
    // teamName: z.string().min(1, "Name is required"),
    // rollNumber: z.string().length(9, "Roll Number must be exactly 9 digits").regex(/^\d+$/, "Roll Number must contain only digits"),
    // personalEmail: z.string().email("Invalid email address"),
    // hostel: z.string().nonempty("Hostel is required"),
    // gender: z.string().nonempty("Gender is required"),
    timeStamp: z.string(),
    file: z.any().refine((fileList) => fileList && fileList.length === 1, "File is required"),
  });

  const psschema = z.object({
    problem_statement: z.string().nonempty("Problem Statement is required"),
    domain: z.string().nonempty("Domain is required"),
  });
  //  const testUpload = async () => {
  //   const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
  //   const { data, error } = await supabase.storage
  //     .from('midreview_bucket')
  //     .upload('test.txt', testFile);
      
  //   console.log('Test upload:', { data, error });
  // };

  // // Call it in useEffect to test immediately when component loads
  // useEffect(() => {
  //   setIsLoading(true);
  //   const fetchDetails = async () => {
  //     // ... your existing fetchDetails code

  //     // Add this line at the end of fetchDetails
  //     await testUpload(); // Test the upload
  //   };
  //   fetchDetails();
  // }, []);
  const form = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        teamName: "",
        timeStamp: "",
        file: null,
      },
    });

  const psform =  useForm({
    resolver:zodResolver(psschema),
    defaultValues : {
      problem_statement : "",
      domain : "",
    }
  })
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
          .from("users")
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
        // form.reset({
        //   name: userData?.name || "",
        //   rollNumber: userData?.roll_number || "",
        //   personalEmail: user?.email || userData?.email || "",
        //   hostel: userData?.hostel || "",
        //   gender: userData?.gender || "",
        //   mess: userData?.mess || "",
        // });
        const { data: team, error: e } = await supabase
          .from("teams")
          .select(
            `
          *,
          members: users(*)
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
    // await testUpload();
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
        .from("teams")
        .select("team_id")
        .eq("team_id", teamId);

      if (!data || data.length === 0) {
        isUnique = true;
      }
    }

    return teamId;
  };

 const onSubmitps = async(data  : any) => {
    const { error } = await supabase.auth.getUser();
      if(error) {
        console.error("Error fetching user details:", error);
        return;
      }

      const { error : pserror} = await supabase
      .from("teams")
      .update({
        problem_statement : data.problem_statement,
        domain : data.domain,
      })
      .eq("team_id", team?.team_id);
      if (pserror) {
        console.error("Submission ps error:", pserror);
        return;
      }

      if (team) {
        setTeam({
          ...team,
          problem_statement: data.problem_statement,
          domain: data.domain,
        });
      }
 }
 const onSubmit = async (data: any) => {
    // try {
      const { error } = await supabase.auth.getUser();
      if(error) {
        console.error("Error fetching user details:", error);
        return;
      }

    const file = data.file[0];
    const filename = `midreview/${team?.domain}/${team?.problem_statement}/${team?.name}`;

    const { data : uploadData, error: uploadError} = await supabase.storage.from("midreview_bucket").upload(filename,file, {
      upsert: true
    });
    if(uploadError){
      console.error("File upload error", uploadError);
      return;
    }
     const { error: dbError } = await supabase
    .from("midreviewsubmissions")
    .insert([{
      // team_id: data.team_id,
      team_name: team?.name,
      // comments: data.comments,
      timestamp: new Date().toISOString(),
      file_path: uploadData.path,
      domain: team?.domain,
      problem_statement : team?.problem_statement,
    }]);
    if (dbError) {
    console.error("Submission DB error:", dbError);
    return;
  }
  };
  const handleGenerateNewTeamId = async () => {
    const newTeamId = await generate_team_id();

    if (team && isLead) {
      const { error } = await supabase
        .from("teams")
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
          .from("users")
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
          .from("teams")
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
      <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="text-white p-6 rounded-lg shadow-md w-full space-y-2 mt-6"
                  >
                    {/* First Name */}
                    {/* <FormField
                      name="teamName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Full Name" {...field} className="bg-[#1a1a1a] border border-gray-600 mt-0 rounded-md p-2" />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    /> */}

                    {/* Roll Number */}
                    <FormField
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload File</FormLabel>
                          <FormControl>
                            <Input type="file" accept=".ppt,.pptx" onChange={e => field.onChange(e.target.files)} placeholder="Enter Roll Number" className="bg-[#1a1a1a] border mt-0 border-gray-600 rounded-md p-2" />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Personal Email
                    <FormField
                      name="personalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your personal email" {...field} className="bg-[#1a1a1a] mt-0 border border-gray-600 rounded-md p-2" disabled />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    /> */}

                    {/* Hostel */}
                    {/* <FormField
                      name="hostel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hostel</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Enter your hostel name" {...field} className="bg-[#1a1a1a] mt-0 border border-gray-600 rounded-md p-2" />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    /> */}

                    {/* Mess */}
                    {/* <FormField
                      name="mess"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mess</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Enter your Mess name" {...field} className="bg-[#1a1a1a] border mt-0 border-gray-600 rounded-md p-2" />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    /> */}

                    {/* Gender (Select) */}
                    {/* <FormField
                      name="problem_statement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem Statement</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-[#1a1a1a] border border-gray-600 rounded-md">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                {problem_statements.map((problem_statement) => (
                                  <SelectItem key={problem_statement.value} value={problem_statement.value}>
                                    {problem_statement.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    /> */}
                    <div className="w-full flex md:flex-row-reverse">
                      <Button type="submit" className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg font-bold hover:bg-gray-300 transition duration-300">
                        Proceed
                      </Button>
                    </div>
                  </form>
                </Form>
                <Form {...psform}>
                  <form
                    onSubmit={psform.handleSubmit(onSubmitps)}
                    className="text-white p-6 rounded-lg shadow-md w-full space-y-2 mt-6"
                  >
                    <FormField
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-[#1a1a1a] border border-gray-600 rounded-md">
                                <SelectValue placeholder="Select Domain" />
                              </SelectTrigger>
                              <SelectContent>
                                {domains.map((domain) => (
                                  <SelectItem key={domain.value} value={domain.value}>
                                    {domain.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="problem_statement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem Statement</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-[#1a1a1a] border border-gray-600 rounded-md">
                                <SelectValue placeholder="Select Problem Statement" />
                              </SelectTrigger>
                              <SelectContent>
                                {problem_statements.map((problem_statement) => (
                                  <SelectItem key={problem_statement.value} value={problem_statement.value}>
                                    {problem_statement.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <div className="w-full flex md:flex-row-reverse">
                      <Button type="submit" className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg font-bold hover:bg-gray-300 transition duration-300">
                        Proceed
                      </Button>
                    </div>
                  </form>
                </Form>
      </div>
      
    );
  };

  export default Dashboard;
