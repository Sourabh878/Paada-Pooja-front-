import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/TempleBranchMaster.css"; // Reusing your glass-card styling

const TempleBranchMaster = () => {
  const { id } = useParams(); // ID of the Main Temple
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    branch_name: "",
    k_name: "",
    address: "",
    location: "",
    email: "",
    website: "",
    contact: "",
    Description: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const data = new FormData();
      // Append text fields
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("parent_temple_id", id);

      // Append images
      selectedFiles.forEach((file) => data.append("images", file));

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/TempleBranches/addBranch`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: data, // Content-Type multipart/form-data handled by browser
        },
      );

      if (res.ok) {
        alert("Sub-Temple Branch Added successfully!");
        navigate(-1);
      }
    } catch (err) {
      alert("Error adding branch");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="temple-branch-master-container">
        <div className="header-nav">
          <button onClick={() => navigate(-1)} className="back-link">
            <FaArrowLeft /> Cancel
          </button>
        </div>
        <div className="outer-box">
          <form className="glass-card" onSubmit={handleSubmit}>
            <div className="card-header-row">
              <h2>Register Sub-Temple Branch</h2>
            </div>

            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="grid-2">
                <div className="field">
                  <label>Branch Temple Name (English)</label>
                  <input
                    name="branch_name"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label>ಹೆಸರು (Kannada Name)</label>
                  <input name="k_name" onChange={handleInputChange} />
                </div>

                <div className="field" style={{ gridColumn: "span 2" }}>
                  <label>Full Address</label>
                  <textarea
                    name="address"
                    required
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact & Digital Presence</h3>
              <div className="grid-2">
                <div className="field">
                  <label>Contact Number</label>
                  <input name="contact" onChange={handleInputChange} />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="field">
                  <label>Website URL</label>
                  <input name="website" onChange={handleInputChange} />
                </div>
                <div className="field">
                  <label>
                    <FaMapMarkerAlt /> Google Maps Location (URL)
                  </label>
                  <input
                    name="location"
                    onChange={handleInputChange}
                    placeholder="https://goo.gl/maps/..."
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label>Description</label>
                <textarea
                  name="Description"
                  required
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>
                <FaCamera /> Branch Pictures
              </h3>
              <div className="upload-box">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p>{selectedFiles.length} files selected</p>
              </div>
              <button type="submit" className="save-btn" disabled={uploading}>
                {uploading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave /> Save Branch
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TempleBranchMaster;
