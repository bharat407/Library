import React from "react";
import "./Modal.css";

const ModalDelete = ({ name, onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Delete { }</h2>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete "{name}"?</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
