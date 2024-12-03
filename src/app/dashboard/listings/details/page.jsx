"use client";

import { appState } from "@/appState"; // Import appState for language preference
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ReactAudioPlayer from "react-audio-player";

const DetailsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const itemString = searchParams.get("item"); // Get the query parameter
  const item = itemString ? JSON.parse(decodeURIComponent(itemString)) : null; // Parse the item

  const isEnglish = appState.isEnglish; // Get language preference
  const content = isEnglish ? item?.eng : item?.esp; // Use English or Spanish content

  if (!item) {
    return <p>{isEnglish ? "No item selected." : "Ningún artículo seleccionado."}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center text-gray-500">
      {/* Back Button */}
      <div className="fixed w-full max-w-2xl z-10 mt-8 ml-8">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-p1 text-white rounded-md shadow hover:bg-gray-300 transition"
        >
          {isEnglish ? "Back" : "Volver"}
        </button>
      </div>

      {/* Image Section */}
      <div className="fixed top-0 w-full max-w-2xl">
        <img
          src={item.image}
          alt={content?.title}
          className="w-full h-64 object-cover rounded-lg shadow"
        />
      </div>

      <div className="relative w-full px-8 bg-white mt-[30vh] rounded-t-[24px] pb-20">
        {/* Marketing Audio Section */}
        <div className="relative w-full max-w-2xl mt-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-l font-semibold text-gray-700 text-center">
              {isEnglish ? "Marketing Audio Waveform" : "Forma de onda del audio de marketing"}
            </h2>
            <ReactAudioPlayer
              src={item.audio}
              autoPlay
              controls
              className="w-full mt-4"
            />
          </div>
        </div>

        {/* Editable Fields Section */}
        <div className="w-full max-w-2xl mt-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              {isEnglish ? "Title (Editable)" : "Título (Editable)"}
            </label>
            <input
              id="title"
              type="text"
              defaultValue={content?.title}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              {isEnglish ? "Description" : "Descripción"}
            </label>
            <textarea
              id="description"
              defaultValue={content?.description}
              rows={4}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-600"
            >
              {isEnglish ? "Price" : "Precio"}
            </label>
            <input
              id="price"
              type="text"
              defaultValue={content?.price}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-2xl mt-6 flex justify-between">
          <button className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition">
            {isEnglish ? "Delete" : "Eliminar"}
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition">
            {isEnglish ? "Save" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailsPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DetailsContent />
    </Suspense>
  );
};

export default DetailsPage;