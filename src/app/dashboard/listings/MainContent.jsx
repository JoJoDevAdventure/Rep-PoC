import ActionsBar from "@/Components/dashboard/ActionsBar";
import ListingPopForm from "@/Components/dashboard/ListingPopForm";
import { useState } from "react"; // React state management
import MenuItems from "../MenuItems";
// Import appState from your state file
import { appState } from "@/appState";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase"; // Import Firestore instance

const MainContent = ({ menuItems, isDarkMode }) => {
  const [currentCall, setCurrentCall] = useState(null); // State to track the currently active call
  const [isPopUpOpen, setIsPopUpOpen] = useState(false); // State to track the pop-up form visibility

  const saveToFirestore = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "products"), formData); // "listings" is the collection name
      console.log("Document written with ID:", docRef.id);
      return docRef.id; // Return the document ID
    } catch (error) {
      console.error("Error adding document to Firestore:", error);
      throw error;
    }
  };

  const handleSave = async ({ imageLink, audioLink }) => {
    if (!appState.user) {
      console.error("User information is not available in appState.");
      return;
    }

    const formData = {
      audioLink: audioLink, // Use the provided audio link
      imageLink: imageLink, // Use the provided image link
      title: "",
      description: "",
      price: 0,
    };

    try {
      const docId = await saveToFirestore(formData); // Save to Firestore
      console.log("Saved to Firestore with ID:", docId);
    } catch (error) {
      console.error("Failed to save to Firestore:", error);
    }

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
