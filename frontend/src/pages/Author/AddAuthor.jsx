import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/common/Navbar";
import  "./AddAuthor.css";
import Spinner from "../../Error/spinner";
import Error from "../../Error/Error";

const AddAuthor = () => {
  const [authorName, setAuthorName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [bookId, setBookId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
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
      }
    };

    // Fetch books initially
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
      }
    };

    const fetchData = async () => {
      await fetchSubjects();
      await fetchBooks();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSubjectChange = (e) => {
    const selectedSubjectId = e.target.value;
    setSubjectId(selectedSubjectId);

    // Filter books based on the selected subject
    if (selectedSubjectId) {
      const filtered = books.filter(
        (book) => book.subject && book.subject._id === selectedSubjectId
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]); // Reset to no books if no subject is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName || !subjectId || !bookId) {
      toast.error("Please fill in all fields.");
      return;
    }

    const authorData = {
      name: authorName,
      subjectId: subjectId,
      bookIds: [bookId], // Include the selected book ID
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/authors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(authorData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to create author");
        return;
      }

      const newAuthor = await response.json();
      toast.success(`Author "${newAuthor.name}" created successfully`);
      navigate("/displayauthors"); // Redirect to the authors page
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
      <div className="addAuthorContainer">
        <div className="heading">Add New Author</div>
        <form onSubmit={handleSubmit} className="addAuthorForm">
          <div className="formGroup">
            <label htmlFor="authorName">Author Name:</label>
            <input
              type="text"
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="subject">Select Subject:</label>
            <select
              id="subject"
              value={subjectId}
              onChange={handleSubjectChange}
              required
            >
              <option value="">Select a Subject</option>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))
              ) : (
                <option value="">No Subjects Available</option>
              )}
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="book">Select Book:</label>
            <select
              id="book"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            >
              <option value="">Select a Book</option>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title}
                  </option>
                ))
              ) : (
                <option value="">No Books Available</option>
              )}
            </select>
          </div>
          <button type="submit" className="submitButton">
            Add Author
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAuthor;
