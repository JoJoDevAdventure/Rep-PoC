"use client";

import WavesurferPlayer from "@wavesurfer/react";
import { useEffect, useState } from "react";

const Waveform = ({ audioUrl, height = 100, waveColor = "#000000" }) => {
  const [isPlaying, setIsPlaying] = useState(false); // Play/Pause state
  const [wavesurfer, setWavesurfer] = useState(null)

  useEffect

  const onReady = (ws) => {
    console.log("WS Is Ready !")
    setWavesurfer(ws)
    setIsPlaying(true)
  }

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Player Component */}
      <WavesurferPlayer
        height={height}
        waveColor="#ffffff"
        progressColor="#FF5F1F"
        cursorColor="#FF5F1F"
        url={audioUrl}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        className={`mt-4 px-4 py-2 rounded ${
          isPlaying ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default Waveform;