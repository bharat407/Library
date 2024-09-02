import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModalEditSubject from "../../models/ModalEditSubject";
import ModalDelete from "../../models/ModalDelete";
import Navbar from "../../components/common/Navbar";
import { toast } from "react-hot-toast";
import Spinner from "../../Error/spinner";
import Error from "../../Error/Error";
import "./DisplaySubjects.css";

const DisplaySubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

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
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleEditSubject = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/subjects/${selectedSubject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newSubjectName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update subject");
      }
      const updatedSubject = await response.json();
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject._id === updatedSubject._id ? updatedSubject : subject
        )
      );
      toast.success(`Subject "${newSubjectName}" updated successfully`);
      closeEditModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteSubject = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/subjects/${selectedSubject._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject._id !== selectedSubject._id)
      );
      toast.success(`Subject "${selectedSubject.name}" deleted successfully`);
      closeDeleteModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setNewSubjectName(subject.name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSubjectClick = async (subjectId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/books?subject=${subjectId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const books = await response.json();
      console.log(books);
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
    <div className="subjects-page-container">
      <Navbar />
      <div className="subjects-content-container">
        <div className="subjects-header-container">
          <h1 className="subjects-header-title">Subjects List</h1>
          <div className="subjects-header-buttons">
            <Link to="/addsubject" className="subjects-add-button">
              Add Subject
            </Link>
            <Link to="/dashboard" className="subjects-dashboard-button">
              Dashboard
            </Link>
          </div>
        </div>
        <div className="subjects-container-custom">
          {subjects.length > 0 ? (
            <table className="subjects-table-custom">
              <thead>
                <tr>
                  <th className="subjects-table-heading">Subject Name</th>
                  <th className="subjects-table-heading subjects-actions-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="subjects-row-custom">
                    <td
                      className="subjects-name-cell"
                      onClick={() => handleSubjectClick(subject._id)}
                    >
                      {subject.name}
                    </td>
                    <td className="subjects-actions-cell">
                      <div className="subjects-actions-container">
                        <button
                          className="subjects-edit-button"
                          onClick={() => openEditModal(subject)}
                        >
                          Edit
                        </button>
                        <button
                          className="subjects-delete-button"
                          onClick={() => openDeleteModal(subject)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="subjects-no-data">No subjects found</div>
          )}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <ModalEditSubject
            name={newSubjectName}
            onChange={setNewSubjectName}
            onCancel={closeEditModal}
            onConfirm={handleEditSubject}
          />
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="subjects-modal-overlay" onClick={closeDeleteModal}>
            <ModalDelete
              name={selectedSubject?.name}
              onCancel={closeDeleteModal}
              onConfirm={handleDeleteSubject}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplaySubject;
