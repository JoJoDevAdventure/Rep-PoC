"use client";

import { useTheme } from "@/app/context/themeContext"; // Theme context for dark/light mode
import { appState } from "@/appState"; // Application state to access the username
import { useRouter } from "next/navigation"; // For client-side navigation
import { useEffect } from "react"; // React hook to handle side effects
import Header from "../../Components/dashboard/Header"; // Header component'import { useTheme } from "@/app/context/themeContext"; // Theme context for dark/light mode
import SideBar from "../../Components/dashboard/SideBar"; // Sidebar navigation component

const Dashboard = () => {
  const router = useRouter(); // Next.js router for navigation'
  const { isDarkMode } = useTheme(); // Get the current theme (dark or light mode)
  

  useEffect(() => {
    // Redirect user to the home page if no username is found in the app state
    if (!appState.username) {
      router.push("/"); // Redirects to the root ("/") if not logged in
    }
  }, [router]); // Dependency ensures this runs whenever `router` changes

  return (
    <div className="flex max-h-[100vh] overflow-hidden">
      {/* Sidebar Navigation */}
      <SideBar />
      
      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header username={appState.username} />
        
        {/* Main Content Section */}
        <div className={`h-full flex pl-36 pt-32 ${isDarkMode ? "bg-s1" : "bg-white"}`}>
          <p className={`${isDarkMode ? "text-white" : "text-black-100"}`}>We'll support you here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;