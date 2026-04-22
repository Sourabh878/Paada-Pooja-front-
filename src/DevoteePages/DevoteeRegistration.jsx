import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPray,
  FaGlobe,
  FaSave,
  FaCity,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/DevoteeRegistration.css";

const DevoteeRegistration = () => {
  const [loading, setLoading] = useState(false);
  const gotraRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    k_name: "",
    address: "",
    k_address: "",
    city: "",
    k_city: "",
    pincode: "",
    mobile: "",
    mobile_2: "",
    email: "",
    gotra: "",
    kuladevata: "",
    math: "",
    Taluk: "",
    District: "",
    State: "",
    country: "India",
    house: "",
    street_1: "",
    street_2: "",
    landmark: "",
  });

  const GOTRA_LIST = [
    "Angirasa",
    "Atri",
    "Bhardwaj",
    "Bhrigu",
    "Garg",
    "Gautam",
    "Jamadagni",
    "Kashyap",
    "Kaundinya",
    "Maitreyi",
    "Mudgala",
    "Parashar",
    "Sandilya",
    "Srivatsa",
    "Upamanyu",
    "Vashistha",
    "Vatsa",
    "Vishvamitra",
  ];

  const [gotraSearch, setGotraSearch] = useState("");
  const [showGotraList, setShowGotraList] = useState(false);

  // Filter Gotras based on search input
  const filteredGotras = GOTRA_LIST.filter((g) =>
    g.toLowerCase().includes(gotraSearch.toLowerCase()),
  );

  // Close Gotra list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gotraRef.current && !gotraRef.current.contains(event.target)) {
        setShowGotraList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectGotra = (val) => {
    setFormData({ ...formData, gotra: val });
    setGotraSearch(val);
    setShowGotraList(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- NEW: Check if Mobile or Email is already registered ---
  const checkExistingUser = async (field, value) => {
    if (!value || value.length < 5) return;

    try {
      const res = await fetch(
        `${import.meta.env.base_url}/api/devotees/check?search=${encodeURIComponent(value)}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      const data = await res.json();

      if (data.exists) {
        alert(
          `⚠️ Already Registered!\nDevotee is already linked to this ${field}.`,
        );
        // Optional: Clear the field or stop progress
      }
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.base_url}/api/devotees/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Devotee Registered Successfully!");
        window.location.reload(); // Refresh to clear form
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="devotee-page-wrapper">
      <div className="devotee-container">
        <header className="mobile-header">
          <h1>Devotee Registration</h1>
          <p>Add new devotee to the temple records</p>
        </header>

        <form onSubmit={handleSubmit} className="devotee-form">
          <div className="devotee-form-card">
            <h3 className="section-title">
              <FaUser /> Devotee Details
            </h3>

            <div className="mobile-grid">
              {/* Personal Details */}
              <div className="input-group full-width">
                <label>
                  Full Name (English) <div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaPhoneAlt /> Mobile <div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={(e) => checkExistingUser("Mobile", e.target.value)}
                  placeholder="10-digit number"
                />
              </div>

              <div className="input-group">
                <label>Secondary Mobile</label>
                <input
                  type="text"
                  name="mobile_2"
                  value={formData.mobile_2}
                  onChange={handleChange}
                  placeholder="Alternate number"
                />
              </div>

              <div className="input-group full-width">
                <label>
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(e) => checkExistingUser("Email", e.target.value)}
                  placeholder="example@mail.com"
                />
              </div>

              {/* Address */}
              {/* <div className="input-group full-width">
                                <label><FaMapMarkerAlt /> Address *</label>
                                <textarea 
                                    name="address" 
                                    required 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    rows="2"
                                    placeholder="House No, Street, Landmark"
                                />
                            </div> */}

              <div className="input-group">
                <label>
                  <FaCity />
                  House No.<div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="house"
                  required
                  value={formData.house}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  <FaCity />
                  Street 1<div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="street_1"
                  required
                  value={formData.street_1}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  <FaCity />
                  Street 2
                </label>
                <input
                  type="text"
                  name="street_2"
                  value={formData.street_2}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  <FaCity />
                  Land Mark<div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="landmark"
                  required
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  <FaCity /> City <div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  Taluka <div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="Taluk"
                  required
                  value={formData.Taluk}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  District <div style={{ color: "red" }}>*</div>
                </label>
                <input
                  type="text"
                  name="District"
                  required
                  value={formData.District}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>State</label>
                <input
                  type="text"
                  name="State"
                  value={formData.State}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  <FaGlobe /> Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              {/* Spiritual Details */}
              <div
                className="input-group full-width gotra-container"
                ref={gotraRef}
              >
                <label>
                  <FaPray /> Gotra
                </label>
                <div className="search-select-wrapper">
                  <input
                    type="text"
                    placeholder="Search or type Gotra..."
                    value={gotraSearch}
                    onFocus={() => setShowGotraList(true)}
                    onChange={(e) => {
                      setGotraSearch(e.target.value);
                      setFormData({ ...formData, gotra: e.target.value });
                    }}
                  />
                  {showGotraList && filteredGotras.length > 0 && (
                    <ul className="search-results-list">
                      {filteredGotras.map((g, i) => (
                        <li key={i} onClick={() => selectGotra(g)}>
                          {g}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="input-group full-width">
                <label>Kuladevata</label>
                <input
                  type="text"
                  name="kuladevata"
                  value={formData.kuladevata}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group full-width">
                <label>Math / Sampradaya</label>
                <input
                  type="text"
                  name="math"
                  value={formData.math}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="sticky-footer">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                "Registering..."
              ) : (
                <>
                  <FaSave /> Save Devotee Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevoteeRegistration;



