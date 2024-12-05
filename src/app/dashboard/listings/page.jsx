"use client";

import { useTheme } from "@/app/context/themeContext";
import { appState } from "@/appState"; // Application state
import dynamic from "next/dynamic"; // For dynamic imports
import { useRouter } from "next/navigation"; // For client-side navigation
import { useEffect, useState } from "react"; // React hooks
import { fetchRecipes } from "../Service"; // Import the fetch function

// Dynamically import components with SSR disabled
const Humphry = dynamic(() => import("@/Components/Humphry"), { ssr: false });
const Header = dynamic(() => import("@/Components/dashboard/Header"), { ssr: false });
const SideBar = dynamic(() => import("@/Components/dashboard/SideBar"), { ssr: false });
const MainContent = dynamic(() => import("./MainContent"), { ssr: false });
const Loading = dynamic(() => import("@/Components/Loading"), { ssr: false });

const page = () => {
  const { isDarkMode } = useTheme(); // Get the current theme (dark or light mode)
  const router = useRouter(); // Next.js router for navigation
  const [recipes, setRecipes] = useState([]); // State to store recipes
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    // Redirect user to the home page if no username is found in the app state
    if (appState.user == null) {
      router.push("/"); // Redirects to the root ("/") if not logged in
      return;
    }

    // Fetch recipes from Firestore
    const loadRecipes = async () => {
      try {
        const fetchedRecipes = await fetchRecipes();
        setRecipes(fetchedRecipes); // Update state with fetched recipes
        console.log(fetchedRecipes)
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    loadRecipes(); // Call the fetch function
  }, [router]); // Dependency ensures this runs whenever `router` changes

  if (loading) {
    return <Loading />; // Show loading spinner while fetching data
  }

  return (
    <div className="flex md:max-h-[100vh] pb-12 md:pb-0 md:overflow-hidden">
      {/* Sidebar Navigation */}
      <SideBar />

      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header username={appState.user?.username} />

        {/* Main Content Section */}
        <MainContent menuItems={recipes} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default page;