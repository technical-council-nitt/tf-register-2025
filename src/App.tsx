import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import CreateTeam from './components/CreateTeam'
import Login from './components/Login'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import JoinTeam from './components/JoinTeam'
import Payment from './components/Payment'

export default function App() {
	// hello
  return (
    <div>
		<Router>
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/create-team" element={<CreateTeam />}></Route>
				<Route path="/join-team" element={<JoinTeam />}></Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path='/profile' element={<Profile />}></Route>
				<Route path="/team/:teamId" element={<Dashboard />} key="team"></Route>
				<Route path="/:teamId/pay" element={<Payment />} />
			</Routes>
		</Router>
    </div>
  )
}
