import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserEdit,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTimes,
  FaSave,
  FaOm,
  FaEnvelope,
  FaPray,
  FaHome,
  FaInfoCircle,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/DevoteeDirectory.css";
import DevoteeNavbar from "../components/Navbar/DevoteeNavbar";

const DevoteeDirectory = () => {
  const [devotees, setDevotees] = useState([]);
  const [search, setSearch] = useState("");
  const [editingDevotee, setEditingDevotee] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

  const fetchDevotees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/devotees`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setDevotees(await res.json());
    } catch (err) {
      console.error("Fetch Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevotees();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/devotees/${editingDevotee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(editingDevotee),
      });

      if (res.ok) {
        alert("Devotee records successfully synchronized.");
        setEditingDevotee(null);
        fetchDevotees();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const filteredDevotees = devotees.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.mobile.includes(search),
  );

  return (
    <>
      <DevoteeNavbar />
      <div className="directory-wrapper">
        <header className="directory-header">
          <div className="header-titles">
            <FaOm className="om-logo" />
            <h1>Devotee Registry</h1>
          </div>
          <div className="directory-search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Name or Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Updated: Vertical Strip Layout */}
        <div className="directory-list-container">
          {filteredDevotees.length > 0 ? (
            filteredDevotees.map((d) => (
              <div key={d.id} className="devotee-strip">
                <div className="strip-accent"></div>

                <div className="strip-section name-sec">
                  <div className="label-sm">Devotee Name</div>
                  <div className="main-val">{d.name}</div>
                  <div className="sub-val">{d.k_name}</div>
                </div>

                <div className="strip-section contact-sec">
                  <div className="label-sm">Contact Details</div>
                  <div className="icon-text">
                    <FaPhoneAlt /> {d.mobile}
                  </div>
                  {d.email && (
                    <div className="icon-text">
                      <FaEnvelope /> {d.email}
                    </div>
                  )}
                </div>

                <div className="strip-section location-sec">
                  <div className="label-sm">Location</div>
                  <div className="icon-text">
                    <FaMapMarkerAlt /> {d.city}
                  </div>
                  <div className="sub-val">PIN: {d.pincode}</div>
                </div>

                <div className="strip-section spiritual-sec">
                  <div className="label-sm">Spiritual Details</div>
                  <div>
                    <strong>Gotra:</strong> {d.gotra || "N/A"}
                  </div>
                  <div className="sub-val">
                    <strong>Deity:</strong> {d.kuladevata || "N/A"}
                  </div>
                </div>

                <div className="strip-actions">
                  <button
                    className="strip-edit-btn"
                    onClick={() => setEditingDevotee(d)}
                  >
                    <FaUserEdit /> Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-records">
              No sacred records found matching your search.
            </div>
          )}
        </div>

        {/* MODAL remains the same but ensure it follows the vertical scroll theme */}
        {editingDevotee && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <div className="modal-header">
                <h2>
                  <FaPray /> Edit Devotee Record
                </h2>
                {/* <FaTimes className="close-btn" onClick={() => setEditingDevotee(null)} /> */}
              </div>
              <form onSubmit={handleUpdate} className="edit-form-scrollable">
                <div className="f-field">
                  <label>Full Name (English)</label>
                  <input
                    type="text"
                    value={editingDevotee.name}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="f-field">
                  <label>ಹೆಸರು (Kannada)</label>
                  <input
                    type="text"
                    value={editingDevotee.k_name}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        k_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="f-field">
                  <label>
                    <FaHome /> Address (English)
                  </label>
                  <textarea
                    value={editingDevotee.address}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="f-field">
                  <label>ವಿಳಾಸ (Kannada)</label>
                  <textarea
                    value={editingDevotee.k_address}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        k_address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="f-field">
                  <label>City</label>
                  <input
                    type="text"
                    value={editingDevotee.city}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        city: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="f-field">
                  <label>Pincode (6 Digits)</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={editingDevotee.pincode}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        pincode: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="f-field">
                  <label>
                    <FaPhoneAlt /> Mobile
                  </label>
                  <input
                    type="tel"
                    value={editingDevotee.mobile}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        mobile: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="f-field">
                  <label>
                    <FaEnvelope /> Email
                  </label>
                  <input
                    type="email"
                    value={editingDevotee.email}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="f-field">
                  <label>Gotra</label>
                  <input
                    type="text"
                    value={editingDevotee.gotra}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        gotra: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="f-field">
                  <label>Kuladevata</label>
                  <input
                    type="text"
                    value={editingDevotee.kuladevata}
                    onChange={(e) =>
                      setEditingDevotee({
                        ...editingDevotee,
                        kuladevata: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-action-container">
                  <button type="submit" className="save-btn">
                    <FaSave /> UPDATE RECORD
                  </button>
                  <button
                    type="button"
                    className="discard-btn"
                    onClick={() => setEditingDevotee(null)}
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DevoteeDirectory;



