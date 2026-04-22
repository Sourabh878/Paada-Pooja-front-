import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaOm,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaUniversity,
  FaPray,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/PriestDirectory.css";
import DevoteeNavbar from "../components/Navbar/DevoteeNavbar";

const PriestDirectory = () => {
  const [priests, setPriests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE = `${import.meta.env.base_url}/api`;

  useEffect(() => {
    fetchPriests();
  }, []);

  const fetchPriests = async () => {
    try {
      const res = await fetch(`${API_BASE}/priests`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setPriests(await res.json());
    } catch (err) {
      console.error("Error fetching directory:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPriests = priests.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone_number.includes(searchTerm) ||
      p.gotra?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <DevoteeNavbar />
      <div className="directory-container">
        <header className="directory-header">
          <div className="title-section">
            <FaOm className="om-icon" />
            <h1>Priest Directory</h1>
            <p>View profile and academic details of temple priests</p>
          </div>

          <div className="search-wrapper">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by Name, Mobile or Gotra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="loader">Opening Sacred Records...</div>
        ) : (
          <div className="priest-grid">
            {filteredPriests.map((p) => (
              <div key={p.id} className="profile-card">
                <div className="profile-top">
                  <div className="image-container">
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={p.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="name-info">
                    <h2>{p.name}</h2>
                    <p className="kannada-name">{p.k_name}</p>
                    <span className="gotra-tag">{p.gotra || "Gotra N/A"}</span>
                  </div>
                </div>

                <div className="profile-body">
                  <div className="info-item">
                    <FaPhone /> <span>{p.phone_number}</span>
                  </div>
                  {p.email && (
                    <div className="info-item">
                      <FaEnvelope /> <span>{p.email}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <FaMapMarkerAlt />{" "}
                    <span>
                      {p.city} - {p.pincode}
                    </span>
                  </div>

                  <div className="divider"></div>

                  <div className="info-item">
                    <FaGraduationCap />
                    <div className="edu-stack">
                      <strong>{p.education || "Shastras"}</strong>
                      <small>{p.university}</small>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaPray />{" "}
                    <span>Kuladevata: {p.kuladevata || "General"}</span>
                  </div>
                </div>

                <div className="profile-footer">
                  <div className="address-box">
                    <small>Residence:</small>
                    <p>{p.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PriestDirectory;



