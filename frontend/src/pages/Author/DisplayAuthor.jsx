import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import ModalEdit from "../../models/Edit";
import ModalDelete from "../../models/ModalDelete";
import Spinner from "../../Error/spinner";
import Error from "../../Error/Error";
import "./AuthorsPage.css";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editName, setEditName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [deletingAuthor, setDeletingAuthor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsResponse, subjectsResponse, booksResponse] =
          await Promise.all([
            fetch(`${process.env.REACT_APP_BASE_URL}/authors`),
            fetch(`${process.env.REACT_APP_BASE_URL}/subjects`),
            fetch(`${process.env.REACT_APP_BASE_URL}/books`),
          ]);

        if (!authorsResponse.ok || !subjectsResponse.ok || !booksResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [authorsData, subjectsData, booksData] = await Promise.all([
          authorsResponse.json(),
          subjectsResponse.json(),
          booksResponse.json(),
        ]);

        setAuthors(authorsData);
        setSubjects(subjectsData);
        setBooks(booksData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setEditName(author.name);
    setSelectedSubject(author.subject?._id || "");
    setSelectedBook(author.books.length > 0 ? author.books[0]._id : ""); // Select first book if available
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

  const handleEditConfirm = async () => {
    if (!editingAuthor) return;

    try {
      const updatedData = {
        name: editName,
        subjectId: selectedSubject,
        bookIds: [selectedBook], // Assuming each author is linked to only one book
      };

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
      <div className="authors-container">
        <div className="authors-header-container">
          <h1 className="page-title">Authors</h1>
          <button
            onClick={() => navigate("/addauthors")}
            className="add-author-button"
          >
            Add Author
          </button>
        </div>
        <div className="author-list">
          {authors.length > 0 ? (
            authors.map((author) => (
              <div key={author._id} className="author-card">
                <div className="books-container">
                  {author.books.length > 0 ? (
                    author.books.map((book) => (
                      <div key={book._id} className="books-card">
                        <img
                          src={book.image?.url || "default-image-url"}
                          alt={book.title}
                          className="book-image"
                        />
                        <p className="book-title">{book.title}</p>
                        <p className="books-title">Author {author.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-books-message">No books available</p>
                  )}
                </div>
                <div className="button-container">
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
              </div>
            ))
          ) : (
            <p className="no-authors-message">No authors available</p>
          )}
        </div>
      </div>
      {editingAuthor && (
        <ModalEdit
          name={editName}
          subjects={subjects}
          books={books}
          onChangeName={setEditName}
          onCancel={handleEditCancel}
          onConfirm={handleEditConfirm}
          setSelectedSubject={setSelectedSubject}
          setSelectedBook={setSelectedBook}
          selectedSubject={selectedSubject}
          selectedBook={selectedBook}
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
