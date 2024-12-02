import { useEffect, useRef, useState } from "react";

const ImagePicker = ({ onClose, onCapture }) => {
  const videoRef = useRef(null); // Ref for the video element
  const [isCameraActive, setIsCameraActive] = useState(false); // State to track camera activation
  const [imagePreview, setImagePreview] = useState(null); // State to store captured image

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Set video source to the camera stream
        setIsCameraActive(true);
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

  // Capture the image
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setImagePreview(imageDataUrl);
      stopCamera(); // Stop the camera after capturing
    }
  };

  // Retake the image
  const retakeImage = () => {
    setImagePreview(null);
    startCamera(); // Restart the camera
  };

  // Handle closing the picker
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    startCamera();
  });

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

          {/* Camera Controls */}
          <div className="absolute bottom-8 flex gap-4">
            <button
              onClick={captureImage}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600"
            >
              Take Picture
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Image Preview */}
          <img
            src={imagePreview}
            alt="Captured"
            className="w-full h-full object-cover"
          />

          {/* Controls for Image Preview */}
          <div className="absolute bottom-8 flex gap-4">
            <button
              onClick={() => onCapture(imagePreview)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={retakeImage}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600"
            >
              Retake
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImagePicker;