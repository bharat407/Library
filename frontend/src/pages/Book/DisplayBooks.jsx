import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModalEdit from "../../models/ModalEditBook";
import ModalDelete from "../../models/ModalDelete";
import Navbar from "../../components/common/Navbar";
import { toast } from "react-hot-toast";
import "./DisplayBooks.css";

const DisplayBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/books`);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleEditBook = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/books/${selectedBook._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newBookTitle }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update book");
      }
      const updatedBook = await response.json();
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        )
      );
      toast.success(`Book "${newBookTitle}" updated successfully`);
      closeEditModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteBook = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/books/${selectedBook._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== selectedBook._id)
      );
      toast.success(`Book "${selectedBook.title}" deleted successfully`);
      closeDeleteModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setNewBookTitle(book.title);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="display-books-container">
        <div className="heading">Books List</div>
        <Link to="/addbook" className="add-book-button">
          Add Book
        </Link>
        <Link to="/dashboard" className="add-book-button">
          Dashboard
        </Link>
        <div className="books-list">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book._id} className="book-card">
                {book.image && (
                  <img
                    src={book.image.url}
                    alt={book.title}
                    className="book-image"
                  />
                )}
                <div className="book-details">
                  <div className="book-title">{book.title}</div>
                  <div className="book-subject">
                    Subject: {book.subject ? book.subject.name : "Unknown"}
                  </div>
                  <div className="book-authors">
                    Authors:{" "}
                    {book.authors && book.authors.length > 0
                      ? book.authors.map((author) => author.name).join(", ")
                      : "Unknown"}
                  </div>
                  <div className="book-buttons">
                    <button onClick={() => openEditModal(book)}>Edit</button>
                    <button onClick={() => openDeleteModal(book)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No books found</div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <ModalEdit
            initialTitle={newBookTitle}
            onChangeTitle={setNewBookTitle}
            onCancel={closeEditModal}
            onConfirm={handleEditBook}
            subjects={books.map((book) => book.subject.name)} // You may need to adjust this line based on the actual subject data structure
          />
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <ModalDelete
            name={selectedBook?.title}
            onCancel={closeDeleteModal}
            onConfirm={handleDeleteBook}
          />
        )}
      </div>
    </div>
  );
};

export default DisplayBooks;
