import React, { useState } from "react";
import "./AddSubject.css";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AddSubject = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add subject");
      }

      const result = await response.json();
      toast.success("Subject added successfully!");
      navigate("/displaysubject");
      console.log(result);
      setName("");
    } catch (error) {
      setError(error.message);
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="new-subject-container">
        <h2 className="new-subject-heading">Add a New Subject</h2>
        <form onSubmit={handleSubmit} className="new-subject-form">
          <div className="new-subject-form-group">
            <label htmlFor="subjectName" className="new-subject-label">
              Subject Name:
            </label>
            <input
              type="text"
              id="subjectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="new-subject-input"
            />
          </div>
          <div className="new-subject-button-container">
            <button
              type="submit"
              className="new-subject-button"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>
            <Link to="/displaysubject" className="new-subject-link-button">
              List Subjects
            </Link>
          </div>
          {error && <div className="new-subject-error-message">{error}</div>}
          {success && (
            <div className="new-subject-success-message">{success}</div>
          )}
        </form>
      </div>
    </>
  );
};

export default AddSubject;
