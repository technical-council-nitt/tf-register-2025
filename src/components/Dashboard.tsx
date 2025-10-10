import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { load, CashfreeInstance } from "@cashfreepayments/cashfree-js";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Copy, Loader2 } from "lucide-react";
import { supabase } from "@/utiils/supabase";
import NavBar from "./Navbar";
import { IoExitOutline } from "react-icons/io5";
import { FaGlobe, FaLock, FaRegTrashAlt } from "react-icons/fa";
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
// import { set } from "animejs";

//import { set } from "animejs";
// import { timeStamp } from "console";
let problem_statements = [
  { value: "BS1 - McKinsey & Company", label: "BS1 - McKinsey & Company",domain:"management" },
  { value: "BCG Case Study", label: "BCG Case Study",domain:"management" },
  { value: "BOSCH - Smart Power Management Module", label: "BOSCH - Smart Power Management Module",domain:"hardware" },
   { value: "BHEL - PS01", label: "BHEL - PS01",domain:"hardware" },
  { value: "BHEL - Problem Statement 2", label: "BHEL - Problem Statement 2",domain:"hardware" },
  { value: "ZeroWings - Buck Converter", label: "ZeroWings - Buck Converter",domain:"hardware" },
  { value: "JCB - Quick-Hitch Problem Statement", label: "JCB - Quick-Hitch Problem Statement",domain:"hardware" },
  { value: "OptiSol - Problem Statement 1", label: "OptiSol - Problem Statement 1",domain:"software" },
    { value: "OptiSol - AI Powered Workflow Automation", label: "OptiSol - AI Powered Workflow Automation",domain:"software" },
        { value: "OptiSol - Problem Statement 2", label: "OptiSol - Problem Statement 2",domain:"software" },
         { value: "ZeroWings - Thermal Human Detection", label: "ZeroWings - Thermal Human Detection",domain:"software" },
          { value: "ZeroWings - Concrete Crack Detection", label: "ZeroWings - Concrete Crack Detection",domain:"software" },
           { value: "ZeroWings - Agriculture Drone", label: "ZeroWings - Agriculture Drone",domain:"software" },
            { value: "ZeroWings - Operation Lifeline", label: "ZeroWings - Operation Lifeline",domain:"software" },
  { value: "DARE 2 DREAM Problem Statement", label: "DARE 2 DREAM Statement",domain:"entrepreneurship" },
   { value: "Stealth AI-Problem Statement", label: "Stealth AI  - Problem Statement",domain:"software" },

  { value: "CEDI - Under NAVIYA", label: "CEDI - Under NAVIYA",domain:"entrepreneurship" },
  { value: "RVC - Track Based Problem Statement", label: "RVC - Track Based Problem Statement",domain:"entrepreneurship" },


];
const domains = [
  { value: "software", label: "software" },
  { value: "hardware", label: "hardware" },
  { value: "management", label: "management" },
  { value: "entrepreneurship", label: "entrepreneurship" },
];
const foodPreferences = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non-vegetarian", label: "Non-Vegetarian" },
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
  problem_statement: string;
  domain: string;
  ispublic: boolean;
};

interface Order {
  payment_session_id: string;
  [key: string]: any; // for other fields returned by your backend
}

