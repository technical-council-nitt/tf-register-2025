import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load components for code splitting
const Home = lazy(() => import("./components/Home"));
const CreateTeam = lazy(() => import("./components/CreateTeam"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/Profile"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const JoinTeam = lazy(() => import("./components/JoinTeam"));
const Payment = lazy(() => import("./components/Payment"));
const Rulebook = lazy(() => import("./components/Rulebook"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
  </div>
);

export default function App() {
    return (
        <div>
            <Router>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route index element={<Home />}></Route>
                        <Route path="/create-team" element={<CreateTeam />}></Route>
                        <Route path="/join-team" element={<JoinTeam />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                        <Route path="/profile" element={<Profile />}></Route>
                        <Route path="/team/:teamId" element={<Dashboard />}></Route>
                        <Route path="/:teamId/pay" element={<Payment />} />
                        <Route path="/rulebook" element={<Rulebook />} />
                    </Routes>
                </Suspense>
            </Router>
        </div>
    );
}
