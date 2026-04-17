import React, { useState, useEffect } from "react";
import {
  FaUserTie,
  FaOm,
  FaUpload,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaSave,
  FaTrash,
  FaUserEdit,
  FaSearch,
  FaIdCard,
  FaUniversity,
  FaPrayingHands,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/PriestMaster.css";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const PriestMaster = () => {
  const [priests, setPriests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    k_name: "",
    address: "",
    k_address: "",
    city: "",
    pincode: "",
    phone_number: "",
    email: "",
    education: "",
    university: "",
    gotra: "",
    kuladevata: "",
    aadhar_number: "",
    pan_number: "",
    dl_number: "",
  });

  const API_BASE = `${process.env.base_url}/api`;

  useEffect(() => {
    fetchPriests();
  }, []);

  const fetchPriests = async () => {
    try {
      const res = await fetch(`${API_BASE}/priests`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPriests(data);
      }
    } catch (err) {
      console.error("Error fetching priests:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    // Append all text fields
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    // Append photo if selected
    if (photo) data.append("image", photo);

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/priests/${editingId}`
      : `${API_BASE}/priests`;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
        body: data,
      });

      if (res.ok) {
        alert(
          editingId
            ? "Record updated successfully!"
            : "Priest added successfully!",
        );
        resetForm();
        fetchPriests();
      }
    } catch (err) {
      console.error("Error saving priest:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      k_name: "",
      address: "",
      k_address: "",
      city: "",
      pincode: "",
      phone_number: "",
      email: "",
      education: "",
      university: "",
      gotra: "",
      kuladevata: "",
      aadhar_number: "",
      pan_number: "",
      dl_number: "",
    });
    setPhoto(null);
    setEditingId(null);
  };

  const handleEdit = (priest) => {
    setEditingId(priest.id);
    // Ensure nested fields are mapped correctly if backend returns them
    setFormData({
      name: priest.name || "",
      k_name: priest.k_name || "",
      address: priest.address || "",
      k_address: priest.k_address || "",
      city: priest.city || "",
      pincode: priest.pincode || "",
      phone_number: priest.phone_number || "",
      email: priest.email || "",
      education: priest.education || "",
      university: priest.university || "",
      gotra: priest.gotra || "",
      kuladevata: priest.kuladevata || "",
      aadhar_number: priest.aadhar_number || "",
      pan_number: priest.pan_number || "",
      dl_number: priest.dl_number || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Search Logic ---
  const filteredPriests = priests.filter((p) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(searchStr)) ||
      (p.k_name && p.k_name.toLowerCase().includes(searchStr)) ||
      (p.phone_number && p.phone_number.includes(searchTerm)) ||
      (p.city && p.city.toLowerCase().includes(searchStr))
    );
  });

  return (
    <>
      <AdminNavbar />
      <div className="priest-master-wrapper-xyz">
        <header className="page-header">
          <FaOm className="om-icon" />
          <h1>Priest Master Registry</h1>
        </header>

        <div className="master-grid">
          {/* Form Section */}
          <section className="form-card">
            <h3>
              <FaUserTie />{" "}
              {editingId ? "Edit Priest Details" : "Add New Priest"}
            </h3>
            <form onSubmit={handleSubmit} className="priest-form">
              <div className="form-section-title">Personal Information</div>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Full Name (English) *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="ಹೆಸರು (Kannada)"
                  value={formData.k_name}
                  onChange={(e) =>
                    setFormData({ ...formData, k_name: e.target.value })
                  }
                />
              </div>

              <div className="form-section-title">Address & Location</div>
              <textarea
                placeholder="Address (English) *"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <textarea
                placeholder="ವಿಳಾಸ (Kannada)"
                value={formData.k_address}
                onChange={(e) =>
                  setFormData({ ...formData, k_address: e.target.value })
                }
              />

              <div className="input-row">
                <input
                  type="text"
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Pincode *"
                  maxLength="7"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-row">
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="form-section-title">
                <FaIdCard /> Identity Verification
              </div>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Aadhar Number (12 Digits)"
                  maxLength="12"
                  value={formData.aadhar_number}
                  onChange={(e) =>
                    setFormData({ ...formData, aadhar_number: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="PAN Number"
                  style={{ textTransform: "uppercase" }}
                  value={formData.pan_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pan_number: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="DL Number"
                  value={formData.dl_number}
                  onChange={(e) =>
                    setFormData({ ...formData, dl_number: e.target.value })
                  }
                />
              </div>

              <div className="form-section-title">
                <FaUniversity /> Educational Background
              </div>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Education (e.g. Veda Vidwath)"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="University/Pathashala"
                  value={formData.university}
                  onChange={(e) =>
                    setFormData({ ...formData, university: e.target.value })
                  }
                />
              </div>

              <div className="form-section-title">
                <FaPrayingHands /> Spiritual Lineage
              </div>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="Gotra"
                  value={formData.gotra}
                  onChange={(e) =>
                    setFormData({ ...formData, gotra: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Kuladevata"
                  value={formData.kuladevata}
                  onChange={(e) =>
                    setFormData({ ...formData, kuladevata: e.target.value })
                  }
                />
              </div>

              <div className="photo-upload-box">
                <label>
                  <FaUpload /> Upload Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="priest-save-btn">
                  <FaSave /> {editingId ? "UPDATE RECORD" : "SAVE RECORD"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* List Section */}
          <section className="list-card">
            <div className="list-header-flex">
              <h3>Registered Priests</h3>
              <div className="priest-search-container">
                <FaSearch className="priest-search-icon" />
                <input
                  type="text"
                  placeholder="Search name, phone, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="priest-search-input"
                />
              </div>
            </div>

            <div className="priest-strips-container">
              {filteredPriests.length > 0 ? (
                filteredPriests.map((p) => (
                  <div key={p.id} className="priest-strip">
                    <div className="p-photo">
                      {p.photo_url ? (
                        <img src={p.photo_url} alt="Priest" />
                      ) : (
                        <div className="no-img">No Photo</div>
                      )}
                    </div>
                    <div className="p-info">
                      <div className="p-name">{p.name || p.k_name}</div>
                      <div className="p-detail">
                        <FaPhone /> {p.phone_number}
                      </div>
                      <div className="p-detail">
                        <FaMapMarkerAlt /> {p.city}
                      </div>
                    </div>
                    <div className="p-actions">
                      <button
                        className="priest-edit-btn"
                        title="Edit"
                        onClick={() => handleEdit(p)}
                      >
                        <FaUserEdit />
                        View and Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  No priests found matching your search.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PriestMaster;



