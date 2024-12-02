import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AgentInfo = ({ name = "John Doe", blob, onTimeUpdate, isDarkMode }) => {
  const waveformRef = useRef(null); // Reference to the waveform container
  const waveSurferRef = useRef(null); // WaveSurfer instance reference
  const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause

  useEffect(() => {
    // Initialize WaveSurfer when a valid audio blob and container are available
    if (blob && waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current, // Container for waveform
        waveColor: isDarkMode ? "#666" : "#ddd", // Waveform color based on theme
        progressColor: "#FF5F1F", // Progress bar color
        cursorColor: "#FF5F1F", // Cursor color
        barWidth: 3, // Width of waveform bars
        responsive: true, // Adjusts the waveform to container size
        height: 30,
      });

      waveSurferRef.current.load(blob); // Load the audio blob

      waveSurferRef.current.on("ready", () => {
        setIsPlaying(false); // Reset play state when audio is ready
      });

      waveSurferRef.current.on("audioprocess", () => {
        if (waveSurferRef.current.isPlaying()) {
          const currentTime = waveSurferRef.current.getCurrentTime(); // Get current playback time
          onTimeUpdate(formatTime(currentTime)); // Update the time using callback
        }
      });

      // Cleanup on component unmount
      return () => {
        if (waveSurferRef.current) {
          waveSurferRef.current.destroy(); // Destroy WaveSurfer instance
        }
      };
    }
  }, [blob, onTimeUpdate, isDarkMode]);

  // Helper function to format time into MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Toggle play/pause functionality
  const togglePlayPause = () => {
    if (waveSurferRef.current) {
      if (waveSurferRef.current.isPlaying()) {
        waveSurferRef.current.pause(); // Pause the audio
        setIsPlaying(false);
      } else {
        waveSurferRef.current.play(); // Play the audio
        setIsPlaying(true);
      }
    }
  };

  // Define dynamic styles based on theme
  const bgColor = isDarkMode ? "bg-s1" : "bg-white"; // Background color
  const textColor = isDarkMode ? "text-gray-300" : "text-p1"; // Text color
  const borderColor = isDarkMode ? "border-p1" : "border-p1/10"; // Border color

  return (
    <div
      className={`md:p-6 p-4 border-2 rounded-xl h-full flex flex-col justify-center items-center ${bgColor} ${borderColor}`}
    >
      {/* Agent's Name */}
      <h3 className={`text-l md:text-xl font-semibold mb-4 ${textColor}`}>{name}</h3>

      {/* Audio Visualizer */}
      <div ref={waveformRef} className="w-full mb-4 md:h-full"></div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className={`px-4 py-2 rounded-full font-semibold ${
          isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
        } hover:bg-gray-300`}
      >
        {isPlaying ? "Pause" : "Play"} {/* Button text based on play state */}
      </button>
    </div>
  );
};

export default AgentInfo;