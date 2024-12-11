import { useRef, useState } from "react";
import RecordRTC from "recordrtc";
import WaveSurfer from "wavesurfer.js";

const AudioRecorder = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const recorderRef = useRef(null);

  // Initialize WaveSurfer for waveform visualization
  const loadWaveform = (url) => {
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }

    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#FF5F1F",
      cursorColor: "#FF5F1F",
      barWidth: 3,
      responsive: true,
      height: 100,
    });

    waveSurferRef.current.load(url);
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
      });
      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please allow microphone permissions.");
    }
  };

  // Stop recording audio
  const stopRecording = async () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        loadWaveform(url);
        setIsRecording(false);
      });
    }
  };

  // Remove audio
  const removeAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }
  };

  // Save audio
  const handleSave = () => {
    if (!audioBlob) {
      alert("Please record audio before saving.");
      return;
    }
    onSave(audioBlob);
  };

  return (
    <div className="audio-recorder">
      <div className="controls">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start Recording
          </button>
        )}
        {audioBlob && (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Save
            </button>
            <button
              onClick={removeAudio}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {audioUrl && (
        <div className="audio-preview">
          <audio src={audioUrl} controls className="mt-4 w-full" />
          <div ref={waveformRef} className="waveform mt-4"></div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;