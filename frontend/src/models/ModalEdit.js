import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import ModalEdit from "../models/ModalDelete";
import ModalDelete from "../models/ModalDelete";
import "./Modal.css";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [newAuthorName, setNewAuthorName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/authors`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch authors");
        }
        const data = await response.json();
        console.log("Authors Data:", data); // Inspect the data structure
        setAuthors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const openEditModal = (author) => {
    setCurrentAuthor(author);
    setNewAuthorName(author.name);
    setShowEditModal(true);
  };

  const openDeleteModal = (author) => {
    setCurrentAuthor(author);
    setShowDeleteModal(true);
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/authors/${currentAuthor._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newAuthorName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit author");
      }

      const updatedAuthor = await response.json();
      setAuthors(
        authors.map((author) =>
          author._id === currentAuthor._id ? updatedAuthor : author
        )
      );
      toast.success("Author updated successfully");
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/authors/${currentAuthor._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete author");
      }

      setAuthors(authors.filter((author) => author._id !== currentAuthor._id));
      toast.success("Author deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="authors-container">
        <h1>Authors</h1>
        <button
          onClick={() => navigate("/addauthors")}
          className="add-author-button"
        >
          Add Author
        </button>
        {authors.length > 0 ? (
          authors.map((author) => (
            <div key={author._id} className="author-card">
              <h2>{author.name}</h2>
              <div className="books-container">
                {author.books ? (
                  Object.values(author.books).map((book) => (
                    <div key={book._id} className="book-card">
                      <img
                        src={book.image?.url || "default-image-url"} // Handle missing image URL
                        alt={book.title}
                        className="book-image"
                      />
                      <p>{book.title}</p>
                    </div>
                  ))
                ) : (
                  <p>No books available</p>
                )}
              </div>
              <button
                onClick={() => openEditModal(author)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(author)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No authors available</p>
        )}
      </div>

      {showEditModal && (
        <ModalEdit
          name={newAuthorName}
          onChange={setNewAuthorName}
          onCancel={() => setShowEditModal(false)}
          onConfirm={handleEdit}
        />
      )}

      {showDeleteModal && (
        <ModalDelete
          name={currentAuthor.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default AuthorsPage;
