import Lottie from "lottie-react";
import { useRef, useState } from "react";
import HumphryAnimation from "./animations/Humphry.json";

const Humphry = () => {
  const [micAccess, setMicAccess] = useState(null); // State for microphone access
  const [isActive, setIsActive] = useState(false); // State for activating Humphry
  const [inputValue, setInputValue] = useState(""); // State for the text input value
  const [isListening, setIsListening] = useState(false); // State to track if speech recognition is active
  const recognitionRef = useRef(null); // Reference for SpeechRecognition

  // Initialize SpeechRecognition API
  // useEffect(() => {
  //   const SpeechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;

  //   if (SpeechRecognition) {
  //     recognitionRef.current = new SpeechRecognition();
  //     recognitionRef.current.continuous = true;
  //     recognitionRef.current.interimResults = true;
  //     recognitionRef.current.lang = "en-US";

  //     recognitionRef.current.onresult = (event) => {
  //       let transcript = "";
  //       for (let i = event.resultIndex; i < event.results.length; i++) {
  //         if (event.results[i].isFinal) {
  //           transcript += event.results[i][0].transcript + " ";
  //         }
  //       }

  //       if (transcript.toLowerCase().includes("hey humphrey")) {
  //         setIsActive(true);
  //         setInputValue("");
  //       } else if (isActive && transcript.trim()) {
  //         setInputValue((prev) => `${prev} ${transcript}`.trim());
  //       }
  //     };

  //     recognitionRef.current.onerror = (error) => {
  //       console.error("Speech recognition error:", error);
  //       setIsListening(false);
  //     };

  //     recognitionRef.current.onend = () => {
  //       if (isListening) {
  //         recognitionRef.current.start();
  //       }
  //     };
  //   }
  // }, [isActive, isListening]);

  // const requestMicAccess = () => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true })
  //     .then(() => {
  //       setMicAccess(true);
  //       startListening();
  //     })
  //     .catch(() => {
  //       setMicAccess(false);
  //     });
  // };

  // const startListening = () => {
  //   if (recognitionRef.current && !isListening) {
  //     try {
  //       recognitionRef.current.start();
  //       setIsListening(true);
  //     } catch (error) {
  //       if (error.name === "InvalidStateError") {
  //         console.warn("Recognition is already started.");
  //       } else {
  //         console.error("Unexpected error starting recognition:", error);
  //       }
  //     }
  //   }
  // };

  // const stopListening = () => {
  //   if (recognitionRef.current && isListening) {
  //     recognitionRef.current.stop();
  //     setIsListening(false);
  //   }
  // };

  const handleActivation = () => {
    setIsActive((prev) => {
      // if (!prev && micAccess === null) {
      //   requestMicAccess();
      // } else if (!prev && micAccess) {
      //   startListening();
      // } else {
      //   stopListening();
      // }
      return !prev;
    });
  };

  const handleBackgroundClick = () => {
    if (isActive) {
      setIsActive(false);
      // stopListening();
    }
  };

  return (
    <div>
      {/* Dark Background when Humphry is Active */}
      {isActive && (
        <div
          onClick={handleBackgroundClick}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20"
        ></div>
      )}

      {/* Humphry Component with Lottie as Background */}
      <div
        onClick={handleActivation}
        className={`fixed rounded-full transition-all duration-300 cursor-pointer z-20 ${
          isActive
            ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-512 h-512"
            : "bottom-4 right-4 w-16 h-16 md:w-36 md:h-36 max-md:bottom-4 max-md:right-[calc(50%-2rem)] z-20"
        }`}
      >
        {/* Lottie Background */}
        <Lottie
          animationData={HumphryAnimation}
          loop
          className={`absolute object-cover pointer-events-none z-20 ${isActive ? "inset-0 h-full w-full" : "inset-0 max-md:-inset-8 h-full w-full max-md:w-32 max-md:h-32"}`}
        />

        {/* Foreground Content */}
        <div className="relative flex items-center justify-center h-full z-20">
          {isActive ? (
            <p className="text-white text-center text-lg">Joseph is working on this :)</p>
          ) : (
            <>
              <img
                src="/aide.png"
                alt="Humphry"
                className="w-12 h-12 rounded-full"
              />
              <div className="absolute -top-10 text-sm bg-gray-800/40 text-white px-3 py-1 rounded shadow max-md:hidden">
                Ask Humphry
              </div>
            </>
          )}
        </div>
      </div>

      {/* Text Input Field */}
      {isActive && (
        <div className="fixed top-[68%] left-1/2 transform -translate-x-1/2 w-96 z-50 text-gray-500 hidden">
          <textarea
            value={inputValue}  
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-4 text-lg rounded-lg shadow-lg border-2 border-p1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder={
              micAccess === false
                ? "Mic access denied. Type your query here..."
                : "Speak or type your query here..."
            }
            rows={3}
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default Humphry;