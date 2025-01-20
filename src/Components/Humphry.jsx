"use client";

import { extractOrder, fetchRecipes, saveOrderToFirebase } from "@/app/dashboard/Service"; // Import fetchRecipes function
import { Conversation } from "@11labs/client"; // Import ElevenLabs Conversation SDK
import Lottie from "lottie-react";
import { useRef, useState } from "react";
import HumphryAnimation from "./animations/Humphry.json";

const Humphry = ({ onSave }) => {
  const [isActive, setIsActive] = useState(true); // State for activating Humphry
  const [isListening, setIsListening] = useState(false); // State for speech recognition activity
  const [agentOutput, setAgentOutput] = useState("Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum"); // State for agent's real-time output
  const [orderDetails, setOrderDetails] = useState(null); // State for storing final order JSON
  const [languageMenu, setLanguageMenu] = useState(false); // State for showing the language menu
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // State for the selected language
  const recipesRef = useRef([]); // Ref for storing menu items
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]); // Array of messages for LiveTranscript
  const [order, setOrder] = useState({
    customerName: "",
    items: [
    ],
  }); // State for storing the final order

  const languageOptions = [
    { name: "English", code: "en", voiceId: "UgBBYS2sOqTuMpoF3BR0" },
    { name: "Spanish", code: "es", voiceId: "tTQzD8U9VSnJgfwC6HbY" },
    { name: "French", code: "fr", voiceId: "UgBBYS2sOqTuMpoF3BR0" },
    { name: "Russian", code: "ru", voiceId: "UgBBYS2sOqTuMpoF3BR0" },
  ];

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

  const handleSave = async () => {
    onSave()
    await saveOrderToFirebase(JSON.stringify(order))
    console.log("Order Saved:", order);
    conversation.endSession()
    setIsActive(false)
  };

  const activateAgent = async (language) => {
    try {
      setIsListening(true);

      const menuPrompt = recipesRef.current
        .map(
          (item) =>
            `${item.language.title}: $${item.price.formatted || item.price}`
        )
        .join(", ");

      const selectedLangDetails = languageOptions.find(
        (lang) => lang.name === language
      );

      // Dynamic prompt based on selected language
      const languagePrompts = {
        en: `You are a restaurant assistant. Here is the menu: ${menuPrompt}. Guide the user to first:
          1. first Provide their name.
          2. Specify the items they want to order (name and quantity).
          3. Confirm the order, then disconnect.`,
        es: `Eres un asistente de restaurante. Aquí está el menú: ${menuPrompt}. Guía al usuario para:
          1. primera Proporcionar su nombre.
          2. Especificar los artículos que desea pedir (nombre y cantidad).
          3. Confirmar el pedido, luego desconectar.`,
        fr: `Vous êtes un assistant de restaurant. Voici le menu: ${menuPrompt}. Guidez l'utilisateur pour:
          1. Fournir leur nom.
          2. Spécifier les articles qu'ils souhaitent commander (nom et quantité).
          3. Confirmer la commande, puis se déconnecter.`,
        ru: `Вы ресторанный помощник. Вот меню: ${menuPrompt}. Направьте пользователя на:
          1. Указать свое имя.
          2. Указать товары, которые они хотят заказать (название и количество).
          3. Подтвердите заказ, затем отключитесь.`,
      };

      const agentId = "pw2mcvCWjkggSVY3Y6Aa"; // Replace with your Eleven Labs Agent ID

      const conv = await Conversation.startSession({
        agentId,
        overrides: {
          agent: {
            prompt: {
              prompt: languagePrompts[selectedLangDetails.code],
            },
            firstMessage:
              selectedLangDetails.name === "English"
                ? "Hello! I'm John, How can I assist you today?"
                : selectedLangDetails.name === "French" ? 
                "Bonjour! Je m'appelle John, comment puis-je vous aider aujourd'hui?" 
                : selectedLangDetails.name === "Russian" ? 
                ""
                :
                "¡Hola! Soy Nathalia, ¿Cómo puedo ayudarte hoy?",
            language: selectedLangDetails.code, // Set the agent's language
          },
          tts: {
            voiceId: selectedLangDetails.voiceId, // Set the agent's Voice ID dynamically
          },
        },

        onMessage: async (props) => {
          console.log("Message Received:", props);

          setAgentOutput(props.message)

          // Append the new message to the array
          setMessages((prevMessages) => {
            const updatedMessages = [
              ...prevMessages,
              { source: props.source, message: props.message },
            ];

            // Trigger the extraction logic if there are 4 or more messages
            if (
              updatedMessages.length >= 4 &&
              updatedMessages.length % 2 === 0
            ) {
              extractOrder(updatedMessages).then((data) => {
                if (data) {
                  console.log("Extracted Order Data:", data);
                  setOrder(data); // Update listing data
                }
              });
            }

            return updatedMessages; // Update the state with the new messages
          });
        },

        onError: (error) => {
          console.error("Agent Error:", error);
        },

        onDisconnect: () => {
          console.log("Agent Disconnected Successfully");
        },

        onModeChange: (prop) => {
          console.log("Agent Changed Mode : ", prop);
        },

        onStatusChange: (prop) => {
          console.log("Agent Status Changed : ", prop);
        },
      });

      setConversation(conv);
    } catch (error) {
      console.error("Error starting the conversation with the agent:", error);
      setAgentOutput("Sorry, something went wrong.");
    } finally {
      setIsListening(false);
    }
  };

  const handleActivation = async () => {
    if (!isActive) {
      setLanguageMenu(true); // Show the language menu first
    } else {
    }
  };

  const handleDeActivation = async () => {
    if (isActive) {
      conversation.endSession()
      setIsActive(false)
      setLanguageMenu(false); // Show the language menu first
    }
  };

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language); // Set the selected language
    setLanguageMenu(false); // Hide the language menu
    await fetchMenuItems(); // Fetch recipes before starting the call
    activateAgent(language); // Start the agent interaction with the selected language
    setIsActive(true); // Activate Humphry
  };

  return (
    <div>
      {/* Dark Background when Humphry is Active */}
      {isActive && (
        <div
          onClick={() => setLanguageMenu(false)}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* Language Selection Menu */}
      {languageMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-3">
            <h3 className="text-lg font-bold mb-4 text-p1">
              Select a Language
            </h3>
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.name)}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 rounded"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
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
        <Lottie
          animationData={HumphryAnimation}
          loop
          className={`absolute object-cover pointer-events-none z-20 ${
            isActive
              ? "inset-0 -top-40 h-full w-full"
              : "inset-0 max-md:-inset-8 h-full w-full max-md:w-32 max-md:h-32"
          }`}
        />

        <div className="relative flex items-center justify-center h-full z-20">
          {isActive ? (
            <div className="text-center">
              {isListening ? (
                <p className="text-white text-xl">
                  {selectedLanguage === "English"
                    ? "Listening..."
                    : "Escuchando..."}
                </p>
              ) : (
                <p className="text-white text-l max-w-[80vw] ml-[15%]">
                  {agentOutput}
                </p>
              )}

              {/* Input Form */}
              <div className="relative transform inset-0 top-22 bg-white p-6 rounded-lg shadow-lg z-40 min-w-[88%] text-gray-800">
                <div className="flex flex-col gap-4">
                  {/* Customer Name */}
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={order.customerName}
                    onChange={(e) =>
                      setOrder((prevOrder) => ({
                        ...prevOrder,
                        customerName: e.target.value,
                      }))
                    }
                    className="p-3 border rounded"
                  />

                  {/* Items */}
                  <div className="flex flex-col gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        {/* Quantity Input */}
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            setOrder((prevOrder) => {
                              const updatedItems = [...prevOrder.items];
                              updatedItems[index].quantity =
                                parseInt(e.target.value) || 0;
                              return { ...prevOrder, items: updatedItems };
                            })
                          }
                          className="p-2 border rounded w-16 text-center"
                          placeholder="Qty"
                        />

                        {/* Item Name Input */}
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            setOrder((prevOrder) => {
                              const updatedItems = [...prevOrder.items];
                              updatedItems[index].name = e.target.value;
                              return { ...prevOrder, items: updatedItems };
                            })
                          }
                          className="p-2 border rounded flex-1 w-full"
                          placeholder="Item Name"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-between">
                    <button
                      onClick={handleDeActivation}
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              viewBox="0 -960 960 960"
              width="32px"
              fill="#ffff"
            >
              <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
            </svg>
          )}
        </div>
      </div>

      {/* Display Order JSON */}
      {orderDetails && (
        <div className="fixed bottom-10 left-10 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">
            {selectedLanguage === "English"
              ? "Order JSON:"
              : "JSON del Pedido:"}
          </h3>
          <pre className="text-sm">{JSON.stringify(orderDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Humphry;
