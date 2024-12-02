"use client";

import { useTheme } from "@/app/context/themeContext";
import { appState } from "@/appState"; // Application state to access the username
import { MenuItems } from "@/data"; // Mock data for calls
import dynamic from "next/dynamic"; // For dynamic imports

// Dynamically import components with SSR disabled
const Humphry = dynamic(() => import("@/Components/Humphry"), { ssr: false });
const Header = dynamic(() => import("@/Components/dashboard/Header"), { ssr: false });
const SideBar = dynamic(() => import("@/Components/dashboard/SideBar"), { ssr: false });
const MainContent = dynamic(() => import("./MainContent"), { ssr: false });

const page = () => {
  const { isDarkMode } = useTheme(); // Get the current theme (dark or light mode)

  return (
    <div className="flex md:max-h-[100vh] pb-12 md:pb-0 md:overflow-hidden">
      <Humphry/>

      {/* Sidebar Navigation */}
      <SideBar />

      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header username={appState.user?.username} />

        {/* Main Content Section */}
        <MainContent menuItems={MenuItems} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default page;
