"use client";

import { useTheme } from "@/app/context/themeContext"; // Theme context for dark/light mode
import { appState } from "@/appState"; // Application state to access the username
import Humphry from "@/Components/Humphry";
import { MenuItems } from "@/data"; // Mock data for calls
import Header from "../../../Components/dashboard/Header"; // Header component
import SideBar from "../../../Components/dashboard/SideBar"; // Sidebar navigation component
import MainContent from "./MainContent"; // Main content component

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
        <Header username={appState.user.username} />

        {/* Main Content Section */}
        <MainContent menuItems={MenuItems} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default page;
