"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "./animations/loading.json"; // Replace with the path to your Lottie JSON file

const Loading = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md z-50"
      initial={{ opacity: 0 }} // Start fully transparent
      animate={{ opacity: 1 }} // Fade in
      exit={{ opacity: 0 }} // Fade out when exiting
      transition={{ duration: 0.5 }} // Duration of the animation
    >
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        className="w-40 h-40"
      />
    </motion.div>
  );
};

export default Loading;