import ActionsBar from "@/Components/dashboard/ActionsBar";
import ListingPopForm from "@/Components/dashboard/ListingPopForm";
import { useState } from "react"; // React state management
import MenuItems from "../MenuItems";

const MainContent = ({ menuItems, isDarkMode }) => {
  const [currentCall, setCurrentCall] = useState(null); // State to track the currently active call
  const [isPopUpOpen, setIsPopUpOpen] = useState(false); // State to track the pop-up form visibility

  // Handle save action in the pop-up form
  const handleSave = (formData) => {
    console.log("Saved Listing Data:", formData);
    setIsPopUpOpen(false); // Close the pop-up after saving
  };

  // Handle cancel action in the pop-up form
  const handleCancel = () => {
    setIsPopUpOpen(false); // Close the pop-up when canceled
  };

  return (
    <div
      className={`p-6 space-y-4 h-full ${
        isDarkMode ? "bg-s1 bg-opacity-[98%]" : "bg-white" // Dynamic background based on theme
      }`}
    >
      {/* Back Button */}
      {currentCall && (
        <button
          onClick={() => setCurrentCall(null)} // Reset current call
          className={`mb-4 px-4 py-2 rounded-lg ${
            isDarkMode
              ? "bg-gray-700 text-gray-300"
              : "bg-gray-200 text-gray-700"
          } hover:bg-gray-300`}
        >
          Back
        </button>
      )}

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
      />
    </div>
  );
};

export default MainContent;
