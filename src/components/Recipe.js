import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRecipeById,
  deleteRecipe,
  updateLikeRecipe,
  updateDislikeRecipe,
} from "../services/api";
import { useTranslation } from "react-i18next";
import OpenBook from "./OpenBook";
import styles from "./Recipe.module.css";

const Recipe = ({ isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteNotification, setDeleteNotification] = useState("");
  const [likeMessage, setLikeMessage] = useState("");
  const [unlikeMessage, setUnlikeMessage] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log(id);
        const data = await getRecipeById(id);
        console.log("Received recipe data:", data);

        // Get the user id from local storage
        const userId = localStorage.getItem("userId");

        // Check if the user has liked or disliked the recipe
        if (data.thumbsUp.includes(userId)) {
          data.userReaction = "like";
        } else if (data.thumbsDown.includes(userId)) {
          data.userReaction = "dislike";
        } else {
          data.userReaction = null;
        }

        setRecipe(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recipe data:", error);
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleEdit = () => {
    // Navigate to the edit page
    navigate(`/recipes/edit/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }
  const goBackToRecipes = () => {
    navigate("/recipes");
  };
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete the recipe?")) {
      try {
        const response = await deleteRecipe(id);
        if (response.status >= 200 && response.status < 300) {
          console.log(response.data.message); // log the success message from the server
          setDeleteNotification(
            "Recipe deleted succesfully, returning to recipes..."
          );
          setTimeout(() => {
            navigate("/recipes");
          }, 3000);
        } else {
          console.error("Error deleting recipe:", response.data.message); // log the error message from the server
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };
  const handleLike = async () => {
    try {
      let change = 0;
      let userReaction = "like"; // Initialize as "like"

      if (recipe.userReaction === "like") {
        setLikeMessage("You've already liked this recipe, removing like...");
        change = -1;
        userReaction = null; // User unliked the recipe
      } else if (recipe.userReaction === "dislike") {
        await updateDislikeRecipe(id, -1);
        change = 1;
      } else {
        change = 1;
      }

      const updatedRecipe = await updateLikeRecipe(id, change);
      console.log("updatedRecipe from likeRecipe: ", updatedRecipe);

      setRecipe({
        ...recipe,
        thumbsUp: updatedRecipe.thumbsUp.length,
        thumbsDown: updatedRecipe.thumbsDown.length,
        userReaction: userReaction,
      });

      setLikeMessage(
        userReaction === "like"
          ? "You've successfully liked this recipe!"
          : "You've removed your like from this recipe."
      );

      setTimeout(() => {
        setLikeMessage(""); // clear the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };
  const handleDislike = async () => {
    try {
      let change = 0;
      let userReaction = "dislike"; // Initialize as "dislike"

      if (recipe.userReaction === "dislike") {
        setUnlikeMessage(
          "You've already disliked this recipe, removing dislike..."
        );
        change = -1;
        userReaction = null; // User undisliked the recipe
      } else if (recipe.userReaction === "like") {
        await updateLikeRecipe(id, -1);
        change = 1;
      } else {
        change = 1;
      }
      const updatedRecipe = await updateDislikeRecipe(id, change);
      console.log("updatedRecipe from dislikeRecipe: ", updatedRecipe);

      setRecipe({
        ...recipe,
        thumbsDown: updatedRecipe.thumbsDown.length,
        thumbsUp: updatedRecipe.thumbsUp.length,
        userReaction: userReaction,
      });

      setUnlikeMessage(
        userReaction === "dislike"
          ? "You've successfully disliked this recipe!"
          : "You've removed your dislike from this recipe."
      );

      setTimeout(() => {
        setUnlikeMessage(""); // clear the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error disliking recipe:", error);
    }
  };

  return (
    <div className={styles.recipeContainer}>
      <div className={styles.recipeCardWrapper}>
        {deleteNotification && (
          <div className={styles.notificationContainer}>
            <p>{deleteNotification}</p>
          </div>
        )}
        {likeMessage && (
          <div className={styles.likeMessage}>
            <p>{likeMessage}</p>
          </div>
        )}
        {unlikeMessage && (
          <div className={styles.unlikeMessage}>
            <p>{unlikeMessage}</p>
          </div>
        )}
        <OpenBook
          recipe={recipe}
          isLoggedIn={isLoggedIn}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleLike={handleLike}
          handleDislike={handleDislike}
        />
        <button
          type="button"
          onClick={goBackToRecipes}
          className={styles.returnButton}
        >
          {t("back_to_recipes")}
        </button>
      </div>
    </div>
  );
};

export default Recipe;
