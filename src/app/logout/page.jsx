"use client";

import { appState } from "@/appState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Show the logout confirmation alert
    const confirmLogout = window.confirm("Do you want to logout?");
    
    if (confirmLogout) {
      // If the user confirms, set `isAuth` to false and redirect to home
      appState.isAuth = false; // Assuming `isAuth` is stored in localStorage
      router.push("/");
    } else {
      // If the user cancels, redirect to the dashboard
      router.push("/dashboard");
    }
  }, [router]);

  return null; // No UI is needed for this page
};

export default LogoutPage;