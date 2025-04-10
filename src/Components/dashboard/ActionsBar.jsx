"use client";

import { appState } from "@/appState";
import { useState } from "react";

const ActionsBar = ({ onSearch, onSort, onAddListing, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Trigger the search callback
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    onSort(e.target.value); // Trigger the sort callback
  };

  // Dynamic styles for dark mode
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const bgColor = isDarkMode ? "bg-s1" : "bg-white";
  const borderColor = isDarkMode ? "border-p1/20" : "border-p1/10";
  const focusRingColor = isDarkMode ? "focus:ring-gray-500" : "focus:ring-orange-500";

  // Text content based on language
  const searchPlaceholder = appState.isEnglish ? "Search Items" : "Buscar Ítem del menú...";
  const sortByLabel = appState.isEnglish ? "Sort by" : "Ordenar por";
  const dateOption = appState.isEnglish ? "Date" : "Fecha";
  const priceOption = appState.isEnglish ? "Price" : "Precio";
  const nameOption = appState.isEnglish ? "Name" : "Nombre";
  const addProductLabel = appState.isEnglish ? "Item" : "Producto";
  const editListingsLabel = appState.isEnglish ? "Edit listings" : "Editar productos";

  return (
    <div className={`gap-4 items-center py-4 ${bgColor}`}>
      {/* Search and Sort Section */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Search Bar */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={handleSearch}
          className={`px-4 py-2 ${textColor} ${borderColor} border-2 rounded-lg w-full focus:outline-none focus:ring-2 ${bgColor} ${focusRingColor} md:w-1/3 `}
        />

        <div className="flex flex-row w-full md:justify-between">
          {/* Sort By Dropdown */}
          <select
            value={sortOption}
            onChange={handleSortChange}
            className={`py-2 border-2 px-4 ${borderColor} rounded-lg ${textColor} ${bgColor} focus:outline-none focus:ring-2 ${focusRingColor} md:w-auto w-1/3`}
          >
            <option value="">{sortByLabel}</option>
            <option value="date">{dateOption}</option>
            <option value="price">{priceOption}</option>
            <option value="name">{nameOption}</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-4 md:w-auto justify-center w-2/3 pl-4">
            {/* Add Listing Button */}
            <button
            disabled={appState.user.username == "Kev" || appState.user.username == "RepliDemo" ? true : false}
              onClick={onAddListing}
              className={`px-4 py-2 rounded-lg w-full md:w-auto flex justify-center gap-2 items-center cursor-pointer  ${appState.user.username == "Kev" ? "bg-gray-600 hover:bg-gray-500" : ""} ${
                isDarkMode
                  ? appState.user.username == "Kev" || appState.user.username == "RepliDemo" ? "bg-gray-600 hover:bg-gray-500" : "bg-orange-500 text-white hover:bg-orange-600"
                  : appState.user.username == "Kev" || appState.user.username == "RepliDemo" ? "bg-gray-600 hover:bg-gray-500" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#ffff"
              >
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </svg>
              {addProductLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsBar;