"use client";

import { appState } from "@/appState"; // Application state to access the username
import Header from "@/Components/dashboard/Header"; // Header component
import SideBar from "@/Components/dashboard/SideBar"; // Sidebar navigation component
import { useRouter } from "next/navigation"; // For client-side navigation
import { useEffect } from "react"; // React hook to handle side effects
import MainContent from "./MainContent"; // Main content component

const Account = () => {
  const router = useRouter(); // Next.js router for navigation

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
        <MainContent/>
      </div>
    </div>
  );
};

export default Account;