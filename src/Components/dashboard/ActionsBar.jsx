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
            {/* Edit Listings Icon */}
            <button
              onClick={() => console.log(editListingsLabel)}
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
              }`}
              title={editListingsLabel}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-6 h-6 ${textColor}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 3.487a3.375 3.375 0 114.775 4.775l-10.69 10.69a1.5 1.5 0 01-.53.354l-4.724 1.575 1.575-4.724a1.5 1.5 0 01.354-.53l10.69-10.69z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.695 6.317a3.375 3.375 0 01-4.775-4.775M16.5 4.5L19.5 7.5"
                />
              </svg>
            </button>

            {/* Add Listing Button */}
            <button
              onClick={onAddListing}
              className={`px-4 py-2 rounded-lg w-full md:w-auto flex justify-center gap-2 items-center ${
                isDarkMode
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-orange-500 text-white hover:bg-orange-600"
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