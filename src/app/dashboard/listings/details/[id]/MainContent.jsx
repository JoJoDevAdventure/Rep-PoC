"use client";

import { deleteRecipeById, fetchRecipeById, updateRecipeById } from "@/app/dashboard/Service";
import { appState } from "@/appState"; // Access appState for language preference
import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";

const MainContent = ({ id }) => {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEnglish = appState.isEnglish; // Get language preference
  const content = isEnglish ? item?.eng : item?.esp; // Use English or Spanish content

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedItem = await fetchRecipeById(id); // Fetch item from Firebase
        setItem(fetchedItem);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (
        window.confirm(
          isEnglish
            ? "Are you sure you want to delete this item?"
            : "¿Estás seguro de que quieres eliminar este artículo?"
        )
      ) {
        await deleteRecipeById(id); // Call delete function
        console.log("Item successfully deleted.");
        router.push("/dashboard/listings"); // Redirect to listings page
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(
        isEnglish
          ? "Failed to delete the item."
          : "No se pudo eliminar el artículo."
      );
    }
  };

  const handleSave = async () => {
    try {
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const price = document.getElementById("price").value.trim();

      if (!title || !description || !price) {
        alert(
          isEnglish
            ? "All fields (title, description, and price) are required."
            : "Todos los campos (título, descripción y precio) son obligatorios."
        );
        return;
      }

      // Update the recipe in Firebase
      await updateRecipeById(id, { title, description, price });
      console.log("Item successfully updated.");
      alert(
        isEnglish
          ? "Item successfully updated."
          : "Artículo actualizado con éxito."
      );
    } catch (error) {
      console.error("Error updating item:", error);
      alert(
        isEnglish
          ? "Failed to update the item."
          : "No se pudo actualizar el artículo."
      );
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!item) {
    return (
      <p>{isEnglish ? "No item selected." : "Ningún artículo seleccionado."}</p>
    );
  }

  return (
    <div className="relative w-full rounded-t-[24px] pb-20 text-gray-500 z-10">
      {/* Back Button */}
      <div className="fixed max-w-2xl z-20 top-8 left-8">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-p1 text-white rounded-md shadow hover:bg-gray-300 transition"
        >
          {isEnglish ? "Back" : "Volver"}
        </button>
      </div>

      {/* Image Section */}
      <div className="fixed top-0 w-full max-w-2xl z-10">
        <img
          src={item.image}
          alt={content?.title}
          className="w-full h-64 object-cover rounded-lg shadow"
        />
      </div>

      <div className="relative flex flex-col justify-center bg-white rounded-20 px-8 z-20 mt-[30vh]">
        {/* Marketing Audio Section */}
        <div className="relative w-full max-w-2xl pt-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-l font-semibold text-gray-700 text-center">
              {isEnglish ? "Marketing Audio" : "Audio de marketing"}
            </h2>
            <ReactAudioPlayer
              src={content.enhanced_audio}
              autoPlay
              controls
              className="w-full mt-4"
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div className="w-full max-w-2xl mt-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              {isEnglish ? "Title" : "Título"}
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
              defaultValue={content?.marketing_description}
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
              defaultValue={item.price?.formatted || item.price || content.price}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-2xl mt-6 flex justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
          >
            {isEnglish ? "Delete" : "Eliminar"}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
          >
            {isEnglish ? "Save" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;