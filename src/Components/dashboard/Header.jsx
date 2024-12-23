import { appState } from "@/appState";
import { useTheme } from "../../app/context/themeContext"; // Theme context to manage dark/light mode
import ThemeSwitch from "../ThemeSwitch";

const Header = ({ username, onRefresh }) => {
  const { isDarkMode } = useTheme(); // Retrieve the current theme (dark or light mode)

  return (
    <header
      className={`flex items-center justify-between px-6 md:py-12 max-md:py-8 max-md:pb-2 border-s3/10 border-b-2 max-md:gap-4 ${
        isDarkMode ? "bg-s1" : "bg-white" // Dynamic background based on theme
      } flex-col-reverse md:flex-row`} // Stack for small screens, row for larger screens
    >
      {/* Greeting Section */}
      <div className="text-center md:text-left my-2 md:mb-0 md:w-3/4">
        {/* Greeting Message */}
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-200" : "text-gray-600" // Adjust text color for theme
          }`}
        >
          {appState.isEnglish ? "Good Morning" : "Buenos días"}
        </p>
        <div className="flex flex-row justify-start gap-2">
          {/* Welcome Message */}
          <h1
            className={`text-xl md:text-4xl font-semibold w-full md:w-auto ${
              isDarkMode ? "text-p4" : "text-black" // Dynamic heading color
            }`}
          >
            {appState.isEnglish ? "Welcome back" : "Bienvenido"}
          </h1>
          <span
            className={`text-xl md:text-4xl font-light w-auto ${
              isDarkMode ? "text-p5" : "text-gray-900" // Lighter color for username
            }`}
          >
            {username}
          </span>
        </div>
      </div>

      {/* Upgrade Button and Theme Toggle */}
      <div className="flex items-center justify-between w-full md:justify-end gap-4 md:flex-wrap md:w-1/3">
        {/* Upgrade Button */}
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600" 
        onClick={onRefresh}
        >
          {appState.isEnglish ? "Upgrade" : "Actualiza"}
        </button>
        <div className="flex flex-row-reverse gap-4 ">
          {/* <LanguageSwitch /> */}
          {/* Theme Toggle Switch */}
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
};

export default Header;
