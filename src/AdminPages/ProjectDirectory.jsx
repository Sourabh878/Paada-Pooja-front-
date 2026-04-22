import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaProjectDiagram,
  FaCalendarAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaBook,
  FaTimes,
  FaSave,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaRupeeSign,
  FaCheckCircle,
  FaHistory,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/ProjectDirectory.css";

const ProjectDirectory = () => {
  const [projects, setProjects] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      const [projRes, ledRes, brRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/projects/all`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/locations`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/TempleBranches/all`, { headers }),
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (ledRes.ok) setLedgers(await ledRes.json());
      if (brRes.ok) setBranches(await brRes.json());
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  const handleStageUpdate = (index, field, value) => {
    const updatedStages = [...editData.stages];
    updatedStages[index][field] = value;
    setEditData({ ...editData, stages: updatedStages });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${editData.project_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(editData),
        },
      );
      if (res.ok) {
        alert("Project and Stages updated successfully!");
        setShowEditModal(false);
        fetchInitialData();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project and all its lifecycle data?"))
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (res.ok)
        setProjects(projects.filter((p) => p.project_id !== projectId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.project_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <div className="loader">Loading Project Data...</div>;

  return (
    <div className="directory-page-wrapper">
      <AdminNavbar />
      <div className="directory-container">
        <header className="directory-header">
          <div className="header-left">
            <h1>
              <FaProjectDiagram /> Project Directory
            </h1>
            <p>Total Active Projects: {filteredProjects.length}</p>
          </div>
          <button
            className="add-project-btn"
            onClick={() => (window.location.href = "/admin/ProjectMaster")}
          >
            <FaPlus /> New Project
          </button>
        </header>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by project name..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th className="hide-mobile">Coordinator</th>
                <th>Branch</th>
                <th>Lifecycle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <React.Fragment key={p.project_id}>
                  <tr
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === p.project_id ? null : p.project_id,
                      )
                    }
                    className={expandedRow === p.project_id ? "active-row" : ""}
                  >
                    <td className="name-cell">
                      {expandedRow === p.project_id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                      {p.project_name}
                    </td>
                    <td className="hide-mobile">
                      {p.coordinator_name || "N/A"}
                    </td>
                    <td>{p.display_branch_name}</td>
                    <td>
                      <span
                        className={`status-tag ${p.has_stages ? "active" : ""}`}
                      >
                        {p.has_stages ? "Tracked" : "Basic"}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="edit-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditData({ ...p });
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-icon"
                        onClick={(e) => handleDelete(e, p.project_id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>

                  {expandedRow === p.project_id && (
                    <tr className="expanded-details">
                      <td colSpan="5">
                        <div className="details-layout">
                          <div className="details-grid">
                            <div className="det-item full">
                              <strong>
                                <FaInfoCircle /> Description:
                              </strong>{" "}
                              {p.project_details}
                            </div>
                            <div className="det-item">
                              <strong>
                                <FaUserTie /> Head:
                              </strong>{" "}
                              {p.coordinator_name}
                            </div>
                            <div className="det-item">
                              <strong>
                                <FaPhone /> Contact:
                              </strong>{" "}
                              {p.phone}
                            </div>
                            <div className="det-item">
                              <strong>
                                <FaEnvelope /> Email:
                              </strong>{" "}
                              {p.email}
                            </div>
                            <div className="det-item">
                              <strong>
                                <FaRupeeSign /> Cost:
                              </strong>{" "}
                              ₹{p.project_cost}
                            </div>
                            <div className="det-item">
                              <strong>
                                <FaMapMarkerAlt /> Address:
                              </strong>{" "}
                              {p.address}
                            </div>
                            <div className="det-item">
                              <strong>
                                <FaCalendarAlt /> Timeline:
                              </strong>
                              {new Date(p.commence_date).toLocaleDateString(
                                "en-GB",
                              )}
                              {" to "}
                              {new Date(
                                p.estimated_end_date,
                              ).toLocaleDateString("en-GB")}
                            </div>{" "}
                            <div className="det-item">
                              <strong>
                                <FaBook /> Ledger:
                              </strong>{" "}
                              {p.ledger_id}
                            </div>
                          </div>

                          {p.has_stages && p.stages && (
                            <div className="lifecycle-section">
                              <h4>
                                <FaHistory /> Progress Timeline
                              </h4>
                              <div className="timeline-container">
                                {p.stages.map((s, idx) => (
                                  <div
                                    key={idx}
                                    className={`timeline-card ${s.start_date ? "done" : ""}`}
                                  >
                                    <FaCheckCircle className="status-ico" />
                                    <div className="timeline-info">
                                      <span className="s-name">
                                        {s.stage_name}
                                      </span>
                                      <small>
                                        {s.start_date
                                          ? `${s.start_date} - ${s.end_date || "Ongoing"}`
                                          : "Pending"}
                                      </small>
                                      <p>{s.remarks}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MASTER UPDATE MODAL --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>Edit Project Dashboard</h2>
              <FaTimes
                className="close-modal"
                onClick={() => setShowEditModal(false)}
              />
            </div>
            <form onSubmit={handleUpdateSubmit} className="modal-body-scroll">
              <div className="modal-grid-container">
                <div className="m-field full">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={editData.project_name}
                    onChange={(e) =>
                      setEditData({ ...editData, project_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="m-field full">
                  <label>Project Details</label>
                  <textarea
                    rows="3"
                    value={editData.project_details}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        project_details: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Commence Date</label>
                  <input
                    type="date"
                    value={editData.commence_date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        commence_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={editData.estimated_end_date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        estimated_end_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Head Name</label>
                  <input
                    type="text"
                    value={editData.coordinator_name}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        coordinator_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Cost</label>
                  <input
                    type="number"
                    value={editData.project_cost}
                    onChange={(e) =>
                      setEditData({ ...editData, project_cost: e.target.value })
                    }
                  />
                </div>
                <div className="m-field">
                  <label>Branch</label>
                  <select
                    value={editData.branch_id}
                    onChange={(e) =>
                      setEditData({ ...editData, branch_id: e.target.value })
                    }
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.branch_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="m-field">
                  <label>Ledger</label>
                  <select
                    value={editData.ledger_id}
                    onChange={(e) =>
                      setEditData({ ...editData, ledger_id: e.target.value })
                    }
                  >
                    {ledgers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="m-field full">
                  <label>Address</label>
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                  />
                </div>

                <div className="m-field full checkbox-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={editData.has_stages}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          has_stages: e.target.checked,
                        })
                      }
                    />{" "}
                    Track Lifecycle Stages
                  </label>
                </div>
              </div>

              {editData.has_stages && (
                <div className="modal-stages-edit">
                  <h3>Edit Lifecycle Timeline</h3>
                  {editData.stages?.map((stage, idx) => (
                    <div key={idx} className="edit-stage-row">
                      <span className="s-label">{stage.stage_name}</span>
                      <div className="s-inputs">
                        <input
                          type="date"
                          value={stage.start_date?.split("T")[0] || ""}
                          onChange={(e) =>
                            handleStageUpdate(idx, "start_date", e.target.value)
                          }
                        />
                        <input
                          type="date"
                          value={stage.end_date?.split("T")[0] || ""}
                          onChange={(e) =>
                            handleStageUpdate(idx, "end_date", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Remarks"
                          value={stage.remarks || ""}
                          onChange={(e) =>
                            handleStageUpdate(idx, "remarks", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <FaSave /> Update All Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDirectory;



