import React, { useState, useEffect } from "react";
import "./ModalEdit.css";

const ModalEditBook = ({
  initialTitle = "",
  initialSubject = "",
  onChangeTitle,
  onChangeSubject = () => {}, // Default to a no-op function
  onCancel,
  onConfirm,
  subjects = [],
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [subject, setSubject] = useState(initialSubject);

  useEffect(() => {
    setTitle(initialTitle);
    setSubject(initialSubject);
  }, [initialTitle, initialSubject]);

  const handleConfirm = () => {
    onConfirm({
      title,
      subject,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Book</h2>
        </div>
        <div className="modal-body">
          <label htmlFor="bookTitle">Book Title:</label>
          <input
            type="text"
            id="bookTitle"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onChangeTitle(e.target.value);
            }}
            className="input-field"
          />
          <label htmlFor="subjectDropdown">Subject:</label>
          <select
            id="subjectDropdown"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              onChangeSubject(e.target.value);
            }}
            className="dropdown"
          >
            <option value="">Select a subject</option>
            {subjects
              .filter((value, index, self) => self.indexOf(value) === index) // Ensuring unique subjects
              .map((subjectOption) => (
                <option key={subjectOption} value={subjectOption}>
                  {subjectOption}
                </option>
              ))}
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

export default ModalEditBook;
