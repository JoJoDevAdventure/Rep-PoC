import Tabs from "@/Components/dashboard/Tabs"; // Tabs component for navigation between sections
import { useState } from "react"; // React state management
import { useTheme } from "../context/themeContext"; // Theme context for dark/light mode
import MenuItems from "./MenuItems";


const MainContent = ({ menuItems }) => {
  const { isDarkMode } = useTheme(); // Get the current theme (dark or light mode)
  const [activeTab, setActiveTab] = useState(0); // Tab state: 0 = Calls History, 1 = LIVE Call

  return (
    <div
      className={`p-6 space-y-4 h-full ${
        isDarkMode ? "bg-s1 bg-opacity-[98%]" : "bg-white" // Dynamic background based on theme
      }`}
    >
      {/* Tabs Section */}
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={["Menu Items"]}
      />

      {/* Conditional rendering based on the active tab */}
      {activeTab === 0 && (
        <MenuItems
          menuItems={menuItems} // Pass the list of calls
          isDarkMode={isDarkMode} // Pass theme information
        />
      )}
    </div>
  );
};

export default MainContent;
