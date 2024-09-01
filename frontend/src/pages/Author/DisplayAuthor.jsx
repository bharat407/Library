import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import ModalEdit from "../../models/Edit";
import ModalDelete from "../../models/ModalDelete";
import "./AuthorsPage.css";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editName, setEditName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [deletingAuthor, setDeletingAuthor] = useState(null);
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
        setAuthors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setEditName(author.name);
    setSelectedSubject(author.subject || "");
    setSelectedBook(author.book || "");
  };

  const handleDelete = (author) => {
    setDeletingAuthor(author);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAuthor) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/authors/${deletingAuthor._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete author");
      }

      setAuthors(authors.filter((author) => author._id !== deletingAuthor._id));
      toast.success("Author deleted successfully");
      setDeletingAuthor(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingAuthor(null);
  };

  const handleEditConfirm = async (updatedData) => {
    if (!editingAuthor) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/authors/${editingAuthor._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update author");
      }

      const updatedAuthor = await response.json();
      setAuthors(
        authors.map((author) =>
          author._id === updatedAuthor._id ? updatedAuthor : author
        )
      );
      toast.success("Author updated successfully");
      setEditingAuthor(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditCancel = () => {
    setEditingAuthor(null);
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
                        src={book.image?.url || "default-image-url"}
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
                onClick={() => handleEdit(author)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(author)}
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
      {editingAuthor && (
        <ModalEdit
          name={editName}
          onChange={setEditName}
          onCancel={handleEditCancel}
          onConfirm={handleEditConfirm}
          setSelectedSubject={setSelectedSubject}
          setSelectedBook={setSelectedBook}
        />
      )}
      {deletingAuthor && (
        <ModalDelete
          name={deletingAuthor.name}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default AuthorsPage;
