"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Humphry = dynamic(() => import("@/Components/Humphry"), { ssr: false });
const Header = dynamic(() => import("@/Components/dashboard/Header"), {
  ssr: false,
});
const SideBar = dynamic(() => import("@/Components/dashboard/SideBar"), {
  ssr: false,
});
const MainContent = dynamic(() => import("./MainContent"), { ssr: false });
const Loading = dynamic(() => import("@/Components/Loading"), { ssr: false });

const Page = () => {
  const { id } = useParams(); // Get the item ID

  return (
    <div className="flex md:max-h-[100vh] pb-12 md:pb-0 md:overflow-hidden">
      <SideBar />
      {id ? <MainContent id={id} /> : <Loading />}
    </div>
  );
};

export default Page;
