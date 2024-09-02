import React, { useState, useEffect } from "react";
import "./Card.css";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cards-container">
      <div className="cards">
        {data.subjects.map((subject) =>
          subject ? (
            <div key={subject._id} className="card">
              <h3>{subject.name}</h3>
              <div className="books">
                {data.books
                  .filter(
                    (book) => book.subject && book.subject._id === subject._id
                  )
                  .map((book) =>
                    book ? (
                      <div key={book._id} className="book-card">
                        <h4>{book.title}</h4>
                        {book.image && (
                          <img
                            src={book.image.url}
                            alt={book.title}
                            className="book-image"
                          />
                        )}
                        <div className="authors">
                          {book.authors && book.authors.length > 0 ? (
                            book.authors.map((author) => (
                              <div key={author._id} className="author-card">
                                <p>{author.name}</p>
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
