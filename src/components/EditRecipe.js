import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, updateRecipe, deleteRecipe } from "../services/api";

const EditRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);

        // Check if the user is the owner of the recipe
        if (localStorage.getItem("userId") !== data.user_id) {
          setError("You do not have permission to edit this recipe.");
          return;
        }

        setRecipe(data);
        setName(data.name);
        setDescription(data.description);
        setIngredients(data.ingredients);
        setInstructions(data.instructions || []);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRecipe = {
      name,
      description,
      ingredients,
      instructions,
    };

    try {
      const response = await updateRecipe(id, updatedRecipe);
      if (response.status === 200) {
        console.log("Recipe updated successfully");
        navigate(`/recipes/${id}`);
      } else {
        console.error("Error updating recipe:", response);
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Render and handle ingredients and directions here */}
        <label htmlFor="ingredients">Ingredients:</label>
        {ingredients &&
          ingredients.map((ingredient, index) => (
            <div key={index}>
              <label htmlFor={`ingredient-name-${index}`}>Name:</label>
              <input
                type="text"
                id={`ingredient-name-${index}`}
                value={ingredient.name}
                onChange={(e) => {
                  const updatedIngredients = [...ingredients];
                  updatedIngredients[index].name = e.target.value;
                  setIngredients(updatedIngredients);
                }}
              />
              <label htmlFor={`ingredient-amount-${index}`}>Amount:</label>
              <input
                type="text"
                id={`ingredient-amount-${index}`}
                value={ingredient.amount}
                onChange={(e) => {
                  const updatedIngredients = [...ingredients];
                  updatedIngredients[index].amount = e.target.value;
                  setIngredients(updatedIngredients);
                }}
              />
            </div>
          ))}
        <button
          type="button"
          onClick={() =>
            setIngredients([...ingredients, { name: "", amount: "" }])
          }
        >
          Add Ingredient
        </button>

        <label htmlFor="instructions">Instructions:</label>
        {instructions &&
          instructions.map((instruction, index) => (
            <div key={index}>
              <label htmlFor={`instruction-${index}`}>Step {index + 1}:</label>
              <textarea
                id={`instruction-${index}`}
                value={instruction}
                onChange={(e) => {
                  const updatedInstructions = [...instructions];
                  updatedInstructions[index] = e.target.value;
                  setInstructions(updatedInstructions);
                }}
              />
            </div>
          ))}
        <button
          type="button"
          onClick={() => setInstructions([...instructions, ""])}
        >
          Add Instruction
        </button>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRecipe;
