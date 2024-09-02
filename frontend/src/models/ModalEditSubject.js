import React, { useState, useEffect } from "react";
import "./ModalEdit.css";

const ModalEditSubject = ({
  name: initialName = "",
  onChange,
  onCancel,
  onConfirm,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleConfirm = () => {
    onConfirm({
      name,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Subject</h2>
        </div>
        <div className="modal-body">
          <label htmlFor="subjectName">Subject Name:</label>
          <input
            type="text"
            id="subjectName"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              onChange(e.target.value);
            }}
            className="input-field"
          />
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

export default ModalEditSubject;
