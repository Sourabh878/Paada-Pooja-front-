import React, { useState } from "react";
import {
  FaUserPlus,
  FaUsers,
  FaEdit,
  FaSearch,
  FaTimes,
  FaOm,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getToken, getUserId } from "../utils/auth";
import "./Style/DevoteeMaster.css";
import DevoteeNavbar from "../components/Navbar/DevoteeNavbar";

const DevoteeMaster = () => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    k_name: "",
    address: "",
    k_address: "",
    city: "",
    k_city: "",
    pincode: "",
    mobile: "",
    email: "",
    gotra: "",
    kuladevata: "",
    u_id: getUserId(),
  });

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const pinRegex = /^\d{6}$/;

    if (!mobileRegex.test(formData.mobile)) {
      alert("Invalid Mobile: Must be 10 digits starting with 6-9.");
      return false;
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      alert("Invalid Email format.");
      return false;
    }
    if (!pinRegex.test(formData.pincode)) {
      alert("Invalid Pincode: Must be exactly 7 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/devotees/${editingId}`
      : `${API_BASE}/devotees`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        resetForm();
        alert("Record Saved Successfully");
      } else {
        const errorText = await res.text();
        alert("Error saving record: " + errorText);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving record: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      k_name: "",
      address: "",
      k_address: "",
      city: "",
      k_city: "",
      pincode: "",
      mobile: "",
      email: "",
      gotra: "",
      kuladevata: "",
    });
    setEditingId(null);
  };

  return (
    <>
      <DevoteeNavbar />

      <div className="temple-theme-wrapper">
        <div className="devotee-master-container">
          <header className="temple-header">
            <FaOm className="om-icon" />
            <h1>Devotee Registration Portal</h1>
            {/* <p>Register Devotees </p> */}
          </header>

          <div className="responsive-content-stack">
            <section className="devotees-temple-card devotees-form-section">
              <div className="card-top">
                <FaUserPlus /> <h2>Registration</h2>
                {editingId && (
                  <FaTimes className="close-icon" onClick={resetForm} />
                )}
              </div>
              <form onSubmit={handleSubmit} className="temple-form">
                <div className="input-group">
                  <div className="input-field">
                    <label>Name (English) *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>ಹೆಸರು (Kannada)</label>
                    <input
                      type="text"
                      value={formData.k_name}
                      onChange={(e) =>
                        setFormData({ ...formData, k_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field">
                    <label>Address (English) *</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>ವಿಳಾಸ (Kannada)</label>
                    <textarea
                      value={formData.k_address}
                      onChange={(e) =>
                        setFormData({ ...formData, k_address: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="input-group trio">
                  <div className="in-group">
                    <div className="input-field">
                      <label>City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label>Pincode (6 Digits) *</label>
                      <input
                        type="text"
                        maxLength="6"
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="input-field">
                    <label>Mobile *</label>
                    <input
                      type="tel"
                      maxLength="10"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field">
                    <label>Email ID</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-field">
                    <label>Gotra</label>
                    <input
                      type="text"
                      value={formData.gotra}
                      onChange={(e) =>
                        setFormData({ ...formData, gotra: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="input-field full">
                  <label>Kuladevata</label>
                  <input
                    type="text"
                    value={formData.kuladevata}
                    onChange={(e) =>
                      setFormData({ ...formData, kuladevata: e.target.value })
                    }
                  />
                </div>

                <button type="submit" className="temple-submit-btn">
                  {"SAVE "}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DevoteeMaster;



