import { appState } from "@/appState"; // Application state for user data
import axios from "axios";

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"; // Firestore functions
import { db } from "../../../firebase"; // Firestore instance

const GITHUB_API_URL =
  "https://api.github.com/repos/:owner/:repo/contents/:path";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const GITHUB_OWNER = "jospehB-ReplicAIDE";
const GITHUB_REPO = "PoC-Files";
const API_URL = "http://sea.replicaide.com:8000/api/process_item/";

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      console.log("File successfully converted to Base64");
      resolve(reader.result.split(",")[1]); // Strip metadata
    };

    reader.onerror = (error) => {
      console.error("Error converting file to Base64:", error);
      reject(error);
    };

    if (!(file instanceof Blob)) {
      console.error("Error: Provided input is not a Blob or File");
      reject(new TypeError("Provided input is not a Blob or File"));
      return;
    }

    reader.readAsDataURL(file);
  });
};

/**
 * Upload a file to GitHub repository.
 * @param {File} file - The file to be uploaded.
 * @param {string} fileName - The path within the repository to save the file.
 * @returns {string} - The download URL of the uploaded file.
 */
export const uploadFileToGitHub = async (file, fileName) => {
  if (!GITHUB_TOKEN) {
    console.error("GitHub token is not defined. Check your .env file.");
    throw new Error("GitHub token is missing.");
  }

  try {
    const base64Content = await fileToBase64(file);

    // Construct the API URL for the file
    const fileUrl = GITHUB_API_URL.replace(":owner", GITHUB_OWNER)
      .replace(":repo", GITHUB_REPO)
      .replace(":path", fileName);

    let existingFileSha = null;

    try {
      // Check if the file already exists
      const checkResponse = await axios.get(fileUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      existingFileSha = checkResponse.data.sha; // Get the SHA for updates
    } catch (checkError) {
      if (checkError.response && checkError.response.status === 404) {
        console.log("File does not exist. Creating a new one.");
      } else {
        console.error("Error checking file existence:", checkError);
        throw checkError;
      }
    }

    // Upload or update the file
    const response = await axios.put(
      fileUrl,
      {
        message: `Add or update ${fileName}`,
        content: base64Content,
        ...(existingFileSha ? { sha: existingFileSha } : {}), // Include SHA for updates
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.content.download_url; // Return the file URL
  } catch (error) {
    console.error(`Error uploading ${fileName} to GitHub:`, error);
    throw error;
  }
};

export const uploadFileToGitHubNoConversion = async (file, fileName) => {
  if (!GITHUB_TOKEN) {
    console.error("GitHub token is not defined. Check your .env file.");
    throw new Error("GitHub token is missing.");
  }

  try {
    // Construct the API URL for the file
    const fileUrl = GITHUB_API_URL.replace(":owner", GITHUB_OWNER)
      .replace(":repo", GITHUB_REPO)
      .replace(":path", fileName);

    let existingFileSha = null;

    try {
      // Check if the file already exists
      const checkResponse = await axios.get(fileUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      existingFileSha = checkResponse.data.sha; // Get the SHA for updates
    } catch (checkError) {
      if (checkError.response && checkError.response.status === 404) {
        console.log("File does not exist. Creating a new one.");
      } else {
        console.error("Error checking file existence:", checkError);
        throw checkError;
      }
    }

    // Upload or update the file
    const response = await axios.put(
      fileUrl,
      {
        message: `Add or update ${fileName}`,
        content: file,
        ...(existingFileSha ? { sha: existingFileSha } : {}), // Include SHA for updates
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.content.download_url; // Return the file URL
  } catch (error) {
    console.error(`Error uploading ${fileName} to GitHub:`, error);
    throw error;
  }
};

/**
 * Save listing data by sending a POST request.
 * @param {Object} payload - Contains image and audio links.
 * @returns {Promise<Object>} The response data.
 */
export const saveListing = async ({ imageLink, audioLink }) => {
  console.log("TO PROCESS : SENDING TO BEN");

  if (!appState.user) {
    console.error("User information is not available in appState.");
    throw new Error("User is not authenticated.");
  }

  if (!audioLink && !imageLink) {
    console.log("audioLink:", audioLink);
    console.log("imageLink:", imageLink);
    console.error("BROKEN LINKS.");
    throw new Error("BROKEN LINKS.");
  }

  const formData = {
    Location: {
      city: appState.user?.Location.city,
      state: appState.user?.Location.state,
      country: appState.user?.Location.country,
    },
    Persona: {
      role: appState.user?.Persona.role,
      temperament: appState.user?.Persona.temperament,
    },
    Audio: audioLink,
    Image: imageLink,
  };

  console.log("TO PROCESS : SENDING TO BEN", JSON.stringify(formData));

  try {
    // Send formData to the server
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      throw new Error(`Server Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Successfully saved:", JSON.stringify(responseData));

    // Transform the server response into the desired format
    const transformedData = transformApiResponse(responseData);

    // Save the transformed data to Firebase
    await saveToFirebase(transformedData);

    console.log("Transformed data saved to Firebase:", transformedData);

    return transformedData; // Return the final transformed data
  } catch (error) {
    console.error("Error processing and saving data:", error);
    throw error;
  }
};

/**
 * Main function to handle uploading files and saving listing data.
 * @param {File} imageFile - The image file to upload.
 * @param {File} audioFile - The audio file to upload.
 * @returns {Promise<Object>} The saved listing data.
 */

export const processListing = async ({ uploadedFile, audioBlob }) => {
  // Validate inputs
  if (!(uploadedFile instanceof Blob)) {
    console.error("Uploaded image is not a valid Blob or File:", uploadedFile);
    throw new TypeError("Uploaded image is not a Blob or File.");
  }

  if (!(audioBlob instanceof Blob)) {
    console.error("Uploaded audio is not a valid Blob or File:", audioBlob);
    throw new TypeError("Uploaded audio is not a Blob or File.");
  }

  try {
    console.log("Uploading image...");
    const imageLink = await uploadFileToGitHub(
      uploadedFile,
      `images/${uploadedFile.name}`
    );
    console.log("Image uploaded successfully:", imageLink);

    console.log("Uploading audio...");
    const audioLink = await uploadFileToGitHub(
      audioBlob,
      `audio/${audioBlob.name}`
    );
    console.log("Audio uploaded successfully:", audioLink);

    if (!imageLink || !audioLink) {
      throw new Error("Failed to generate one or more links.");
    }

    // Save the listing once links are generated
    console.log("Processing...");
    // const response = await saveListing({ imageLink, audioLink });

    const response = await analyzeMedia(audioLink, imageLink);

    console.log("Listing saved successfully:", response);

    return response; // Return the response from the saveListing function
  } catch (error) {
    console.error("Error processing listing:", error);
    throw error; // Propagate the error for the calling function to handle
  }
};

import { ElevenLabsClient } from "elevenlabs";
import OpenAI from "openai";

const client = new ElevenLabsClient({
  apiKey: process.env.NEXT_PUBLIC_ELEVEN_API_KEY,
});

/**
 * Convert text to speech using ElevenLabs
 * @param {string} modelId - The ElevenLabs model ID to use.
 * @param {string} text - The text to convert to speech.
 * @returns {string} - URL of the uploaded audio file.
 */
export const TTS = async (modelId, text) => {
  try {
    // ElevenLabs API endpoint
    const TTS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${modelId}/stream`;

    // Send POST request to ElevenLabs
    const response = await axios.post(
      TTS_API_URL,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.NEXT_PUBLIC_ELEVEN_API_KEY, // Replace with your ElevenLabs API key
        },
        responseType: "arraybuffer", // Ensure we get binary data
      }
    );

    console.log("TTS Response:", response);

    // Convert the response data to a Blob
    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });

    console.log("Audio Blob:", audioBlob);

    // Generate a unique file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `audio_${timestamp}.mp3`;

    // Upload the audio file to GitHub
    const audioUrl = await uploadFileToGitHub(audioBlob, fileName);

    console.log("Uploaded Audio URL:", audioUrl);

    return audioUrl;
  } catch (error) {
    console.error("Error generating TTS:", error.response?.data || error.message);
    throw new Error("Failed to generate text-to-speech.");
  }
};

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Set your API key here
  dangerouslyAllowBrowser: true,
});

/**
 * Process audio and image using OpenAI API
 * @param {string} audioUrl - The URL of the audio file
 * @param {string} imageUrl - The URL of the image file
 * @returns {Promise<object>} - Transformed data or error response
 */
export const analyzeMedia = async (audioUrl, imageUrl) => {
  try {
    // Define the OpenAI prompt
    const prompt = `
      You are an intelligent assistant tasked with analyzing audio and image files from given URLs and generating a structured JSON response. Here are the requirements:

      1. Input: You will receive a JSON object containing two fields:
         - audio: A URL linking to an audio file.
         - image: A URL linking to an image file.

      2. Output: Provide a JSON object in the following format:
         {
           audio: "Link to the audio (keep it the same as the input)",
           image: "Link to the image (keep it the same as the input)",
           eng: {
             title: "Short title in English based on the audio and image content",
             description: "description in English describing the audio content confirmed by the image, don't start with "audio description of.." put directly what the audio describes.",
             marketing_description: "Catchy marketing description in English, describing the ingredients, taste, mid length",
           },
           esp: {
             title: "Short title in Spanish based on the audio and image content",
             description: "description in Spanish describing the audio content confirmed by the image, don't start with "audio description of.." put directly what the audio describes.",
             marketing_description: "Catchy marketing description in Spanish, describing the ingredients, taste, mid length",
           },
           price: "Price of the product or service as inferred from the content, or suggest a price if not specified"
         }

      3. Error Handling:
         - If there is an issue processing the input (e.g., invalid URL, missing content, or any other issue), return the following JSON format:
           {
             error: "Description of the error"
           }
    `;

    const userInput = `
        audio: ${audioUrl}
        /n
        image: ${imageUrl}
      `;

    console.log(userInput);

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "media_analysis_schema",
          schema: {
            type: "object",
            properties: {
              audio: {
                description: "The input audio link",
                type: "string",
              },
              image: {
                description: "The input image link",
                type: "string",
              },
              eng: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  marketing_description: { type: "string" },
                },
                required: ["title", "description", "marketing_description"],
              },
              esp: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  marketing_description: { type: "string" },
                },
                required: ["title", "description", "marketing_description"],
              },
              price: {
                description: "The inferred price or 'Not specified'",
                type: "string",
              },
            },
            required: ["audio", "image", "eng", "esp", "price"],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.2,
    });

    console.log(completion.choices[0].message.content);

    const outputobj = JSON.parse(completion.choices[0].message.content);

    // Validate required fields in the parsed object
    if (
      !outputobj.audio ||
      !outputobj.image ||
      !outputobj.eng ||
      !outputobj.esp
    ) {
      throw new Error("Invalid data structure: Required fields are missing.");
    }

    // Generate TTS for marketing descriptions and get links
    console.log("Generating TTS for English...");
    const engEnhancedAudio = await TTS(
      "21m00Tcm4TlvDq8ikWAM",
      outputobj.eng.marketing_description
    );
    console.log("English TTS Link:", engEnhancedAudio);

    console.log("Generating TTS for Spanish...");
    const espEnhancedAudio = await TTS(
      "tTQzD8U9VSnJgfwC6HbY",
      outputobj.esp.marketing_description
    );
    console.log("Spanish TTS Link:", espEnhancedAudio);

    // Add the enhanced audio URLs to the output object
    outputobj.eng.enhanced_audio = engEnhancedAudio;
    outputobj.esp.enhanced_audio = espEnhancedAudio;

    console.log(outputobj);

    // Extract the structured content from the response
    const output = saveToFirebase(JSON.stringify(outputobj));

    return output; // Already formatted as JSON per schema
  } catch (error) {
    console.error("Error analyzing media:", error.message);
    return {
      error: error.message,
    };
  }
};

