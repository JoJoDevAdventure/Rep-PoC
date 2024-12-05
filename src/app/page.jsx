"use client";

import { appState } from "@/appState"; // Application state to access the username
import dynamic from "next/dynamic"; // For dynamic imports
import { useRouter } from "next/navigation"; // For client-side navigation
import { useEffect } from "react"; // React hook to handle side effects

const Loading = dynamic(() => import("@/Components/Loading"), { ssr: false });

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Set a delay of 1.5 seconds before redirecting
    const timer = setTimeout(() => {
      if (appState.isAuth) {
        router.push('/dashboard/listings'); // Redirect to /dashboard if authenticated
      } else {
        router.push('/auth'); // Redirect to /auth if not authenticated
      }
    }, 200); // 1.5 second delay

    // Cleanup the timeout when the component is unmounted
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Loading /> // Optional loading message
  );
};

export default Home;