import React, { useState, useEffect } from "react";
import "./Card.css";
import Spinner from "../../Error/spinner";
import Error from "../../Error/Error";

const Cards = () => {
  const [data, setData] = useState({ subjects: [], books: [], authors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/subjects`
        );
        const booksResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/books`
        );
        const authorsResponse = await fetch(
          `${process.env.REACT_APP_BASE_URL}/authors`
        );

        if (!subjectsResponse.ok || !booksResponse.ok || !authorsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const subjects = await subjectsResponse.json();
        const books = await booksResponse.json();
        const authors = await authorsResponse.json();

        setData({ subjects, books, authors });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="loading-error-container">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="loading-error-container">
        <Error /> {error}
      </div>
    );

  return (
    <div className="cards-container">
      <div className="cards-grid">
        {data.subjects.map((subject) =>
          subject ? (
            <div key={subject._id} className="card-item">
              <h3>{subject.name}</h3>
              <div className="books-grid">
                {data.books
                  .filter(
                    (book) => book.subject && book.subject._id === subject._id
                  )
                  .map((book) =>
                    book ? (
                      <div key={book._id} className="book-card-item">
                        <h4 className="books-title">{book.title}</h4>
                        {book.image && (
                          <img
                            src={book.image.url}
                            alt={`${book.title} cover`}
                            className="books-image"
                          />
                        )}
                        <div className="author-section">
                          {book.authors && book.authors.length > 0 ? (
                            book.authors.map((author) => (
                              <div
                                key={author._id}
                                className="author-card-item"
                              >
                                <p className="author-name">
                                  Author {author.name}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No authors found</p>
                          )}
                        </div>
                      </div>
                    ) : null
                  )}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Cards;
