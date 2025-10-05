import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowUpRight } from "lucide-react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/utiils/supabase";
import {
  fetchSheetValues,
  findLinkInRows,
  makeDriveDirectDownloadUrl,
} from "@/lib/googleSheets";
import NavBar from "./Navbar";

const Rsvp = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPartofTeam, setIsPartofTeam] = useState(false);
  const [userName, setUsername] = useState<string | undefined>(undefined);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const [hasRollNumber, setHasRollNumber] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(0);

  // A ref to ensure the download action is a one-time event.
  const downloadInitiatedRef = useRef(false);

  // This useEffect fetches all user and team data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (userDataError) {
        console.error(userDataError);
        setLoading(false);
        return;
      }

      setLoggedIn(true);
      setUsername(userData?.name);
      setIsPartofTeam(!!userData?.team_id);
      setTeamId(userData?.team_id);
      // setHasRollNumber(!!userData?.roll_number);

      if (!userData?.roll_number) {
        window.location.href = "/profile";
        return;
      }

      // Check team status only if user is part of a team
      if (userData?.team_id) {
        const { data: team, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("team_id", userData.team_id)
          .single();

        if (teamError) {
          console.error(teamError);
        } else if (team.payment_status === "PAID") {
          setPaymentStatus(1);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []); // Run only on initial component mount

  // This separate useEffect is dedicated to the download logic.
  useEffect(() => {
    // Check if the paymentStatus is 1 and the download has not been initiated yet.
    if (paymentStatus === 1 && !downloadInitiatedRef.current) {
      downloadInitiatedRef.current = true; // Set the ref to true immediately

      const sheetsId = import.meta.env.VITE_GOOGLE_SHEETS_ID;
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const userNameForMatch = userName;

      // Ensure all necessary data is available before attempting the download
      if (sheetsId && apiKey && userNameForMatch) {
        const performDownload = async () => {
          try {
            const rows = await fetchSheetValues(sheetsId, apiKey, "Sheet1");
            const link = findLinkInRows(rows, userNameForMatch, null);

            if (link) {
              const dl = makeDriveDirectDownloadUrl(link, apiKey);
              if (dl) {
                const a = document.createElement("a");
                a.href = dl;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.download = "";
                document.body.appendChild(a);
                a.click();
                a.remove();
                setDownloadStatus(
                  "Your file download has started. Please check your downloads folder.",
                );
              } else {
                setDownloadStatus(
                  "A link was found, but it could not be processed for download.",
                );
              }
            } else {
              setDownloadStatus(
                "Your file is being processed.",
              );
            }
          } catch (e) {
            console.error("Error fetching download link:", e);
            setDownloadStatus(
              "An error occurred while trying to get your download file.",
            );
          }
        };
        performDownload();
      } else {
        setDownloadStatus("An internal error occurred. Configuration is missing.");
      }
    }
  }, [paymentStatus, userName]); // Rerun only when these values change

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {isLoggedIn && <NavBar userName={userName} />}

      <main className="flex-grow flex flex-col justify-center items-center px-4 md:px-6">
        <div className="w-full max-w-md space-y-6 text-center">
          {isLoggedIn && isPartofTeam ? (
            <div>
              {paymentStatus === 1 ? (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Claim Your Digital SWAG now!
                  </h2>
                  <p className="text-sm md:text-base">
                    Share your personalized RSVPs on your socials and win prizes.
                    Your download should have started. Please make the logged in mail as the default mail for the browser
                  </p>
                  {downloadStatus && (
                    <Alert className="bg-green-500 text-white p-4 rounded-lg mt-4">
                      <AlertDescription>{downloadStatus}</AlertDescription>
                    </Alert>
                  )}
                  {/* New "Share on Instagram" button */}
                  <Button
                    className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2 mt-4"
                    onClick={() => window.open("https://instagram.com", "_blank", "noopener,noreferrer")}
                  >
                    <span>Share on Instagram</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Get Your Digital SWAG now!
                  </h2>
                  <p className="text-sm md:text-base">
                    Complete your team registration to claim it. Share it on your socials to win prizes.
                  </p>
                  <Button
                    className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                    onClick={() => (window.location.href = "/team/" + teamId)}
                  >
                    <span>Dashboard</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold">
                {isLoggedIn
                  ? "You Are Not Part of Any Team"
                  : "Welcome to TransfiNITTe"}
              </h2>
              <p className="text-sm md:text-base">
                {isLoggedIn
                  ? "Complete your team registration to claim your SWAG."
                  : "Get ready for TransfiNITTe 2025 Hackathon. Join a team or create your own to participate!"}
              </p>
              <div className="space-y-4">
                {isLoggedIn ? (
                  <>
                    <Button
                      className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                      onClick={() => (window.location.href = "/create-team")}
                    >
                      <span>Create Team</span>
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                    <Button
                      className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                      onClick={() => (window.location.href = "/join-team")}
                    >
                      <span>Join Team</span>
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2"
                    onClick={() => (window.location.href = "/login")}
                  >
                    <span>Login</span>
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Rsvp;