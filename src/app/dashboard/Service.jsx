import { appState } from "@/appState"; // Application state for user data
import axios from "axios";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore"; // Firestore functions
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
    console.log("Processing via Pipedream...");
    await analyzeMedia(audioLink, imageLink);

  } catch (error) {
    console.log(error);
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
    console.error(
      "Error generating TTS:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate text-to-speech.");
  }
};

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Set your API key here
  dangerouslyAllowBrowser: true,
});

/**
 * Transcribe audio using OpenAI Whisper API
 * @param {string} audioUrl - The URL of the audio file
 * @returns {Promise<string>} - Transcription of the audio
 */
export const transcribeAudio = async (audioBlob) => {
  try {
    // Step 1: Prepare FormData
    const formData = new FormData();
    const fileName = "audio.mp3"; // Ensure correct extension
    const processedFile = new File([audioBlob], fileName, {
      type: "audio/mpeg",
    });
    formData.append("file", processedFile);
    formData.append("model", "whisper-1");

    // Step 2: Debug FormData Contents
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Step 3: Send POST Request to OpenAI Whisper API
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Replace with your API key
        },
      }
    );

    console.log("Transcription Response:", response.data);

    return response.data.text;
  } catch (error) {
    console.error(
      "Error transcribing audio:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to transcribe audio. Please check the input URL or file format."
    );
  }
};


/**
 * Process audio and image using OpenAI API
 * @param {string} audioUrl - The URL of the audio file
 * @param {string} imageUrl - The URL of the image file
 * @returns {Promise<object>} - Transformed data or error response
 */
