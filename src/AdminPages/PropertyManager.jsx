import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaImages,
  FaRupeeSign,
  FaSave,
  FaEdit,
  FaPlus,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/PropertyManager.css";

const PropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    property_name: "",
    category_id: "",
    ledger_id: "",
    price: "",
    description: "",
  });

  const API_BASE = `${import.meta.env.base_url}/api`;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const authHeaders = { Authorization: `Bearer ${getToken()}` };
    try {
      const [propRes, catRes, ledRes] = await Promise.all([
        fetch(`${API_BASE}/properties`, { headers: authHeaders }),
        fetch(`${API_BASE}/properties/pcat`, { headers: authHeaders }),
        fetch(`${API_BASE}/locations`, { headers: authHeaders }),
      ]);
      if (propRes.ok) setProperties(await propRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (ledRes.ok) setLedgers(await ledRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    selectedFiles.forEach((file) => data.append("images", file));

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/properties/${editingId}`
      : `${API_BASE}/properties`;

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${getToken()}` },
      body: data,
    });

    if (res.ok) {
      alert("Property record synchronized successfully.");
      resetForm();
      fetchInitialData();
    }
  };

  const resetForm = () => {
    setFormData({
      property_name: "",
      category_id: "",
      ledger_id: "",
      price: "",
      description: "",
    });
    setSelectedFiles([]);
    setEditingId(null);
  };

  return (
    <div className="property-manager-container">
      <div className="manager-layout">
        {/* Form Section */}
        <section className="form-card">
          <header className="card-header">
            <h3>
              {editingId ? <FaEdit /> : <FaPlus />}{" "}
              {editingId ? "Edit Property" : "Add New Property"}
            </h3>
          </header>
          <form onSubmit={handleSubmit} className="temple-form">
            <div className="f-field">
              <label>Property Name</label>
              <input
                type="text"
                value={formData.property_name}
                onChange={(e) =>
                  setFormData({ ...formData, property_name: e.target.value })
                }
                required
              />
            </div>

            <div className="f-row">
              <div className="f-field">
                <label>Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.p_id} value={c.p_id}>
                      {c.p_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="f-field">
                <label>Ledger Head</label>
                <select
                  value={formData.ledger_id}
                  onChange={(e) =>
                    setFormData({ ...formData, ledger_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Ledger</option>
                  {ledgers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="f-field">
              <label>
                <FaRupeeSign /> Market Valuation
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>

            <div className="upload-zone">
              <label htmlFor="file-upload">
                <FaCloudUploadAlt /> Click to Upload Images
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <div className="file-count">
                {selectedFiles.length} files staged
              </div>
            </div>

            <button type="submit" className="save-btn">
              <FaSave /> {editingId ? "Update Record" : "Register Property"}
            </button>
          </form>
        </section>

        {/* List Section */}
        <section className="list-card">
          <header className="card-header">
            <h3>Property Directory</h3>
          </header>
          <div className="property-grid">
            {properties.map((p) => (
              <div key={p.id} className="prop-strip">
                <div className="prop-main">
                  <strong>{p.property_name}</strong>
                  <span>
                    {p.category_name} | ₹{p.price}
                  </span>
                </div>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingId(p.id);
                    setFormData(p);
                  }}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyManager;



