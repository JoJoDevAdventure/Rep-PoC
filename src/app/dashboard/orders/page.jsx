"use client";

import dynamic from "next/dynamic"; // For dynamic imports
import { useRouter } from "next/navigation"; // For client-side navigation
import { useEffect, useState } from "react"; // React hook to handle side effects
import { fetchOrders } from "../Service";

// Dynamically import components with SSR disabled
const Humphry = dynamic(() => import("@/Components/Humphry"), { ssr: false });
const Header = dynamic(() => import("@/Components/dashboard/Header"), { ssr: false });
const SideBar = dynamic(() => import("@/Components/dashboard/SideBar"), { ssr: false });
const MainContent = dynamic(() => import("./MainContent"), { ssr: false });


const Dashboard = () => {
  const router = useRouter(); // Next.js router for navigation
  const [orders, setOrders] = useState([]);

  // Fetch and sort recipes from Firestore
  const loadOrders = async () => {
    try {
      const fetchedOrders = await fetchOrders();
  
      setOrders(fetchedOrders); // Update state with sorted recipes
      console.log("Sorted Recipes:", fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  useEffect(() => {
    loadOrders()
    // Redirect user to the home page if no username is found in the app state
    // if (appState.user == null) {
      // router.push("/"); // Redirects to the root ("/") if not logged in
    //   return
    // }
  }, [router]); // Dependency ensures this runs whenever `router` changes

  return (
    <div className="flex md:max-h-[100vh] md:overflow-hidden pb-12">
    <Humphry onSave={loadOrders}/>
      {/* Sidebar Navigation */}
      <SideBar />
      
      {/* Main Dashboard Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Main Content Section */}
        <MainContent orders={orders}/>
      </div>
    </div>
  );
};

export default Dashboard;