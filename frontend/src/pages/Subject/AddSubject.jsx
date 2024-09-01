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
      <div className="add-subject-container">
        <div className="heading">Add a New Subject</div>
        <form onSubmit={handleSubmit} className="add-subject-form">
          <div className="form-group">
            <label htmlFor="subjectName">Subject Name:</label>
            <input
              type="text"
              id="subjectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Adding..." : "Add Subject"}
            </button>
            <Link to="/displaysubject" className="button">
              List Subjects
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>
      </div>
    </>
  );
};

export default AddSubject;
