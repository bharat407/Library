import React, { useState, useEffect } from "react";
import "./ModalEdit.css";

const ModalEdit = ({
  name = "",
  subjects = [],
  books = [],
  onChangeName,
  onCancel,
  onConfirm,
  setSelectedSubject,
  setSelectedBook,
  selectedSubject,
  selectedBook,
}) => {
  const [subject, setSubject] = useState(selectedSubject || "");
  const [book, setBook] = useState(selectedBook || "");

  useEffect(() => {
    setSubject(selectedSubject || ""); // Reset subject when modal opens
    setBook(selectedBook || ""); // Reset book when modal opens
  }, [selectedSubject, selectedBook]);

  const handleConfirm = () => {
    onConfirm({
      name,
      subject,
      book,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-edit">
        <h2>Edit Author</h2>
        <div className="modal-body">
          <div className="form-group">
            <label>Author Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Subject:</label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setSelectedSubject(e.target.value); // Notify parent
              }}
              className="dropdown"
            >
              <option value="">Select a subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Book:</label>
            <select
              value={book}
              onChange={(e) => {
                setBook(e.target.value);
                setSelectedBook(e.target.value); // Notify parent
              }}
              className="dropdown"
            >
              <option value="">Select a book</option>
              {books
                .filter((b) => b.subject && b.subject._id === subject) // Filter books based on selected subject
                .map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleConfirm} className="confirm-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;
