import { appState } from "@/appState"; // Import appState for translation
import { useEffect, useRef, useState } from "react";

const ImagePicker = ({ onClose, onCapture }) => {
  const videoRef = useRef(null); // Ref for the video element
  const [isCameraActive, setIsCameraActive] = useState(false); // State to track camera activation
  const [imagePreview, setImagePreview] = useState(null); // State to store captured image
  const [videoDevices, setVideoDevices] = useState([]); // State to store available video devices
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0); // Index of the active camera

  const isEnglish = appState.isEnglish; // Get language preference

  // Start the camera with the selected device
  const startCamera = async () => {
    try {
      if (videoDevices.length > 0) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoDevices[currentDeviceIndex]?.deviceId },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Set video source to the camera stream
          setIsCameraActive(true);
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all tracks
      videoRef.current.srcObject = null; // Clear the video source
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Convert to a Blob as JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const imageDataUrl = URL.createObjectURL(blob);
            setImagePreview(imageDataUrl);
          }
        },
        "image/jpeg",
        0.9 // Adjust quality if needed
      );
  
      stopCamera(); // Stop the camera after capturing
    }
  };

  // Retake the image
  const retakeImage = () => {
    setImagePreview(null);
    startCamera(); // Restart the camera
  };

  // Switch to the next camera
  const switchCamera = () => {
    if (videoDevices.length > 1) {
      stopCamera(); // Stop the current camera
      const nextIndex = (currentDeviceIndex + 1) % videoDevices.length;
      setCurrentDeviceIndex(nextIndex); // Set the next camera as active
    }
  };

  // Handle closing the picker
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Get the list of video devices on component mount
  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoDevices[currentDeviceIndex]?.deviceId },
        });

        setVideoDevices(videoInputDevices);
        setCurrentDeviceIndex(0); // Start with the first device
      } catch (error) {
        console.error("Error fetching video devices:", error);
      }
    };

    getVideoDevices();
  }, []);

  // Start the camera when the component is mounted or the device index changes
  useEffect(() => {
    if (videoDevices.length > 0) {
      startCamera();
    }
    return () => stopCamera(); // Clean up when the component is unmounted
  }, [currentDeviceIndex, videoDevices]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
      {!imagePreview ? (
        <>
          {/* Camera Preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          ></video>

          {/* Cancel Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 border-2 border-gray-200 text-gray-200 px-4 py-2 rounded shadow-lg hover:bg-red-600"
          >
            {isEnglish ? "Cancel" : "Cancelar"}
          </button>

          {/* Switch Camera Button */}
          {videoDevices.length > 1 && (
            <button
              onClick={switchCamera}
              className="absolute top-4 right-4 border-2 border-gray-200 text-gray-200 px-4 py-2 rounded shadow-lg hover:bg-blue-600"
            >
              {isEnglish ? "Switch Camera" : "Cambiar Cámara"}
            </button>
          )}

          {/* Capture Button */}
          <div
            onClick={captureImage}
            className="absolute bottom-8 w-16 h-16 bg-white rounded-full cursor-pointer flex items-center justify-center shadow-lg"
          ></div>
        </>
      ) : (
        <>
          {/* Image Preview */}
          <img
            src={imagePreview}
            alt="Captured"
            className="w-full h-full object-cover"
          />

          {/* Save Button */}
          <button
            onClick={() => onCapture(imagePreview)}
            className="absolute top-4 right-4 bg-p1 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600"
          >
            {isEnglish ? "Save" : "Guardar"}
          </button>

          {/* Retake Button */}
          <button
            onClick={retakeImage}
            className="absolute bottom-8 w-20 h-20 bg-white text-white rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:bg-yellow-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="42px"
              viewBox="0 -960 960 960"
              width="42px"
              fill="#000000"
            >
              <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ImagePicker;