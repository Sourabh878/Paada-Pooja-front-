import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaListUl,
  FaTags,
  FaUniversity,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { getToken } from "../../utils/auth";
import "../Style/SevaManager.css";

const SevaManager = () => {
  const [sevas, setSevas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storageLocations, setStorageLocations] = useState([]);
  const [editingSevaId, setEditingSevaId] = useState(null); // Track which Seva is being edited

  const [newSeva, setNewSeva] = useState({
    seva_name: "",
    k_name: "",
    description: "",
    price: "",
    Priest_price: "",
    category: "",
    storage_location: "",
  });

  const API_BASE = `${process.env.base_url}/api`;

  useEffect(() => {
    fetchSevas();
    fetchCategories();
    fetchStorageLocations();
  }, []);

  useEffect(() => {
    if (
      !editingSevaId &&
      (categories.length > 0 || storageLocations.length > 0)
    ) {
      setNewSeva((prev) => ({
        ...prev,
        category: prev.category || categories[0]?.name || "",
        storage_location:
          prev.storage_location || storageLocations[0]?.name || "",
      }));
    }
  }, [categories, storageLocations, editingSevaId]);

  const fetchCategories = async () => {
    try {
      const req = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (req.ok) setCategories(await req.json());
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchStorageLocations = async () => {
    try {
      const req = await fetch(`${API_BASE}/locations`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (req.ok) setStorageLocations(await req.json());
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const fetchSevas = async () => {
    try {
      const res = await fetch(`${API_BASE}/sevas/fetch`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setSevas(await res.json());
    } catch (err) {
      console.error("Error fetching sevas:", err);
    }
  };

  // Switch between Create and Update logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newSeva,
      price: parseFloat(newSeva.price) || 0,
      Priest_price: parseFloat(newSeva.Priest_price) || 0,
    };

    const method = editingSevaId ? "PUT" : "POST";
    const url = editingSevaId
      ? `${API_BASE}/sevas/${editingSevaId}`
      : `${API_BASE}/sevas`;

    try {
      // console.log(payload);
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchSevas();
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const resetForm = () => {
    setNewSeva({
      seva_name: "",
      k_name: "",
      description: "",
      price: "",
      Priest_price: "",
      category: categories[0]?.name || "",
      storage_location: storageLocations[0]?.name || "",
    });
    setEditingSevaId(null);
  };

  const handleEditClick = (seva) => {
    setEditingSevaId(seva.seva_id);
    setNewSeva({
      seva_name: seva.seva_name,
      k_name: seva.k_name,
      description: seva.description,
      price: seva.price,
      Priest_price: seva.Priest_price,
      category: seva.cname, // Note: using the join names from your table
      storage_location: seva.lname,
    });
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? "Deactivate" : "Activate";
    if (!window.confirm(`Are you sure you want to ${action} this Seva?`))
      return;

    try {
      const res = await fetch(`${API_BASE}/sevas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) fetchSevas();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="seva-manager-container">
      <div className="responsive-content-stack">
        <section className="management-card seva-form-section">
          <div className="card-top">
            {editingSevaId ? (
              <FaEdit className="icon" />
            ) : (
              <FaPlus className="icon" />
            )}
            <h2>{editingSevaId ? "Update Seva" : "Create New Seva"}</h2>
            {editingSevaId && (
              <button className="cancel-edit" onClick={resetForm}>
                <FaTimes /> Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="seva-form">
            <div className="input-field">
              <label>
                <FaTags /> Category
              </label>
              <select
                value={newSeva.category}
                onChange={(e) =>
                  setNewSeva({ ...newSeva, category: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-field">
              <label>Seva Name (English)</label>
              <input
                type="text"
                value={newSeva.seva_name}
                onChange={(e) =>
                  setNewSeva({ ...newSeva, seva_name: e.target.value })
                }
              />
            </div>

            <div className="input-field">
              <label>Seva Name (Kannada)</label>
              <input
                type="text"
                value={newSeva.k_name}
                onChange={(e) =>
                  setNewSeva({ ...newSeva, k_name: e.target.value })
                }
              />
            </div>

            <div className="input-field">
              <label>Description</label>
              <textarea
                value={newSeva.description}
                onChange={(e) =>
                  setNewSeva({ ...newSeva, description: e.target.value })
                }
                required
              />
            </div>

            <div
              className="price-summary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "15px",
              }}
            >
              <div style={{ fontWeight: "bold" }}>Total Price (₹)</div>
              <div
                className="tprice-readonly"
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  width: "100px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {parseFloat(newSeva.price || 0) +
                  parseFloat(newSeva.Priest_price || 0)}
              </div>
            </div>

            <div className="input-row-flex">
              <div className="input-field">
                <label>Temple (₹)</label>
                <input
                  type="number"
                  className="price"
                  value={newSeva.price}
                  onChange={(e) =>
                    setNewSeva({ ...newSeva, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-field">
                <label>Priest (₹)</label>
                <input
                  type="number"
                  className="price"
                  value={newSeva.Priest_price}
                  onChange={(e) =>
                    setNewSeva({ ...newSeva, Priest_price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="input-field">
              <label>
                <FaUniversity /> Ledger Head
              </label>
              <select
                value={newSeva.storage_location}
                onChange={(e) =>
                  setNewSeva({ ...newSeva, storage_location: e.target.value })
                }
                required
              >
                <option value="">Select Ledger</option>
                {storageLocations.map((opt) => (
                  <option key={opt.id || opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`submit-seva-btn ${editingSevaId ? "update-mode" : ""}`}
            >
              {editingSevaId ? "Update Seva Details" : "Add Seva"}
            </button>
          </form>
        </section>

        <section className="management-card list-section">
          <div className="card-top">
            <FaListUl className="icon" /> <h2>Existing Sevas</h2>
          </div>
          <div className="scrollable-table-box">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Edit</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Storage</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sevas.map((s) => (
                  <tr key={s.seva_id}>
                    <td>
                      <button
                        className="edit-icon-btn"
                        onClick={() => handleEditClick(s)}
                        title="Edit Seva"
                      >
                        <FaEdit color="#3498db" size={18} />
                      </button>
                    </td>
                    <td>
                      <div className="bold-name">
                        {s.seva_name ? s.seva_name : s.k_name}
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{s.cname}</span>
                    </td>
                    <td>
                      <small>{s.lname}</small>
                    </td>
                    <td>₹{s.price}</td>
                    <td>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleToggleStatus(s.seva_id, s.is_active)
                        }
                      >
                        {s.is_active ? (
                          <MdToggleOn size={34} color="#2ecc71" />
                        ) : (
                          <MdToggleOff size={34} color="#e74c3c" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SevaManager;



