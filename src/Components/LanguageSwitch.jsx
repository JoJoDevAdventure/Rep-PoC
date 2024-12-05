"use client";

import { appState } from "@/appState"; // Access appState
import { usePathname, useRouter } from "next/navigation"; // Import Next.js hooks
import { useState } from "react";

const LanguageSwitch = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle state for language options
  const isEnglish = appState.isEnglish; // Get current language
  const router = useRouter(); // Hook to navigate
  const currentPath = usePathname(); // Get the current path

  // Handle language selection
  const handleLanguageChange = (language) => {
    appState.isEnglish = language === "english";
    setIsOpen(false); // Close the selection menu after choosing

    // Trigger navigation to the current path to "refresh" with the new language
    router.push(currentPath);
  };

  return (
    <div className="relative z-50">
      {/* Selected Language */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)} // Open language options
          className="w-10 h-10 rounded-full border-2 border-orange-500 hover:border-orange-300 transition"
        >
          <img
            src={
              isEnglish
                ? "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
                : "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"
            }
            alt={isEnglish ? "English" : "Spanish"}
            className="w-full h-full rounded-full"
          />
        </button>
      )}

      {/* Language Options */}
      {isOpen && (
        <div className="bg-white flex gap-4">
          <button
            onClick={() => handleLanguageChange("english")}
            className={`w-10 h-10 rounded-full border-2 ${
              isEnglish ? "border-orange-500" : "border-gray-300"
            } hover:border-orange-300 transition`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
              alt="English"
              className="w-full h-full rounded-full"
            />
          </button>
          <button
            onClick={() => handleLanguageChange("spanish")}
            className={`w-10 h-10 rounded-full border-2 ${
              !isEnglish ? "border-orange-500" : "border-gray-300"
            } hover:border-orange-300 transition`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"
              alt="Spanish"
              className="w-full h-full rounded-full"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;