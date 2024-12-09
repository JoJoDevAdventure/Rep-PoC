"use client";

import { fetchRecipes } from "@/app/dashboard/Service"; // Import fetchRecipes function
import { appState } from "@/appState"; // Import appState to check language preference
import { Conversation } from "@11labs/client"; // Import ElevenLabs Conversation SDK
import Lottie from "lottie-react";
import { useRef, useState } from "react";
import HumphryAnimation from "./animations/Humphry.json";

const Humphry = () => {
  const [isActive, setIsActive] = useState(false); // State for activating Humphry
  const [isListening, setIsListening] = useState(false); // State for speech recognition activity
  const [agentOutput, setAgentOutput] = useState("Hello! How can I help you?"); // State for agent's real-time output
  const [orderDetails, setOrderDetails] = useState(null); // State for storing final order JSON
  const recipesRef = useRef([]); // Ref for storing menu items
  var conversation = null; // Ref for the ElevenLabs conversation instance
  const orderIdRef = useRef(1); // Ref for tracking incremental order IDs

  // Temporary storage for the order being built
  const orderInProgress = useRef({
    customerName: "",
    items: [],
  });

  const isEnglish = appState.isEnglish; // Check language preference

  // Fetch menu items when Humphry is activated
  const fetchMenuItems = async () => {
    try {
      const recipes = await fetchRecipes();
      recipesRef.current = recipes;
      console.log("Fetched Recipes:", recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const activateAgent = async () => {

    try {
      setIsListening(true);

      const menuPrompt = recipesRef.current
        .map((item) => `${item.eng.title}: $${item.price || item.eng.price}`)
        .join(", ");

      const prompts = {
        english: {
          welcome: "Welcome! What is your name?",
          menu: `You are a restaurant assistant. Here's the menu: ${menuPrompt}. Guide the user to:
                1. Provide their name.
                2. Specify the items they want to order (name and quantity).
                3. Confirm the order, then disconnect.`,
        },
        spanish: {
          welcome: "¡Bienvenido! ¿Cómo te llamas?",
          menu: `Eres un asistente de restaurante. Aquí está el menú: ${menuPrompt}. Guía al usuario para que:
                1. Proporcione su nombre.
                2. Especifique los artículos que desea pedir (nombre y cantidad).
                3. Confirme el pedido y luego desconéctese.`,
        },
      };

      const selectedPrompts = isEnglish ? prompts.english : prompts.spanish;

      conversation = await Conversation.startSession({
        agentId: "r2dDTXolSUflTXcUMhbp", // Replace with your ElevenLabs Agent ID

        overrides: {
          agent: {
            prompt: {
              prompt: selectedPrompts.menu,
            },
            first_message: selectedPrompts.welcome,
          },
          tts: {
            voiceId: "", // Optional: Provide a voice ID override
          },
        },

        onConnect: () => {
          console.log("Connected to the conversation.");
        },

        onMessage: (props) => {
          // Log the incoming message
          console.log("Received Message:");
          console.log("Source:", props.source); // "user" or "ai"
          console.log("Message:", props.message);
          setAgentOutput(props.message);
        },

        onError: (message, context) => {
          // Log any errors
          console.error("Error in conversation:", message, context);
        },
      });
    } catch (error) {
      console.error("Error starting agent conversation:", error);
      setAgentOutput(isEnglish ? "Sorry, something went wrong." : "Lo siento, algo salió mal.");
    } finally {
      setIsListening(false);
    }
  };

  // Generate the order JSON after the conversation ends
  const finalizeOrder = (order) => {
    const totalPrice = order.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const orderJson = {
      id: orderIdRef.current++,
      customer: order.customerName,
      items: order.items
        .map((item) => `${item.quantity}x ${item.name}`)
        .join(", "),
      total: `$${totalPrice.toFixed(2)}`,
      progress: 0,
    };

    setOrderDetails(orderJson);
    console.log("Order JSON:", orderJson);
  };

// Stop the agent and mic when the black background is clicked
const handleBackgroundClick = async () => {
  try {
    // Stop the microphone stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = stream.getTracks(); // Get all tracks from the stream
      tracks.forEach((track) => track.stop()); // Stop each track
    }

    // End the ElevenLabs conversation session
    if (conversationRef.current) {
      await conversationRef.current.endSession();
    }
  } catch (error) {
    console.error("Error stopping session or microphone:", error);
  } finally {
    // Reset the state
    setIsActive(false);
    setIsListening(false);
    conversationRef.current = null; // Clear the conversation reference
  }
};

  // Toggle Humphry's activation state
  const handleActivation = async () => {
    if (!isActive) {
      await fetchMenuItems(); // Fetch recipes on activation
      activateAgent(); // Start the agent interaction
    }
    setIsActive((prev) => !prev);
  };

  return (
    <div>
      {/* Dark Background when Humphry is Active */}
      {isActive && (
        <div
          onClick={handleBackgroundClick}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
        ></div>
      )}

      {/* Humphry Component with Lottie as Background */}
      <div
        onClick={handleActivation}
        className={`fixed rounded-full transition-all duration-300 cursor-pointer z-50 ${
          isActive
            ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[512px] h-[512px]"
            : "bottom-22 right-4 w-16 h-16 md:w-36 md:h-36"
        }`}
      >
        {/* Lottie Background */}
        <Lottie
          animationData={HumphryAnimation}
          loop
          className={`absolute object-cover pointer-events-none z-20 ${
            isActive
              ? "inset-0 h-full w-full"
              : "inset-0 max-md:-inset-8 h-full w-full max-md:w-32 max-md:h-32"
          }`}
        />

        {/* Foreground Content */}
        <div className="relative flex items-center justify-center h-full z-20">
          {isActive ? (
            <div className="text-center">
              {isListening ? (
                <p className="text-white text-xl">
                  {isEnglish ? "Listening..." : "Escuchando..."}
                </p>
              ) : (
                <p className="text-white text-xl">{agentOutput}</p>
              )}
            </div>
          ) : (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="#ffff"
              >
                <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Display Order JSON */}
      {orderDetails && (
        <div className="fixed bottom-10 left-10 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">{isEnglish ? "Order JSON:" : "JSON del Pedido:"}</h3>
          <pre className="text-sm">{JSON.stringify(orderDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Humphry;