import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "../../app/context/themeContext";

const SideBar = () => {
  const { isDarkMode } = useTheme(); // Get the current theme (dark or light mode)
  const currentPath = usePathname(); // Get the current route

  // Define menu items for the main navigation
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "dashboard-icon.svg",
    },
    {
      name: "Listings",
      path: "/dashboard/listings",
      icon: "listings-icon.svg",
    },
    {
      name: "CRM",
      path: "/dashboard/crm",
      icon: "crm-icon.svg",
      isDisabled: true, // Example of a disabled menu item
    },
  ];

  // Define menu items for the mobile navigation (split into left and right sections)
  const leftMobileMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${currentPath == "/dashboard" ? "#fb7038" : isDarkMode ? "#ffffff" : "#000000"}`}
        >
          <path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z" />
        </svg>
      ),
    },
    {
      name: "Listings",
      path: "/dashboard/listings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${currentPath == "/dashboard/listings" ? "#fb7038" : isDarkMode ? "#ffffff" : "#000000"}`}
        >
          <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      ),
    },
  ];

  const rightMobileMenuItems = [
    {
      name: "CRM",
      path: "/dashboard/crm",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${currentPath == "/dashboard/crm" ? "#fb7038" : isDarkMode ? "#ffffff" : "#000000"}`}
        >
          <path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
        </svg>
      ),
      isDisabled: true, // Example of a disabled menu item
    },
    {
      name: "My account",
      path: "/account",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={`${currentPath == "/account" ? "#fb7038" : isDarkMode ? "#ffffff" : "#000000"}`}
        >
          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
        </svg>
      ),
    },
  ];

  // Define menu items for the account section
  const accountItems = [
    {
      name: "My account",
      path: "/account",
      icon: "account-icon.svg",
    },
    {
      name: "Help and support",
      path: "/support",
      icon: "help-icon.svg",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "logout-icon.svg",
    },
  ];

  return (
    <>
      {/* Sidebar for larger screens */}
      <div
        className={`hidden lg:flex h-screen w-64 flex-col justify-between p-6 overflow-hidden z-10 ${
          isDarkMode
            ? "bg-s1 text-white" // Dark mode styles
            : "bg-gray-50 text-black shadow-light" // Light mode styles
        }`}
      >
        {/* Logo Section */}
        <div>
          <img
            className="w-48 mx-0 mb-10"
            src={`/logo-${isDarkMode ? "white" : "black"}.png`} // Adjust logo based on theme
            alt="Logo"
          />

          {/* Main Menu Section */}
          <div>
            <p className="uppercase text-sm font-semibold text-gray-500 mb-4">
              Menu
            </p>
            <ul className="space-y-0 w-full">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className={`relative -mx-6 flex items-center gap-4 py-4 px-6 cursor-pointer ${
                    currentPath === item.path
                      ? "bg-s3/10 text-s3" // Highlight active menu item
                      : isDarkMode
                      ? "hover:bg-s3/5" // Hover styles for dark mode
                      : "hover:bg-s3/5" // Hover styles for light mode
                  } ${
                    item.isDisabled
                      ? "opacity-50 pointer-events-none hover:bg-transparent" // Styles for disabled items
                      : ""
                  }`}
                >
                  {currentPath === item.path && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-s3" />
                  )}

                  <img
                    src={`/dashboard-icons/${item.icon}`}
                    alt={`${item.name} icon`}
                    className={`w-5 h-5 ${
                      currentPath === item.path ? "filter-p1" : ""
                    }`}
                  />
                  <Link href={item.path}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Account Section */}
        <div>
          <p className="uppercase text-sm font-semibold text-gray-500 mb-4">
            Your account
          </p>
          <ul className="space-y-4">
            {accountItems.map((item) => (
              <li
                key={item.name}
                className={`relative flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                  currentPath === item.path
                    ? "text-s3"
                    : isDarkMode
                    ? "hover:bg-s3/5"
                    : "hover:bg-s3/5"
                }`}
              >
                <img
                  src={`/dashboard-icons/${item.icon}`}
                  alt={`${item.name} icon`}
                  className={`w-5 h-5 ${
                    currentPath === item.path ? "filter-p1" : ""
                  }`}
                />
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Navigation for smaller screens */}
      <div
        className={`fixed bottom-0 left-0 w-full flex lg:hidden justify-between items-center py-3 z-10 ${
          isDarkMode ? "bg-s1 text-white" : "bg-gray-50 text-black"
        }`}
      >
        {/* Left Section */}
        <div className="relative flex justify-start gap-4 min-w-2/5 pl-3 z-50">
          {leftMobileMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`relative flex flex-col items-center gap-1 z-50 ${
                currentPath === item.path ? "text-s3" : "hover:text-s3"
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="relative flex justify-end gap-4 min-w-2/5 pr-3 z-50">
          {rightMobileMenuItems.map((item) => (
            <Link
              key={item.name}
              href={!item.isDisabled ? item.path : "#"} // Disable link if item is disabled
              className={`flex flex-col items-center gap-1 z-50 ${
                item.isDisabled
                  ? "opacity-50 pointer-events-none" // Add styles for disabled items
                  : currentPath === item.path
                  ? "text-s3" // Highlight active item
                  : "hover:text-s3" // Hover style for active items
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
