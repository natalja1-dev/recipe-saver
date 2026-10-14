"use client";

import { useEffect, useState } from "react";

export default function RecipeApp() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("All");

  async function loadRecipes() {
    try {
      const response = await fetch("/api/recipes");

      if (!response.ok) {
        throw new Error("Could not load recipes.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Recipes response is not an array.");
      }

      setRecipes(data);
    } catch (error) {
      console.error(error);
      setRecipes([]);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  async function addRecipe(event) {
    event.preventDefault();

    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        category,
        ingredients,
        description,
      }),
    });

    if (!response.ok) {
      return;
    }

    setTitle("");
    setCategory("");
    setIngredients("");
    setDescription("");

    loadRecipes();
  }

  async function deleteRecipe(id) {
    await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });

    loadRecipes();
  }

  const filteredRecipes =
    filter === "All"
      ? recipes
      : recipes.filter((recipe) => recipe.category === filter);

  const categories = [
    "All",
    ...new Set(recipes.map((recipe) => recipe.category)),
  ];

  return (
    <div>
      <h1>Recipe Saver</h1>

      <p className="subtitle">
        Save your favourite recipes and filter them by category.
      </p>

      <form onSubmit={addRecipe}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <textarea
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Save recipe</button>
      </form>

      <div className="filter-row">
        <label>Filter by category:</label>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        {filteredRecipes.length === 0 ? (
          <p className="empty-message">No recipes found.</p>
        ) : (
          <table className="recipe-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Ingredients</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.title}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.ingredients}</td>
                  <td>{recipe.description || "-"}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteRecipe(recipe.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
