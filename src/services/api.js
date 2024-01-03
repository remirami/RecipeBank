import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

const requestInterceptor = (config) => {
  const token = localStorage.getItem("recipeAppToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Interceptor config:", config);
  return config;
};

const requestInterceptorErrorHandler = (error) => {
  return Promise.reject(error);
};

api.interceptors.request.use(
  requestInterceptor,
  requestInterceptorErrorHandler
);

export async function getAllRecipes() {
  const response = await api.get("/recipes");
  return response.data;
}

export async function getRecipeById(id) {
  console.log("getRecipeById called with id:", id);
  const response = await api.get(`/recipes/${id}`);
  console.log("getRecipeById response:", response);
  return response.data;
}

export const createRecipe = async (recipe) => {
  console.log("Received recipe object in createRecipe:", recipe);
  const token = localStorage.getItem("recipeAppToken");
  console.log("Sending request with token:", token);

  try {
    const response = await api.post("/recipes", recipe);
    return response.data._id;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const updateRecipe = async (id, updatedRecipe) => {
  console.log("Executing updateRecipe in api.js with id:", id);
  console.log("Received updatedRecipe:", updatedRecipe);
  try {
    const token = localStorage.getItem("recipeAppToken");
    const response = await api.put(`/recipes/${id}`, updatedRecipe);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function deleteRecipe(id) {
  const response = await api.delete(`/recipes/${id}`);
  return response;
}

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  localStorage.setItem("recipeAppToken", response.data.token);

  const user = {
    id: response.data.user._id,
    username: response.data.user.username,
    email: response.data.user.email,
  };
  localStorage.setItem("recipeAppUser", JSON.stringify(user));
  localStorage.setItem("userId", response.data.user._id);
  localStorage.setItem("isAdmin", response.data.user.isAdmin);

  return response;
};

export async function registerUser(username, email, password) {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
}
export async function getRecipeByName(name) {
  try {
    const response = await api.get("/recipes/check-name", {
      params: { name },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting recipe by name:", error);
    throw error;
  }
}
export const updateLikeRecipe = async (recipeId, change) => {
  try {
    const response =
      change > 0
        ? await api.post(`/recipes/${recipeId}/thumbsup`)
        : await api.delete(`/recipes/${recipeId}/thumbsup`);
    console.log("updatelike response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating the like of the recipe:", error);
    throw error;
  }
};

export const updateDislikeRecipe = async (recipeId, change) => {
  try {
    const response =
      change > 0
        ? await api.post(`/recipes/${recipeId}/thumbsdown`)
        : await api.delete(`/recipes/${recipeId}/thumbsdown`);
    console.log("updateDislike response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating the dislike of the recipe:", error);
    throw error;
  }
};

export async function getRandomRecipe() {
  const response = await api.get("/recipes");
  const recipes = response.data;
  const randomIndex = Math.floor(Math.random() * recipes.length);
  return recipes[randomIndex];
}
export async function searchRecipes(
  searchTerm,
  categoryType,
  mealType,
  searchByUsername,
  includeLiked,
  searchByLikes,
  foodType,
  subType,
  dietaryPreferences,
  maxCookTime
) {
  try {
    const response = await api.get("/search", {
      params: {
        searchTerm,
        categoryType,
        mealType,
        searchByUsername,
        includeLiked,
        searchByLikes,
        foodType,
        subType,
        dietaryPreferences,
        maxCookTime,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in searchRecipes function: ", error);
    return { recipes: [] };
  }
}
export async function confirmUserEmail(token) {
  const response = await api.get(`/confirm-email/${token}`);
  return response.data;
}

export async function forgotPassword(email) {
  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function resetPassword(token, newPassword) {
  const response = await fetch(
    `http://localhost:3000/api/auth/reset-password/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword }),
    }
  );

  if (!response.ok) {
    throw new Error("Could not reset password");
  }

  return response.json();
}
export async function getUserProfile() {
  const response = await api.get("/user/profile");
  return response.data;
}

export async function getUserRecipes() {
  const response = await api.get("/user/recipes");
  return response.data;
}
export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const response = await api.put(`/user/${userId}/change-password`, {
    currentPassword,
    newPassword,
  });
  return response.data;
};
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post("/feedback/submit", feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};
