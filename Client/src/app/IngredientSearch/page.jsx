"use client"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const IngredientSearch = () => {
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const handleSearchInputChange = async (e) => {
    setIngredientSearch(e.target.value);
    try {
      const response = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${e.target.value}&number=5&apiKey=ae9fab0183fd48e9b6af4a983da4897f`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Failed to fetch autocomplete results');
      }
    } catch (error) {
      console.error('Error fetching autocomplete results:', error);
    }
  };

  const handleAddIngredient = (ingredient) => {
    setSelectedIngredients([...selectedIngredients, ingredient]);
    setIngredientSearch('');
    setSearchResults([]);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients.splice(index, 1);
    setSelectedIngredients(updatedIngredients);
  };

  const generateRecipes = () => {
     const apiKey = 'ae9fab0183fd48e9b6af4a983da4897f'; // Update with Spoonacular API key
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${selectedIngredients.join(',')}&apiKey=${apiKey}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        return response.json();
      })
      .then(data => {
        setRecipes(data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Select ingredient(s) to generate recipe</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for ingredients..."
          value={ingredientSearch}
          onChange={handleSearchInputChange}
          className="w-full rounded-full border border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1 overflow-hidden">
            {searchResults.map(result => (
              <div key={result.id} className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <span>{result.name}</span>
                <FontAwesomeIcon icon={faPlus} onClick={() => handleAddIngredient(result.name)} className="text-blue-500 cursor-pointer" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Selected Ingredients</h3>
        {selectedIngredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mt-2">
            <FontAwesomeIcon icon={faMinus} onClick={() => handleRemoveIngredient(index)} className="text-red-500 cursor-pointer" />
            <span className="ml-2">{ingredient}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={generateRecipes}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-8"
      >
        Generate Recipes
      </button>
       <div>
        {recipes.map(recipe => (
          <div key={recipe.id} className="flex items-center justify-center bg-gray-200 p-4 mb-4 rounded-lg">
            <img src={recipe.image}
              width={100}
              height={100}
              alt={recipe.title}
              className="mr-4"
            />
            <div>
              <p className="font-bold">{recipe.title}</p>
              <ul>
                {recipe.missedIngredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSearch;