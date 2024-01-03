import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { confirmUserEmail } from "../services/api";

const ConfirmEmail = () => {
  const [message, setMessage] = useState("");

  const { token } = useParams();

  console.log("ConfirmEmail component rendered with token:", token);

  const confirmEmail = useCallback(async () => {
    console.log("Calling confirmEmail function with token:", token);
    setMessage(""); // Clear any previous message
    try {
      const data = await confirmUserEmail(token);

      if (data.message) {
        setMessage(data.message);
      } else {
        setMessage("An error occurred while confirming your email.");
      }
      console.log("Data received from backend:", data);
    } catch (error) {
      console.error("Error confirming email:", error);
      console.error("Error details:", error.response);

      // Check if the error response has a specific status code, e.g., 500
      if (error.response && error.response.status !== 500) {
        setMessage("An error occurred while confirming your email.");
      }
    }
  }, [token]);

  useEffect(() => {
    console.log("useEffect called");
    confirmEmail();
  }, [confirmEmail]);

  return (
    <div>
      <h1>Email Confirmation</h1>
      <p>{message}</p>
    </div>
  );
};

export default ConfirmEmail;
