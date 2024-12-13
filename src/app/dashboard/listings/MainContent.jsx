"use client";

import ActionsBar from "@/Components/dashboard/ActionsBar";
import ListingPopForm from "@/Components/dashboard/ListingPopForm";
import Loading from "@/Components/Loading";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { useState } from "react"; // React state management
import MenuItems from "../MenuItems";
import { processListing } from "../Service"; // Import the services

// Import appState from your state file

const MainContent = ({ menuItems, isDarkMode, onReload, handleSelect }) => {
  const [currentCall, setCurrentCall] = useState(null); // State to track the currently active call
  const [isPopUpOpen, setIsPopUpOpen] = useState(false); // State to track the pop-up form visibility
  const [loading, setIsLoading] = useState(false); // State to show/hide loading animation

  const router = useRouter(); // Router instance for navigation


  // Handle cancel action in the pop-up form
  const handleCancel = () => {
    setIsPopUpOpen(false); // Close the pop-up when canceled
  };

  const handleSave = async ({ uploadedFile, audioBlob }) => {
    setIsLoading(true)
    setIsPopUpOpen(false)

    console.log("uploaded image : ", uploadedFile, "uploaded audio : ", audioBlob)

    try {
      const response = await processListing({ uploadedFile, audioBlob });
      setIsLoading(false)
    } catch (error) {
      window.alert("Failed to save, please try again")
      setIsLoading(false)
    } finally {
      setIsPopUpOpen(false); // Close the pop-up after saving
      setIsLoading(false)
      onReload()
    }
  };



  return (
    <div
      className={`p-6 space-y-4 h-full ${
        isDarkMode ? "bg-s1 bg-opacity-[98%]" : "bg-white" // Dynamic background based on theme
      }`}
    >
      {loading && <Loading />}
      {/* Listing Pop-Up Form */}
      {isPopUpOpen && (
        <ListingPopForm
          isOpen={isPopUpOpen}
          onClose={handleCancel}
          onSave={handleSave}
        />
      )}

      {/* Actions Bar */}
      <ActionsBar
        onAddListing={() => setIsPopUpOpen(true)}
        isDarkMode={isDarkMode}
      />

      <MenuItems
        menuItems={menuItems} // Pass the list of calls
        isDarkMode={isDarkMode} // Pass theme information
        onSelect={handleSelect}
      />
    </div>
  );
};

export default MainContent;