/**
 * Converts the API response into the desired structure.
 * @param {Object} response - The API response object.
 * @returns {Object} - Transformed object in the desired structure.
 */
export const transformApiResponse = (response) => {
  if (!response || response.status !== "completed") {
    throw new Error("Invalid or incomplete API response.");
  }

  const { input, processed_output } = response;

  // Extract required fields
  const transformedData = {
    audio: input.audio,
    enhanced_audio: input.audio,
    image: input.image,
    eng: {
      title: processed_output.english.title,
      description: processed_output.english.description,
      price: parseFloat(processed_output.price.replace(" USD", "")), // Convert price to a float
    },
    esp: {
      title: processed_output.spanish.title,
      description: processed_output.spanish.description,
      price: parseFloat(processed_output.price.replace(" USD", "")), // Use the same price for Spanish
    },
    price: processed_output.price,
  };

  return transformedData;
};

/**
 * Saves the JSON output from ChatGPT to a Firebase Firestore collection.
 * @param {string} jsonData - The JSON string output from ChatGPT.
 * @returns {Promise<string>} - Promise resolving to the document ID on success.
 */
export const saveToFirebase = async (jsonData) => {
  if (!jsonData) {
    throw new Error("No JSON data provided to save.");
  }

  try {
    // Parse the JSON string into an object
    const dataObject = JSON.parse(jsonData);

    // Validate required fields in the parsed object
    if (
      !dataObject.audio ||
      !dataObject.image ||
      !dataObject.eng ||
      !dataObject.esp
    ) {
      throw new Error("Invalid data structure: Required fields are missing.");
    }

    if (appState.user) {
      dataObject.Location = appState.user.Location
      dataObject.Persona = appState.user.Persona
    }

    dataObject.timestamp = new Date().toISOString();

    // Add the parsed object to the Firestore collection
    const docRef = await addDoc(collection(db, "menu_items"), dataObject);

    console.log("Document successfully written with ID:", docRef.id);
    return docRef.id; // Return the document ID for reference
  } catch (error) {
    console.error("Error saving to Firestore:", error.message);
    throw error;
  }
};

