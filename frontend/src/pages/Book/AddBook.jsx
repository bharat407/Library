import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { toast } from "react-hot-toast";
import styles from "./AddBook.module.css"; // Import the module CSS
import Spinner from "../../Error/spinner";
import Error from "../../Error/Error";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [image, setImage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subjects to populate the dropdown
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/subjects`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subjectId || !image) {
      toast.error("Please fill in all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subjectId", subjectId);
    formData.append("image", image);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/books`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create book");
      }

      const newBook = await response.json();
      toast.success(`Book "${newBook.title}" created successfully`);
      navigate("/displaybooks");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error)
    return (
      <div>
        <Error /> {error}
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className={styles.addBookContainer}>
        <div className={styles.heading}>Add New Book</div>
        <form onSubmit={handleSubmit} className={styles.addBookForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Book Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject">Select Subject:</label>
            <select
              id="subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              <option value="">Select a Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Upload Book Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