const Dashboard = () => {
  const [filteredPS, setFilteredPS] = useState(problem_statements);
  const [food, setFood] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [click, setClick] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const cashfreeRef = useRef<CashfreeInstance | null>(null);
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userName, setUsername] = useState<string | undefined>(undefined);
  const [isLead, setIsLead] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [paymentCount, setPaymentCount] = useState<number>(0);

  const navigate = useNavigate();
  // const schema = z.object({
  // teamName: z.string().min(1, "Name is required"),
  // rollNumber: z.string().length(9, "Roll Number must be exactly 9 digits").regex(/^\d+$/, "Roll Number must contain only digits"),
  // personalEmail: z.string().email("Invalid email address"),
  // hostel: z.string().nonempty("Hostel is required"),
  // gender: z.string().nonempty("Gender is required"),
  //   timeStamp: z.string(),
  //   file: z.any().refine((fileList) => fileList && fileList.length === 1, "File is required"),
  // });

  const psschema = z.object({
    problem_statement: z.string().optional(),
    domain: z.string().nonempty("Domain is required"),
  });
   const foodschema = z.object({
    food: z.string().nonempty("Food preference is required"),
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

  // const form = useForm({
  //   resolver: zodResolver(schema),
  //   defaultValues: {
  //     teamName: "",
  //     timeStamp: "",
  //     file: null,
  //   },
  // });

  const handleMakePublic = async () => {
    setClick(true);

    if (!team) return;
    const { error } = await supabase
      .from("teams")
      .update({ ispublic: true })
      .eq("team_id", team.team_id);
    if (error) {
      console.error("Error making team public:", error);
      return;
    }
    setTeam((prev) => (prev ? { ...prev, ispublic: true } : null));
  };
  const handleMakePrivate = async () => {
    setClick(true);
    if (!team) return;
    const { error } = await supabase
      .from("teams")
      .update({ ispublic: false })
      .eq("team_id", team.team_id);
    if (error) {
      console.error("Error making team private:", error);
      return;
    }
    setTeam((prev) => (prev ? { ...prev, ispublic: false } : null));
  };
  const psform = useForm({
    resolver: zodResolver(psschema),
    defaultValues: {
      problem_statement: "",
      domain: "",
    }
  })
  const foodform = useForm({
    resolver: zodResolver(foodschema),
    defaultValues: {
      food: "",
     
    }
  })

   const foodValue = foodform.watch('food');
  useEffect(() => {
    if (foodValue) {
      foodform.handleSubmit(onSubmitFood)();
    }
  }, [foodValue])
  const domainValue = psform.watch('domain');
  useEffect(() => {
    if (domainValue) {
      psform.handleSubmit(onSubmitps)();
    }
  }, [domainValue])
 const psValue = psform.watch('problem_statement');
  useEffect(() => {
    if (psValue) {
      psform.handleSubmit(onSubmitps)();
    }
  }, [psValue])

  useEffect(() => {
    if (team) {
      psform.reset({
        problem_statement: team.problem_statement || "",
        domain: team.domain || "",
      });
    }
  }, [team]);
  
    useEffect(() => {
    if (food) {
      foodform.reset({
        food: food || "",
      });
    }
  }, [food]);


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
        setUserId(userData?.user_id);
        setFood(userData?.food);
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

    const fetchPaymentStatus = async () => {
      const { data: paymentData, error: paymentError } = await supabase
        .from("teams")
        .select("payment_status")
        .eq("team_id", teamId)
        .single();

      if (paymentError) {
        console.error(paymentError);
        return;
      }

      return { paymentData };
    }

    // problem_statements.filter((e)=>{
    //   return (e.domain.toLowerCase() == team?.domain.toLowerCase())
    // })

    fetchDetails();
    fetchPaymentStatus();
  }, [teamId]);

  useEffect(() => {
    const watchedDomain = psform.getValues("domain") || psform.watch("domain");
    const currentDomain = (watchedDomain as string) || team?.domain || "";

    if (currentDomain) {
      const lower = currentDomain.toLowerCase();
      setFilteredPS(
        problem_statements.filter((ps) => (ps.domain || "").toLowerCase() === lower)
      );
    } else {
      setFilteredPS(problem_statements);
    }
  }, [team?.domain, psform]);
   

  const init = async (): Promise<Order | undefined> => {
    try {
      // Initialize Cashfree SDK
      console.log("Initializing Cashfree SDK...");
      cashfreeRef.current = await load({ mode: "production" });
      console.log("Cashfree SDK initialized successfully");

      // Call your backend to create order
      const backendUrl = `${import.meta.env.VITE_PROD_URL_BACKEND}/api/checkout`;
      console.log("Calling backend API:", backendUrl);
      console.log("Environment variable VITE_PROD_URL_BACKEND:", import.meta.env.VITE_PROD_URL_BACKEND);

      const requestBody = {
        userId: teamId,
        teamName: "team-name",
        teamId: teamId,
      };
      console.log("Request body:", requestBody);

      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Backend API response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: Order = await res.json();
      console.log("Backend API response data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error; // Re-throw to see the full error
    }
  };
  const Payment = () => {



    useEffect(() => {
      const fetchSuccessCount = async () => {

        const { count } = await supabase
          .from('teams')
          .select('*', { count: 'exact' })
          .eq('payment_status', 'PAID');
        if (count !== null) {

          setPaymentCount(count);
          console.log('Number of successful payments:', count + 50);

        }
      };
      fetchSuccessCount();
    }, []);
  }
  Payment();

  const handlePay = async (): Promise<void> => {
    console.log("Handle pay called");
    console.log("Team members count:", team?.members?.length);
    console.log("Team data:", team);


    if (team?.members.length && team.members.length < 4) {
      console.log("❌ Payment blocked: Team has less than 4 members");
      toast("Whoops!", {
        description: "You need at least 4 members in your team to submit payment.",
      });
      return;
    }

    console.log("✅ Team has enough members, proceeding with payment...");
    const fetchedOrder = await init();
    if (fetchedOrder) {
      await doPayment(fetchedOrder);
    } else {
      console.error("❌ Failed to fetch order from backend");
    }
  };

  const doPayment = async (order: Order): Promise<void> => {
    if (!cashfreeRef.current) {
      console.error("Cashfree SDK not initialized yet");
      return;
    }

    if (!order.payment_session_id) {
      console.error("Order not ready yet");
      return;
    }

    const checkoutOptions = {
      paymentSessionId: order.payment_session_id,
      redirect: true,
      appearance: {
        width: "425px",
        height: "700px",
      },
    };

    try {
      const result = await cashfreeRef.current.checkout(checkoutOptions);

      if (result.error) {
        console.error("Payment error:", result.error);
      }

      if (result.redirect) {
        console.log("Payment will be redirected");
      }

      if (result.paymentDetails) {
        console.log("Payment completed:", result.paymentDetails);
        console.log(order);
        console.log("Payment completed:", result.paymentDetails.paymentMessage);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };
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

  const onSubmitps = async (data: any) => {
    console.log("called--------------------------------");
    const { error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user details:", error);
      return;
    }

    const { error: pserror } = await supabase
      .from("teams")
      .update({
        problem_statement: data.problem_statement,
        domain: data.domain,
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
    const onSubmitFood = async (data: any) => {
    console.log("called--------------------------------");
    const { error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user details:", error);
      return;
    }
    

    const { error: pserror } = await supabase
      .from("users")
      .update({
       food:data.food,
      })
      .eq("user_id", userId)
    if (pserror) {
      console.error("Submission ps error:", pserror);
      return;
    }

   
  }
  // const onMidReviewSubmit = async (data: any) => {
  //   // try {
  //   const { error } = await supabase.auth.getUser();
  //   if (error) {
  //     console.error("Error fetching user details:", error);
  //     return;
  //   }

  //   const file = data.file[0];
  //   const filename = `midreview/${team?.domain}/${team?.problem_statement}/${team?.name}-${team?.team_id}`;

  //   const { data: uploadData, error: uploadError } = await supabase.storage.from("midreview_bucket").upload(filename, file, {
  //     upsert: true
  //   });
  //   if (uploadError) {
  //     console.error("File upload error", uploadError);
  //     return;
  //   }
  //   const { data: existingRows, error: fetchError } = await supabase
  //     .from("midreviewsubmissions")
  //     .select("*")
  //     .eq("team_name", `${team?.name}-${team?.team_id}`);  // Use .eq("team_id", team?.id) if possible!

  //   if (fetchError) {
  //     console.error("Fetch error:", fetchError);
  //     return;
  //   }

  //   if (existingRows && existingRows.length > 0) {
  //     // Team already has a submission, update it
  //     const { error: updateError } = await supabase
  //       .from("midreviewsubmissions")
  //       .update({
  //         problem_statement: team?.problem_statement,
  //         domain: team?.domain,
  //         file_path: uploadData.path,
  //         timestamp: new Date().toISOString(),
  //       })
  //       .eq("team_name", `${team?.name}-${team?.team_id}`); // Use .eq('team_id', team?.id) if available

  //     if (updateError) {
  //       console.error("Update error:", updateError);
  //       return;
  //     }
  //     // Optionally, update file_path or other fields as needed
  //   } else {
  //     // No submission for this team, insert new
  //     const { error: dbError } = await supabase
  //       .from("midreviewsubmissions")
  //       .insert([{
  //         // team_id: data.team_id,
  //         team_name: `${team?.name}-${team?.team_id}`,
  //         // comments: data.comments,
  //         timestamp: new Date().toISOString(),
  //         file_path: uploadData.path,
  //         domain: team?.domain,
  //         problem_statement: team?.problem_statement,
  //       }]);
  //     if (dbError) {
  //       console.error("Submission DB error:", dbError);
  //       return;
  //     }
  //   }
  // };

  // const onFinalReviewSubmit = async (data: any) => {
  //   // try {
  //   const { error } = await supabase.auth.getUser();
  //   if (error) {
  //     console.error("Error fetching user details:", error);
  //     return;
  //   }

  //   const file = data.file[0];
  //   const filename = `finalreview/${team?.domain}/${team?.problem_statement}/${team?.name}-${team?.team_id}`;

  //   const { data: uploadData, error: uploadError } = await supabase.storage.from("midreview_bucket").upload(filename, file, {
  //     upsert: true
  //   });
  //   if (uploadError) {
  //     console.error("File upload error", uploadError);
  //     return;
  //   }
  //   const { data: existingRows, error: fetchError } = await supabase
  //     .from("finalreviewsubmissions")
  //     .select("*")
  //     .eq("team_name", `${team?.name}-${team?.team_id}`);  // Use .eq("team_id", team?.id) if possible!

  //   if (fetchError) {
  //     console.error("Fetch error:", fetchError);
  //     return;
  //   }

  //   if (existingRows && existingRows.length > 0) {
  //     // Team already has a submission, update it
  //     const { error: updateError } = await supabase
  //       .from("finalreviewsubmissions")
  //       .update({
  //         problem_statement: team?.problem_statement,
  //         domain: team?.domain,
  //         file_path: uploadData.path,
  //         timestamp: new Date().toISOString(),
  //       })
  //       .eq("team_name", `${team?.name}-${team?.team_id}`); // Use .eq('team_id', team?.id) if available

  //     if (updateError) {
  //       console.error("Update error:", updateError);
  //       return;
  //     }
  //     // Optionally, update file_path or other fields as needed
  //   } else {
  //     // No submission for this team, insert new
  //     const { error: dbError } = await supabase
  //       .from("finalreviewsubmissions")
  //       .insert([{
  //         // team_id: data.team_id,
  //         team_name: `${team?.name}-${team?.team_id}`,
  //         // comments: data.comments,
  //         timestamp: new Date().toISOString(),
  //         file_path: uploadData.path,
  //         domain: team?.domain,
  //         problem_statement: team?.problem_statement,
  //       }]);
  //     if (dbError) {
  //       console.error("Submission DB error:", dbError);
  //       return;
  //     }
  //   }
  // };

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
  console.log(import.meta.env.VITE_TEAM_CAP);
  console.log(paymentCount <= +import.meta.env.VITE_TEAM_CAP);
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <NavBar userName={userName} />
      {popUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 pr-0 w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-black">Proceeding to payment.</h2>
            <p className="mb-4 text-black">Please note that you will not be able to change the domain after payment.</p>
            <div className="flex justify-end items-center">
              <Button
                className="relative text-white text-sm font-bold"
                onClick={() => setPopUp(false)}

              >
                X
              </Button>
              <Button
                className="relative text-white text-sm font-bold mx-10"
                onClick={() => { setPopUp(false); handlePay(); }}
              >
                Proceed
              </Button>
            </div>

          </div>

        </div>
      )}
      <div className="flex flex-col justify-between h-full flex-grow">
        <div className="flex-grow flex flex-col lg:flex-row-reverse lg:justify-between items-center lg:items-start px-4 md:px-6 pt-8">
          <div className="flex-grow flex flex-col lg:flex-col  lg:justify-center lg:items-end md:items-center   ">
            <div
              className="lg:w-[100%] md:w-1/2 w-full"
              style={{
                backgroundImage: `url('/team-card2.svg')`,
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
                {((team.payment_status === "Pending" ||
                  team.payment_status === "Failed") && false && paymentCount <= +import.meta.env.VITE_TEAM_CAP && isLead) && (
                    <Button
                      className="bg-white text-black rounded-[120px] font-bold hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2"
                      onClick={() => setPopUp(true)}
                      disabled={!(isLead && psform.watch("domain"))}
                    >
                      <img src="/pay.svg" />
                    </Button>
                  )}
              </div>
            </div>
            <Form {...psform}>
              <form onSubmit={psform.handleSubmit(onSubmitps)}

                className="text-white  rounded-lg shadow-md lg:w-[100%]   md:w-[80vw] w-full space-y-2 mt-6 flex justify-center items-center  lg:justify-normal"
              >
                <div className='flex flex-col w-full'> 
                <FormField
                  name="domain" 
                  render={({ field }) => (
                    <FormItem className="lg:w-full">
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);

                          }}
                          value={field.value}
                          disabled={!(isLead && team.payment_status === "Pending")} // Disable if not lead or payment done

                        >
                          <SelectTrigger className="bg-[#1a1a1a] border border-gray-600 rounded-md w-[80vw] md:w-[40vw] lg:w-full">
                            <SelectValue placeholder={team.domain ? team.domain : "Select Domain"} />
                          </SelectTrigger>
                          <SelectContent className="w-[var(--radix-select-trigger-width)]">
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
                    <FormItem className="lg:w-full mt-5">
                      <FormLabel>Problem Statement</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);

                          }}
                          value={field.value}
                          disabled={!(import.meta.env.VITE_PSACTIVE)} // Disable if not lead or payment done

                        >
                          <SelectTrigger className="bg-[#1a1a1a] border border-gray-600  rounded-md w-[80vw] md:w-[40vw] lg:w-full">
                            <SelectValue placeholder={"Select Problem Statement"} />
                          </SelectTrigger>
                         <SelectContent>
                      {filteredPS.map((problem_statement) => (
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
                </div>

              </form>
            </Form>
             <Form {...foodform}>
              <form onSubmit={foodform.handleSubmit(onSubmitFood)}
                className="text-white  rounded-lg shadow-md lg:w-[100%]  md:w-[80vw] w-full space-y-2 mt-6 flex justify-center items-center  lg:justify-normal"
              >
                <div className='flex flex-col w-full'> 
                <FormField
                  name="food" 
                  render={({ field }) => (
                    <FormItem className="lg:w-full">
                      <FormLabel>Food Prefrence</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);

                          }}
                          value={field.value}
                          disabled={!(import.meta.env.VITE_PSACTIVE)}  // Disable if not lead or payment done

                        >
                          <SelectTrigger className="bg-[#1a1a1a] border border-gray-600 rounded-md w-[80vw] md:w-[40vw] lg:w-full">
                            <SelectValue placeholder={ "Select Food Preference"} />
                          </SelectTrigger>
                          <SelectContent className="w-[var(--radix-select-trigger-width)]">
                            {foodPreferences.map((food) => (
                              <SelectItem key={food.value} value={food.value}>
                                {food.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                    
                  )}
                />
               
                </div>

              </form>
            </Form>
          </div>
          <div className="flex">
            <div className="lg:w-[100%] h-full lg:pr-8 ">
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
                          .sort((a) => (a.user_id === team.leader_user_id ? -1 : 1))
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
                              <Button type="submit" onClick={handleDiscardTeam} disabled={team.payment_status === "PAID"}>Confirm</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        :
                        <Button variant="outline" className="m-5 text-black hover:bg-neutral-400" disabled={team.payment_status === "PAID"} onClick={handleLeaveTeam}>
                          Leave Team <IoExitOutline className="text-xl ml-2" />
                        </Button>
                      }
                      {isLead && team.payment_status !== "PAID" && (
  <>
    {team.ispublic ? (
      <Button
        variant="outline"
        className="m-5 text-black hover:bg-neutral-400"
        onClick={() => setClick(true)}
      >
        Make Team Private <FaLock className="text-[16px] ml-2" />
      </Button>
    ) : (
      <Button
        variant="outline"
        className="m-5 text-black hover:bg-neutral-400"
        onClick={() => setClick(true)}
      >
        Make Team Public <FaGlobe className="text-[16px] ml-2" />
      </Button>
    )}

  
    {click && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-[400px]">
          <h2 className=" text-black font-bold mb-2 text-xl">
            {team.ispublic ? "Make Team Private" : "Make Team Public"}
          </h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            {team.ispublic
              ? "Making this team private will hide its details from the public team list. Are you sure you want to make this team private?"
              : "Making this team public will show its details on the public team list. Are you sure you want to make this team public?"}
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              className="text-black hover:bg-neutral-200 dark:hover:bg-neutral-700"
              onClick={() => setClick(false)}
            >
              Cancel
            </Button>

            {team.ispublic ? (
              <Button
                variant="default"
                className="bg-black hover:bg-neutral-700 text-white"
                onClick={() => {
                  handleMakePrivate();
                  setClick(false); 
                }}
              >
                Confirm
              </Button>
            ) : (
              <Button
                variant="default"
                className="bg-black hover:bg-neutral-700 text-white"
                onClick={() => {
                  handleMakePublic();
                  setClick(false);
                }}
                disabled={team.payment_status === "PAID"}
              >
                Confirm
              </Button>
            )}
          </div>
        </div>
      </div>
    )}
  </>
)}
                    </div>
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
      {/* <Form {...psform}>
        <form
          onSubmit={psform.handleSubmit(onSubmitps)}
          className="text-white p-6 rounded-lg shadow-md w-full space-y-2 mt-6"
        > */}
      {/* <FormField
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
          /> */}
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
              Submit Problem Statement
            </Button>
          </div>
        </form>
      </Form> */}

      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onMidReviewSubmit)}
          className="text-white p-6 rounded-lg shadow-md w-full space-y-2 mt-6"
        >
          <FormField
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Mid Review File (PPT/PPTX)</FormLabel>
                <FormControl>
                  <Input type="file" accept=".ppt,.pptx" onChange={e => field.onChange(e.target.files)} className="bg-[#1a1a1a] border mt-0 border-gray-600 rounded-md p-2" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="w-full flex md:flex-row-reverse">
            <Button type="submit" className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg font-bold hover:bg-gray-300 transition duration-300">
              Submit Mid Review
            </Button>
          </div>
        </form>
      </Form> */}

      {/* <Form {...form}> */}
      {/* <form
          onSubmit={form.handleSubmit(onFinalReviewSubmit)}
          className="text-white p-6 rounded-lg shadow-md w-full space-y-2 mt-6"
        >
          <FormField
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Final Review File (PPT/PPTX)</FormLabel>
                <FormControl>
                  <Input type="file" accept=".ppt,.pptx" onChange={e => field.onChange(e.target.files)} className="bg-[#1a1a1a] border mt-0 border-gray-600 rounded-md p-2" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="w-full flex md:flex-row-reverse">
            <Button type="submit" className="md:px-16 md:w-auto mt-4 w-full py-4 px-4 bg-white text-black rounded-lg font-bold hover:bg-gray-300 transition duration-300">
              Submit Final Review
            </Button>
          </div>
        </form> */}
      {/* </Form> */}

    </div>

  );
};

export default Dashboard;
