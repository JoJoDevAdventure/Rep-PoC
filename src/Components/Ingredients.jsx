"use client";

import { useState } from "react";

const Ingredients = ({ initialIngredients = [], onIngredientsChange }) => {
  const [ingredients, setIngredients] = useState(initialIngredients);

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  // Handle deleting an ingredient
  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    onIngredientsChange(updatedIngredients); // Send updated list to parent
  };

  // Handle updating an ingredient
  const handleUpdateIngredient = (index, value) => {
    const updatedIngredients = ingredients.map((ingredient, i) =>
      i === index ? value : ingredient
    );
    setIngredients(updatedIngredients);
    onIngredientsChange(updatedIngredients); // Send updated list to parent
  };

  return (
    <div className="space-y-4">
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-center space-x-4">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => handleUpdateIngredient(index, e.target.value)}
            className="flex-1 w-full px-4 py-2 border rounded-lg text-gray-800 border-orange-500"
            placeholder={`Ingredient ${index + 1}`}
          />
          <button
            onClick={() => handleDeleteIngredient(index)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-orange-500 text-orange-500 hover:bg-orange-100"
          >
            -
          </button>
        </div>
      ))}
      <button
        onClick={handleAddIngredient}
        className="w-10 h-10 flex items-center justify-center rounded-full border bg-orange-500 text-orange-100 hover:bg-orange-100"
      >
        +
      </button>
    </div>
  );
};

export default Ingredients;