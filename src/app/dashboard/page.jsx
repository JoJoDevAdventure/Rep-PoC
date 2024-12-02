"use client";

import { appState } from "@/appState"; // Application state to access the username
import { MenuItems } from "@/data"; // Mock data for calls
import dynamic from "next/dynamic"; // For dynamic imports
import { useRouter } from "next/navigation"; // For client-side navigation
import { useEffect } from "react"; // React hook to handle side effects

// Dynamically import components with SSR disabled
const Humphry = dynamic(() => import("@/Components/Humphry"), { ssr: false });
const Header = dynamic(() => import("../../Components/dashboard/Header"), { ssr: false });
const SideBar = dynamic(() => import("../../Components/dashboard/SideBar"), { ssr: false });
const MainContent = dynamic(() => import("./MainContent"), { ssr: false });

const Dashboard = () => {
  const router = useRouter(); // Next.js router for navigation

  useEffect(() => {
    // Redirect user to the home page if no username is found in the app state
    if (appState.user == null) {
      router.push("/"); // Redirects to the root ("/") if not logged in
      return
    }
  }, [router]); // Dependency ensures this runs whenever `router` changes

  return (
    <div className="flex md:max-h-[100vh] md:overflow-hidden pb-12">
      <Humphry />
      {/* Sidebar Navigation */}
      <SideBar />
      
      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header username={appState.user?.username} />
        
        {/* Main Content Section */}
        <MainContent menuItems={MenuItems} />
      </div>
    </div>
  );
};

export default Dashboard;