export const fetchRecipes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "menu_items"));
    const recipes = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes from Firestore:", error);
    throw error;
  }
};

/**
 * Processes the API response and saves the transformed data to Firestore.
 * @param {Object} apiResponse - The API response object.
 * @returns {Promise<void>} - Promise resolving to void on success.
 */
export const processAndSave = async (apiResponse) => {
  try {
    // Transform the API response
    const transformedData = transformApiResponse(apiResponse);

    // Save transformed data to Firebase
    await saveToFirebase(transformedData);

    console.log("Data successfully transformed and saved.");
  } catch (error) {
    console.error("Error processing and saving data:", error);
    throw error;
  }
};

/**
 * Fetch a single recipe/document by ID from Firestore.
 * @param {string} id - The ID of the document to fetch.
 * @returns {Object} The document data, including the ID.
 */
export const fetchRecipeById = async (id) => {
  try {
    // Reference to the document in the "menu_items" collection
    const docRef = doc(db, "menu_items", id);

    // Get the document
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }; // Include the document ID
    } else {
      console.error(`No document found with ID: ${id}`);
      return null; // Or throw an error if preferred
    }
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id} from Firestore:`, error);
    throw error;
  }
};

/**
 * Delete a document by ID from Firestore.
 * @param {string} id - The ID of the document to delete.
 * @returns {void} - Logs success or throws an error.
 */
export const deleteRecipeById = async (id) => {
  try {
    // Reference to the document in the "menu_items" collection
    const docRef = doc(db, "menu_items", id);

    // Delete the document
    await deleteDoc(docRef);

    console.log(`Document with ID: ${id} successfully deleted.`);
  } catch (error) {
    console.error(`Error deleting recipe with ID ${id} from Firestore:`, error);
    throw error;
  }
};

import { updateDoc } from "firebase/firestore";

/**
 * Update a recipe/document by ID in Firestore.
 * @param {string} id - The ID of the document to update.
 * @param {Object} updates - The fields to update (title, description, price).
 * @returns {void} - Logs success or throws an error.
 */
export const updateRecipeById = async (id, updates) => {
  try {
    // Reference to the document in the "menu_items" collection
    const docRef = doc(db, "menu_items", id);

    // Determine the language based on appState
    const isEnglish = appState.isEnglish;

    // Prepare the update object
    const updateObject = {};
    if (updates.title) {
      updateObject[`${isEnglish ? "eng" : "esp"}.title`] = updates.title;
    }
    if (updates.description) {
      updateObject[`${isEnglish ? "eng" : "esp"}.description`] = updates.description;
    }
    if (updates.price) {
      updateObject["price"] = updates.price; // Price is typically not language-specific
    }

    // Update the document in Firestore
    await updateDoc(docRef, updateObject);

    console.log(`Document with ID: ${id} successfully updated.`);
  } catch (error) {
    console.error(`Error updating recipe with ID ${id} in Firestore:`, error);
    throw error;
  }
};