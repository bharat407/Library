import React, { useState, useEffect } from "react";
import "./ModalEdit.css";

const ModalEdit = ({
  name = "",
  onChange,
  onCancel,
  onConfirm,
  setSelectedSubject,
  setSelectedBook,
}) => {
  const [subject, setSubject] = useState("");
  const [book, setBook] = useState("");

  useEffect(() => {
    setSubject(""); // Reset subject when modal opens
    setBook(""); // Reset book when modal opens
  }, [name]);

  const handleConfirm = () => {
    onConfirm({
      name,
      subject,
      book,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Author</h2>
        </div>
        <div className="modal-body">
          <label htmlFor="authorName">Author Name:</label>
          <input
            type="text"
            id="authorName"
            value={name}
            onChange={(e) => onChange(e.target.value)}
            className="input-field"
          />
          <label htmlFor="subjectDropdown">Subject:</label>
          <select
            id="subjectDropdown"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setSelectedSubject(e.target.value); // Notify parent
            }}
            className="dropdown"
          >
            <option value="">Select a subject</option>
            {/* Example subjects */}
            <option value="subject1">Subject 1</option>
            <option value="subject2">Subject 2</option>
          </select>
          <label htmlFor="bookDropdown">Book:</label>
          <select
            id="bookDropdown"
            value={book}
            onChange={(e) => {
              setBook(e.target.value);
              setSelectedBook(e.target.value); // Notify parent
            }}
            className="dropdown"
          >
            <option value="">Select a book</option>
            {/* Example books */}
            <option value="book1">Book 1</option>
            <option value="book2">Book 2</option>
          </select>
        </div>
        <div className="modal-footer">
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
