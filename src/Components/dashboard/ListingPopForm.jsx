import { appState } from "@/appState";
import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import RecordRTCPromisesHandler from "recordrtc";
import WaveSurfer from "wavesurfer.js";
import loadingAnimation from "../animations/loading.json"; // Path to your Lottie JSON file
import ImagePicker from "../ImagePicker";

const ListingPopForm = ({ isOpen, onClose, onSave }) => {
  const [uploadedFile, setUploadedFile] = useState(null); // State to store uploaded image
  const [imagePreview, setImagePreview] = useState(null); // State to preview uploaded images
  const [audioBlob, setAudioBlob] = useState(null); // State to store audio blob
  const [isRecording, setIsRecording] = useState(false); // State to toggle recording icon
  const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause
  const [isLoading, setIsLoading] = useState(false); // State to show/hide loading animation
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false); // Track if image picker is open

  const mediaRecorderRef = useRef(null); // Ref for media recorder
  const waveformRef = useRef(null); // Ref for WaveSurfer container
  const waveSurferRef = useRef(null); // Ref for WaveSurfer instance
  const isEnglish = appState.isEnglish; // Check the current language preference
  const [recorder, setRecorder] = useState(null); // Ref to hold the recorder instance
  let streamRef = useRef(null); // Ref to hold the stream instance

  // Translations for the labels
  const labels = {
    title: isEnglish ? "Add Item Listing" : "Agregar artículo",
    imageLabel: isEnglish ? "Product Image" : "Imagen del producto",
    takePicture: isEnglish ? "Take Picture" : "Tomar foto",
    orLabel: isEnglish ? "Or" : "O",
    browseImages: isEnglish ? "Browse Images" : "Seleccionar imágenes",
    audioLabel: isEnglish
      ? "Product Description Audio"
      : "Audio de descripción del producto",
    uploadAudio: isEnglish ? "Upload Audio" : "Subir audio",
    recordAudio: isEnglish ? "Record Audio" : "Grabar audio",
    stopRecording: isEnglish ? "Stop Recording" : "Detener grabación",
    cancel: isEnglish ? "Cancel" : "Cancelar",
    save: isEnglish ? "Save" : "Guardar",
    errorMessage: isEnglish
      ? "Both audio and image files are required to save."
      : "Se requieren archivos de audio e imagen para guardar.",
  };

  // Handle file upload (image)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create preview for the image
    }
  };

  // Handle "Save" functionality
  const handleSave = () => {
    if (!uploadedFile || !audioBlob) {
      console.error("Both audio and image files are required to save.");
      alert("Error: Both audio and image files are required to save.");
      return;
    }
    console.log(
      "uploaded image :",
      uploadedFile,
      "uploaded audio :",
      audioBlob
    );
    onSave({ uploadedFile, audioBlob });
  };

  // Handle removing image
  const removeImage = () => {
    setUploadedFile(null);
    setImagePreview(null);
  };

  // Handle file upload (audio)
  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioBlob(file);
      loadWaveform(file); // Load waveform for uploaded audio
    }
  };

  // Initialize WaveSurfer for audio preview
  const loadWaveform = (blob) => {
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy(); // Destroy the existing instance
    }

    if (waveformRef.current) {
      const blobURL =
        typeof blob === "string" ? blob : URL.createObjectURL(blob);
      setIsLoading(true); // Show loading animation

      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current, // Container for waveform
        waveColor: "#ddd", // Waveform color
        progressColor: "#FF5F1F", // Progress bar color
        cursorColor: "#FF5F1F", // Cursor color
        barWidth: 3, // Width of waveform bars
        responsive: true, // Adjusts the waveform to container size
        height: 100, // Height of the waveform
      });

      waveSurferRef.current.load(blobURL); // Load the Blob URL or string

      waveSurferRef.current.on("ready", () => {
        setIsLoading(false); // Hide loading animation
      });

      waveSurferRef.current.on("error", (error) => {
        setIsLoading(false); // Hide loading animation on error
        console.error("WaveSurfer error:", error);
      });
    }
  };

  const generateFileName = (prefix, extension) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `${prefix}_${timestamp}.${extension}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Get the audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Store the stream reference
      streamRef.current = stream;

      // Initialize the recorder with the stream
      const newRecorder = new RecordRTCPromisesHandler(stream, {
        type: "audio",
      });

      // Start the recording
      await newRecorder.startRecording();
      console.log("Recording started:", newRecorder);

      // Update the recorder state after starting
      setRecorder(newRecorder);

      setIsRecording(true); // Show recording icon
    } catch (error) {
      console.error("Error accessing the microphone:", error);
      alert(
        "Error: Unable to access the microphone. Please check your permissions."
      );
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      if (!recorder) {
        console.warn("No active recorder to stop.");
        return; // Exit early if recorder is not initialized
      }

      console.log("Stopping recorder:", recorder);

      // Stop the recording
      await recorder.stopRecording();

      // Retrieve the recorded blob
      const blob = await recorder.getBlob();

      // Validate the MIME type
      if (!blob.type.startsWith("audio/")) {
        console.error("Invalid audio format.");
        alert("Error: The recorded file is not a valid audio format.");
        return;
      }

      // Create a File object from the blob
      const fileName = generateFileName("audio", "webm");
      const file = new File([blob], fileName, { type: blob.type });

      // Set the recorded audio blob and generate the waveform
      setAudioBlob(file);
      loadWaveform(blob);

      // Stop the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null; // Clear the stream reference
      }

      recorder.reset(); // Reset the recorder
      setRecorder(null); // Clear the recorder state
      setIsRecording(false); // Update the recording state

      console.log("Recording stopped successfully.");
    } catch (error) {
      console.error("Error stopping the recording:", error);
    }
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

  // Handle removing audio
  const removeAudio = () => {
    setAudioBlob(null);
    if (waveSurferRef.current) waveSurferRef.current.destroy(); // Destroy waveform
  };
  // Handle capturing the photo
  const handleCapture = (image) => {
    setImagePreview(image); // Save the captured image preview

    // Convert the base64 or URL image to a Blob
    fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        // Create a File object from the blob
        const fileName = generateFileName("image", "png");
        const file = new File([blob], fileName, { type: blob.type });
        setUploadedFile(file); // Set the Blob as the uploaded file
      })
      .catch((error) => {
        console.error("Error converting image to blob:", error);
        alert("Failed to process the image. Please try again.");
      });

    setIsImagePickerOpen(false); // Close the picker
  };

  const handleCameraOpening = () => {
    setIsImagePickerOpen(true);
  };

  useEffect(() => {
    if (audioBlob && waveformRef.current) {
      loadWaveform(audioBlob);
    }
  }, [audioBlob]);

  if (!isOpen) return null; // Do not render if the pop-up is not open

  return (
    <div className="fixed top-0 left-0 w-full md:w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center px-2">
      {isImagePickerOpen && (
        <ImagePicker
          onClose={() => setIsImagePickerOpen(false)}
          onCapture={handleCapture}
        />
      )}
      <div className="bg-white rounded-lg p-6 w-80 md:w-96 shadow-lg text-gray-500 relative">
        {isLoading && (
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            className="absolute inset-0 w-full h-full"
          />
        )}

        <h2 className="text-lg font-bold mb-4 text-black-100">
          {labels.title}
        </h2>

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            {labels.ImagePicker}
          </label>

          {imagePreview ? (
            <div className="relative flex justify-center w-full h-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full max-h-24 object-cover rounded-lg mb-2"
              />
              {/* Trash Icon to Remove Image */}
              <button
                onClick={removeImage}
                className="absolute -bottom-3 right-[calc(50%-1rem)] bg-red-500 p-2 rounded-full text-white hover:bg-red-600 focus:outline-none"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/ffffff/trash.png"
                  alt="Remove"
                  className="w-4 h-4"
                />
              </button>
            </div>
          ) : (
            <>
              <div
                onClick={() => setIsImagePickerOpen(true)}
                className="flex flex-row justify-center items-center bg-p1 py-2 gap-2 text-p4 px-4 rounded-lg cursor-pointer hover:bg-p2/10 text-xl w-full mb-1"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#fff6f3"
                >
                  <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" />
                </svg>
                {labels.takePicture}
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <p className="text-[12px]">{labels.orLabel}</p>
                <label className="flex flex-row justify-center items-center gap-2 text-p1 px-4 rounded-lg cursor-pointer hover:bg-p2/10 w-full text-[12px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ff5f1f"
                    className="w-4 h-4"
                  >
                    <path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                  </svg>
                  {labels.browseImages}
                </label>
              </div>
            </>
          )}
        </div>

        {/* Audio Upload/Record */}
        <div className="mb-4 mt-8">
          <label htmlFor="audio" className="block text-sm font-medium mb-2">
            {labels.audioLabel}
          </label>
          {audioBlob ? (
            <div className="relative">
              <div ref={waveformRef} className="mb-4 h-22"></div>
              <button
                onClick={removeAudio}
                className="absolute -bottom-3 right-0 bg-red-500 p-2 rounded-full text-white hover:bg-red-600 focus:outline-none z-40"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/ffffff/trash.png"
                  alt="Remove"
                  className="w-4 h-4"
                />
              </button>

              <button
                onClick={togglePlayPause}
                className="absolute -bottom-3 right-12 bg-p1 p-2 rounded-full text-white hover:bg-red-600 focus:outline-none z-40"
              >
                <img
                  src={
                    !isPlaying
                      ? `https://img.icons8.com/ios-filled/50/ffffff/play.png`
                      : `https://img.icons8.com/ios-filled/50/ffffff/pause.png`
                  }
                  alt="Remove"
                  className="w-4 h-4"
                />
              </button>
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              {/* <label className="flex items-center gap-2 bg-p1 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-p2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
                <img
                  src="https://img.icons8.com/ios-filled/50/ffffff/upload.png"
                  alt="Upload"
                  className="w-5 h-5"
                />
                {labels.uploadAudio}
              </label> */}
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/50/ffffff/stop.png"
                    alt="Stop Recording"
                    className="w-5 h-5"
                  />
                  {labels.stopRecording}
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 bg-p1 text-white px-4 py-2 rounded-lg hover:bg-p2"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/50/ffffff/microphone.png"
                    alt="Record Audio"
                    className="w-5 h-5"
                  />
                  {labels.recordAudio}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-500 border-2 border-gray-500 hover:bg-gray-200"
          >
            {labels.cancel}
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg  text-white ${
              audioBlob && uploadedFile
                ? "hover:bg-p2 bg-p1"
                : "bg-gray-600 hover:bg-gray-300"
            }`}
            disabled={!audioBlob}
          >
            {labels.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingPopForm;
