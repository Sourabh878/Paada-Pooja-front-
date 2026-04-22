import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTrash,
  FaCheckCircle,
  FaPlus,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/BranchDetail.css";

const BranchDetail = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [branchData, setBranchData] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    fetchBranchDetails();
  }, [branchId]);

  const fetchBranchDetails = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.base_url}/api/TempleBranches/${branchId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      const data = await res.json();
      setBranchData(data);
    } catch (err) {
      alert("Error fetching branch details");
    } finally {
      setLoading(false);
    }
  };

  // Slider Navigation
  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % branchData.images.length);
  };

  const handlePrev = () => {
    setActiveStep(
      (prev) =>
        (prev - 1 + branchData.images.length) % branchData.images.length,
    );
  };

  const handleInputChange = (field, value) => {
    setBranchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm(`Delete this branch photo permanently?`)) return;
    try {
      const res = await fetch(
        `${import.meta.env.base_url}/api/TempleBranches/images/${photoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (res.ok) {
        setBranchData((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img.id !== photoId),
        }));
        // Reset active step if we delete the current image
        setActiveStep(0);
      }
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      for (const file of files) {
        const imageFormData = new FormData();
        imageFormData.append("images", file);

        await fetch(
          `${import.meta.env.base_url}/api/TempleBranches/addImage/${branchId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` },
            body: imageFormData,
          },
        );
      }
      fetchBranchDetails();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.base_url}/api/TempleBranches/${branchId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(branchData),
        },
      );
      if (res.ok) {
        alert("Branch updated successfully");
        setIsEditing(false);
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading || !branchData)
    return <div className="loading">Opening Branch Ledger...</div>;

  return (
    <>
      <AdminNavbar />
      <div className="detail-wrapper">
        <div className="header-nav">
          <button onClick={() => navigate(-1)} className="back-link">
            <FaArrowLeft /> Back
          </button>
          <button
            className="edit-btn"
            onClick={() => navigate(`/admin/BoardManager/${branchId}`)}
          >
            Manage Directors
          </button>
        </div>

        <div className="main-content branch-view-layout">
          {/* PHOTO SIDEBAR WITH SLIDER */}
          <div className="photo-sidebar slider-focused">
            <div className="main-preview glass-frame big-slider">
              {branchData.images && branchData.images.length > 0 ? (
                <>
                  <img
                    src={branchData.images[activeStep]?.image_url}
                    alt={`View ${activeStep + 1}`}
                    className="fade-in"
                  />

                  {branchData.images.length > 1 && (
                    <div className="slider-nav-btns">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="slide-btn prev"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="slide-btn next"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  )}

                  <div className="image-counter">
                    {activeStep + 1} / {branchData.images.length}
                  </div>
                </>
              ) : (
                <div className="no-image-placeholder">No Images Registered</div>
              )}

              {uploadingImage && (
                <div className="upload-overlay">Sanctifying Image...</div>
              )}
            </div>

            <div className="thumbnail-strip">
              {branchData.images?.map((img, index) => (
                <div
                  key={img.id}
                  className={`thumb-container ${index === activeStep ? "active-thumb" : ""}`}
                  onClick={() => setActiveStep(index)}
                >
                  <img src={img.image_url} alt="Branch view" />
                  {isEditing && (
                    <button
                      className="delete-img-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(img.id);
                      }}
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                  {img.is_primary && (
                    <div
                      className="primary-mini-dot"
                      title="Primary Image"
                    ></div>
                  )}
                </div>
              ))}

              {isEditing && (
                <label className="add-photo-placeholder">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    hidden
                    accept="image/*"
                  />
                  <FaPlus />
                  <span>Add</span>
                </label>
              )}
            </div>
          </div>

          {/* BRANCH DATA AREA */}
          <div className="details-form-area wide-form">
            <div className="glass-card">
              <div className="card-header-row">
                <h2>{branchData.branch_name}</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="edit-btn"
                  >
                    <FaEdit /> Edit
                  </button>
                ) : (
                  <div className="edit-controls">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button onClick={handleUpdate} className="save-btn">
                      <FaSave /> Update
                    </button>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3>
                  <FaMapMarkerAlt /> Geographical Data
                </h3>
                <div className="grid-2">
                  <div className="field">
                    <label>Branch Name (English)</label>
                    <input
                      value={branchData.branch_name || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleInputChange("branch_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label>ಹೆಸರು (Kannada)</label>
                    <input
                      value={branchData.k_name || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleInputChange("k_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="field full-width">
                    <label>Postal Address</label>
                    <textarea
                      value={branchData.address || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows="3"
                    />
                  </div>
                  <div className="field full-width">
                    <label>Google Maps Link</label>
                    <input
                      value={branchData.location_url || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleInputChange("location_url", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>
                  <FaGlobe /> Communication
                </h3>
                <div className="grid-2">
                  <div className="field">
                    <label>
                      <FaPhone /> Contact
                    </label>
                    <input
                      value={branchData.contact_no || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleInputChange("contact_no", e.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label>
                      <FaEnvelope /> Email
                    </label>
                    <input
                      value={branchData.email || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchDetail;
