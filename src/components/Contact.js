import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Contact.module.css";
import { submitFeedback } from "../services/api";

const Contact = () => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("feedback");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const feedbackData = {
      type: feedbackType,
      message: feedback,
    };
    submitFeedback(feedbackData)
      .then(() => {
        setSubmitted(true);
        setFeedback("");
      })
      .catch((error) => {
        setSubmitError(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={styles.container}>
      <h2>{t("contact.title")}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>
            {t("contact.feedback_type")}
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className={styles.select}
            >
              <option value="feedback">{t("contact.regular_feedback")}</option>
              <option value="bug">{t("contact.bug_report")}</option>
            </select>
          </label>
        </div>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.textarea}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t("contact.placeholder")}
            rows="10"
            cols="30"
            required
          ></textarea>
        </div>

        <button className={styles.button} type="submit" disabled={submitting}>
          {submitting ? t("contact.sending") : t("contact.submit")}
        </button>
        {submitted && (
          <div className={styles.successMessage}>
            {t("contact.thank_you_message")}
          </div>
        )}

        {submitError && (
          <p className={styles.errorMessage}>{t("contact.error_message")}</p>
        )}
      </form>
    </div>
  );
};
export default Contact;