export const analyzeMedias = async (audioUrl, imageUrl, audioBlob) => {
  try {

    const audio_transcription = await transcribeAudio(audioBlob); // Path to your audio file

    if (audio_transcription == null) {
      throw Error("Audio not transcribed", audioBlob);
    }

    // Define the OpenAI prompt
    const prompt = `
You are an AI assistant tasked with analyzing an image input and audio transcription. Your output should be a structured JSON object based solely on the visible content of the image and information from the transcription JUST JSON starting with "{".

Instructions:
1. **Image Analysis**:
   - Describe exactly what is visible in the image, it's either JPEG or PNG format.
   - Avoid assumptions unless clearly inferable from the content.
   - Focus on factual observations: food, objects, colors, patterns, or text.
   - If the URL is invalid ignore and base only on audio_transcription.

2. Output JSON Format:
   - Retain the same input URLs for audio and image.
   - Respond only with a json, starting with '{' and ending with '}'
   - Provide both English and Spanish descriptions as follows:
   
   {
     "audio": "Link to the audio (same as input)",
     "image": "Link to the image (same as input)",
     "audio_transcription": "(same as input)",
     "eng": {
       "title": "Short, 2-3 words precise title in English",
       "description": "3 lines description in English of what's visible in the image and any relevant information from the audio transcription. don't mention the price in the description.",
       "marketing_description": "Catchy marketing description in English based on the image content, 2-3 sentences"
     },
     "esp": {
       "title": "Short, 2-3 words precise title in Spanish",
       "description": "3 lines description in Spanish of what's visible in the image and any relevant information from the audio transcription. don't mention the price in the description. don't start with "this image is",
       "marketing_description": "Catchy marketing description in Spanish based on the image content, 2-3 sentences, don't mention 'This image...' ."
     },
     "price": "Get the price from analyzing the audio transcription if mentioned; otherwise, suggest a convenient price. just the price, don't form a sentence, format : Currency XX.XX
   }

3. **Error Handling**:
   - If the URLs are invalid or content cannot be analyzed, return:
     {
       "error": "Return an error message here, if something wrong with the image : 'Image couldn't be analysed due to copyright restrictions' if something wrong with audio_transcription 'Audio is invalid, please try again.' "
     }

4. **Additional Notes**:
   - Avoid starting descriptions with "This is a..." or "The image describes/shows...".
   - Marketing descriptions should be engaging but relevant to the image.
   - Avoid starting titles with "delicious" or other generic words.

Input JSON:
{
  "audio_transcription": "${audio_transcription}",
  "image": "${imageUrl}",
  "audio": "${audioUrl}"
}
`;
    console.log("User Input:", {
      audio: audioUrl,
      image: imageUrl,
      audio_transcription,
    });

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format : { "type": "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;

    console.log("Raw API Response:", responseContent);

    // Extract everything between the first '{' and the last '}'
    const cleanedResponse = responseContent.substring(
      responseContent.indexOf("{"),
      responseContent.lastIndexOf("}") + 1
    ).trim();
    
    console.log("Cleaned Response:", cleanedResponse);

    // Parse the cleaned response as JSON
    const outputObj = JSON.parse(cleanedResponse);

    console.log(outputObj);

    if (outputObj.error) {
      console.log(outputObj.error);
      throw new Error(outputObj.error);
    }

    // Validate required fields in the parsed object
    if (
      !outputObj.esp
    ) {
      throw new Error("Invalid data structure: Required fields are missing.");
    }

    console.log("Structured Output:", outputObj);

    // Generate TTS for marketing descriptions and get links
    console.log("Generating TTS for English...");
    const engEnhancedAudio = await TTS(
      "21m00Tcm4TlvDq8ikWAM",
      outputObj.eng.marketing_description
    );

    console.log("Generating TTS for Spanish...");
    const espEnhancedAudio = await TTS(
      "tTQzD8U9VSnJgfwC6HbY",
      outputObj.esp.marketing_description
    );

    // Add enhanced audio links to the output object
    outputObj.eng.enhanced_audio = engEnhancedAudio;
    outputObj.esp.enhanced_audio = espEnhancedAudio;
    outputObj.audio_transcription = audio_transcription ? audio_transcription : "No audio transcription.";

    console.log("Final Output with Enhanced Audio:", outputObj);

    // Save to Firebase or another storage
    const output = saveToFirebase(JSON.stringify(outputObj));

    return output; // Return the structured JSON

  } catch (error) {

    const logData = {
      username: appState.user?.username || "Unknown",
      timestamp: new Date().toISOString(),
      error: error.message || "Unknown error",
      imageUrl: imageUrl || "No image URL",
      audioUrl: audioUrl || "No audio URL",
      
    };

    await logErrorToFirebase(logData);
    throw new Error(error.message);
  }
};

/**
 * Process audio and image using OpenAI API
 * @param {string} audioUrl - The URL of the audio file
 * @param {string} imageUrl - The URL of the image file
 * @returns {Promise<object>} - Transformed data or error response
 */
export const analyzeMedia = async (audioUrl, imageUrl) => {
  try {
    const replicaideResponse = await axios.post(
      "https://eojbpmfkfnysusg.m.pipedream.net",
      {
        audio: audioUrl,
        image: imageUrl,
        language: "es", // Spanish language parameter
      },
      {
        headers: {
          "Content-Type": "application/json", // Ensure content-type is JSON
        },
      },
    );

    if (replicaideResponse.status !== 200) {
      console.log(replicaideResponse)
      throw new Error("Image violates AI agent tuning parameters resulting in unreliable output context. Please upload another image.");
    }

    console.log("ReplicaIDE API Response:", replicaideResponse.data);

    return replicaideResponse.data; // Return the structured JSON

  } catch (error) {
    // Log the error details to Firebase
    const logData = {
      username: appState.user?.username || "Unknown",
      timestamp: new Date().toISOString(),
      error: error.message || "Unknown error",
      imageUrl: imageUrl || "No image URL",
      audioUrl: audioUrl || "No audio URL",
    };

    await logErrorToFirebase(logData);

    console.error("Error analyzing media:", error.message);
    throw new Error(error.message);
  }
};


/**
 * Log errors to Firebase with user details and timestamp
 * @param {object} logData - The log data to be saved
 */
const logErrorToFirebase = async (logData) => {
  try {
    // Add the parsed object to the Firestore collection
    const docRef = await addDoc(collection(db, "errors_log"), logData);

    console.log("Document successfully written with ID:", docRef.id);
  } catch (firebaseError) {
    console.error("Failed to log error to Firebase:", firebaseError.message);
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

import { orderBy, query } from "firebase/firestore";

/**
 * Fetch all recipes from Firestore, sorted by metainf.timestamp in descending order.
 * @returns {Array} An array of recipes with document IDs included, sorted by timestamp.
 */
export const fetchRecipes = async () => {
  try {
    // Reference to the "menu_items" collection
    const collectionRef = collection(db, "menu_items");

    // Query to fetch documents sorted by metainf.timestamp in descending order
    const q = query(collectionRef, orderBy("metadata.time_stamp", "desc"));

    // Fetch documents from Firestore
    const querySnapshot = await getDocs(q);

    // Map the results to include document IDs
    const recipes = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    return recipes; // Return the array of recipes
  } catch (error) {
    console.error("Error fetching and sorting recipes from Firestore:", error);
    throw new Error("Failed to fetch recipes. Please try again later.");
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
 * @param {Object} updates - The fields to update (title, description, price, ingredients).
 * @returns {void} - Logs success or throws an error.
 */
export const updateRecipeById = async (id, updates) => {
  try {
    // Reference to the document in the "menu_items" collection
    const docRef = doc(db, "menu_items", id);

    // Prepare the update object
    const updateObject = {};

    // Update `language.title` and `language.description` dynamically
    if (updates.title) {
      updateObject["language.title"] = updates.title; // Update title in `language`
    }
    if (updates.description) {
      updateObject["language.description"] = updates.description; // Update description in `language`
    }

    // Update price
    if (updates.price) {
      updateObject["price"] = updates.price; // Price is not nested within language
    }

    // Update ingredients.main if provided
    if (updates.ingredients?.main) {
      updateObject["ingredients.main"] = updates.ingredients.main; // Update the main array in the ingredients field
    }

    // Perform the update in Firestore
    await updateDoc(docRef, updateObject);

    console.log(`Document with ID: ${id} successfully updated.`);
    console.log("Updated fields:", updateObject);
  } catch (error) {
    console.error(`Error updating recipe with ID ${id} in Firestore:`, error);
    throw error;
  }
};

export const extractOrder = async (messages) => {
  const prompt = `
You are an assistant extracting structured order details from a restaurant chat conversation. Analyze the following conversation messages and extract the following details into a JSON object:
- Customer Name (e.g., "John Doe")
- Items (an array of objects, each object containing):
  - "name" (e.g., "Pizza")
  - "quantity" (e.g., 2)
  - "price" (if available, e.g., 10.99. If unavailable, leave as 0)

The JSON object should look like this:
{
  "customerName": "John Doe",
  "items": [
    {
      "name": "Pizza",
      "quantity": 2,
      "price": 10.99
    },
    {
      "name": "Pasta",
      "quantity": 1,
      "price": 8.99
    }
  ],
  "total": "30.97"
}

If any information is missing (e.g., customer name or item price), return an empty string "" or 0 where appropriate. Never return an error.

Here are the conversation messages:
${JSON.stringify(messages)}

Extract and return the JSON object.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format : { "type": "json_object" }
    });

    const extractedData = response.choices[0].message.content;

    try {
      return JSON.parse(extractedData); // Ensure the result is valid JSON
    } catch (err) {
      console.error("Failed to parse extracted order data:", err);
      return null; // Handle invalid JSON
    }
  } catch (error) {
    console.error("Error extracting order data:", error);
    return null; // Handle API errors
  }
};

/**
 * Saves the JSON output from ChatGPT to a Firebase Firestore collection.
 * @param {string} jsonData - The JSON string output from ChatGPT.
 * @returns {Promise<string>} - Promise resolving to the document ID on success.
 */
export const saveOrderToFirebase = async (jsonData) => {
  if (!jsonData) {
    throw new Error("No JSON data provided to save.");
  }

  try {
    // Parse the JSON string into an object
    const dataObject = JSON.parse(jsonData);

    dataObject.timestamp = new Date().toISOString();

    // Add the parsed object to the Firestore collection
    const docRef = await addDoc(collection(db, "orders"), dataObject);

    console.log("Document successfully written with ID:", docRef.id);
    return docRef.id; // Return the document ID for reference
  } catch (error) {
    console.error("Error saving to Firestore:", error.message);
    throw error;
  }
};

/**
 * Fetch all recipes from Firestore, sorted by metainf.timestamp in descending order.
 * @returns {Array} An array of recipes with document IDs included, sorted by timestamp.
 */
export const fetchOrders = async () => {
  try {
    // Reference to the "menu_items" collection
    const collectionRef = collection(db, "orders");

    // Query to fetch documents sorted by metainf.timestamp in descending order
    const q = query(collectionRef, orderBy("timestamp", "desc"));

    // Fetch documents from Firestore
    const querySnapshot = await getDocs(q);

    // Map the results to include document IDs
    const recipes = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    return recipes; // Return the array of recipes
  } catch (error) {
    console.error("Error fetching and sorting orders from Firestore:", error);
    throw new Error("Failed to fetch orders. Please try again later.");
  }
};