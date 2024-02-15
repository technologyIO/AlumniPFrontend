import LeftSidebar from "./components/left-sidebar";
import TopBar from "./components/topbar";
import SocialMediaPost from "./components/Social-wall-post";
import SideWidgets from "./components/SideWidgets";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Groups from "./pages/Groups";
import Donations from "./pages/Donations";
import Sponsorships from "./pages/Sponsorships";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/ProfilePage";
import Members from "./pages/Members";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useState, useEffect } from "react";
import React from "react";
import Dashboard from "./pages/Dashboard";
import { useCookies } from "react-cookie";

function App() {
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, [cookies.access_token]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
        setIsLoggedIn(true);
  };

  if (loading) {
    
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("handle logout");
  };

  return (
    <div className="App">
      <ToastContainer />
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            {!isLoggedIn ? (
              <Route path="*" element={<LoginPage handleLogin={handleLogin} />} />
            ) : (
              <Route path="*" element={<Dashboard handleLogout={handleLogout} />} />
            )}
            
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
