import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LiveTranscript = ({ messages, currentTimestamp, isDarkMode }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const scrollRef = useRef(null); // Ref for auto-scrolling

  useEffect(() => {
    // Add messages dynamically based on the current timestamp
    const newMessages = messages.filter(
      (message) =>
        message.timestamp <= currentTimestamp &&
        !displayedMessages.some((m) => m.timestamp === message.timestamp)
    );

    if (newMessages.length > 0) {
      setDisplayedMessages((prev) => [...prev, ...newMessages]);
    }
  }, [currentTimestamp, messages, displayedMessages]);

  useEffect(() => {
    // Scroll to the bottom whenever a new message is added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  const calculateTimeDiff = (timestamp1, timestamp2) => {
    const [min1, sec1] = timestamp1.split(":").map(Number);
    const [min2, sec2] = timestamp2.split(":").map(Number);
    return min2 * 60 + sec2 - (min1 * 60 + sec1);
  };

  const bgColor = isDarkMode ? "bg-s1" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-700";
  const borderColor = isDarkMode ? "border-p1" : "border-p1/10";

  return (
    <div
      ref={scrollRef}
      className={`flex-col p-4 border-2 rounded-xl md:h-[390px] h-[200px] overflow-y-auto ${bgColor} ${borderColor}`}
    >
      {/* Sticky Label */}
      <div
        className={`sticky -top-4 z-10 p-3 ${
          isDarkMode ? "bg-s1 text-gray-100" : "bg-white text-gray-700"
        } border-b border-p1`}
      >
        <p className="text-sm font-semibold">Live Transcript</p>
      </div>

      {/* Message List */}
      <div className="space-y-4 flex flex-col justify-start">
        {displayedMessages.map((msg, index) => {
          // Calculate the duration based on the time difference
          const nextTimestamp =
            index < messages.length - 1 ? messages[index + 1].timestamp : null;
          const duration = nextTimestamp
            ? calculateTimeDiff(msg.timestamp, nextTimestamp)
            : 3; // Default duration if it's the last message

          return (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: 0.2, // Delay before the animation starts
                    staggerChildren: duration / msg.text.split(" ").length, // Dynamic delay per word
                  },
                },
              }}
              className={`p-3 rounded-xl max-w-[75%] mt-4 ${
                !msg.isAgent
                  ? msg.isGuest
                    ? `${
                        isDarkMode
                          ? "bg-p3 : bg-p3/50"
                          : "bg-p3/50 text-yellow-900"
                      } self-start rounded-tl-none`
                    : `${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-800"
                      } self-start rounded-tl-none`
                  : `${
                      isDarkMode
                        ? "bg-orange-800 text-orange-300"
                        : "bg-p1 text-p4"
                    } self-end rounded-tr-none`
              }`}
            >
              {msg.text.split(" ").map((word, wordIndex) => (
                <motion.span
                  key={wordIndex}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveTranscript;