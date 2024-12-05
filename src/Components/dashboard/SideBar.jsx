import { appState } from "@/appState"; // Import appState for language preference
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../../app/context/themeContext";

const SideBar = () => {
  const { isDarkMode } = useTheme(); // Get the current theme (dark or light mode)
  const currentPath = usePathname(); // Get the current route
  const isEnglish = appState.isEnglish; // Check if the language is English

  // Define menu items for bottom navigation
  const menuItems = [
    {
      name: isEnglish ? "Home" : "Inicio",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${
            currentPath == "/dashboard"
              ? "#fb7038"
              : isDarkMode
              ? "#ffffff"
              : "#000000"
          }`}
        >
          <path d="M480-120 120-480l60-60 120 120v-300h240v300l120-120 60 60-360 360Zm0-134 200-200-80-80v-246H360v246l-80-80-200 200 400-400 400 400-400 400ZM360-480Zm240-160ZM360-480Zm240-160Z" />
        </svg>
      ),
      isDisabled: true,
    },
    {
      name: isEnglish ? "Listings" : "Listados",
      path: "/dashboard/listings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${
            currentPath == "/dashboard/listings"
              ? "#fb7038"
              : isDarkMode
              ? "#ffffff"
              : "#000000"
          }`}
        >
          <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      ),
    },
    {
      name: isEnglish ? "Inbox" : "Chats",
      path: "/crm",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${
            currentPath == "/dashboard/inbox"
              ? "#fb7038"
              : isDarkMode
              ? "#ffffff"
              : "#000000"
          }`}
        >
          <path d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-170H620q-11 33-37.5 52T520-340H440q-34 0-60.5-19T342-411H200v171Zm0-251h148q15 24 40.5 39t54.5 15h80q30 0 55.5-15t39.5-39h148v-229H200v229Zm0-229v229-229Zm560 480v-170H760v170ZM200-720v170h142q-6-10-10-23t-4-27q0-32 22-54.5t54-22.5h80q32 0 54 22.5t22 54.5q0 14-4 27t-10 23h142v-170H200Zm560 170v-170 170Z" />
        </svg>
      ),
      isDisabled: true,
    },
    {
      name: isEnglish ? "My Account" : "Mi cuenta",
      path: "/account",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${
            currentPath == "/account"
              ? "#fb7038"
              : isDarkMode
              ? "#ffffff"
              : "#000000"
          }`}
        >
          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 w-full flex justify-around items-center py-3 z-50 ${
          isDarkMode ? "bg-s1 text-white" : "bg-gray-50 text-black"
        }`}
      >
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.isDisabled ? "#" : item.path}
            className={`flex flex-col items-center gap-1 w-1/4 justify-center ${
              (currentPath === item.path ? "text-s3" : "hover:text-s3",
              item.isDisabled ? "opacity-30" : "")
            }`}
          >
            {item.icon}
            <p
              className={`text-xs ${
                currentPath === item.path ? "text-p1" : ""
              }`}
            >
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SideBar;
