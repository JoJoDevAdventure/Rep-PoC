"use client";

import { appState } from '@/appState';
import Loading from '@/Components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Set a delay of 1.5 seconds before redirecting
    const timer = setTimeout(() => {
      if (appState.isAuth) {
        router.push('/dashboard'); // Redirect to /dashboard if authenticated
      } else {
        router.push('/auth'); // Redirect to /auth if not authenticated
      }
    }, 1500); // 1.5 second delay

    // Cleanup the timeout when the component is unmounted
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Loading /> // Optional loading message
  );
};

export default Home;