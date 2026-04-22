import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaBuilding,
  FaGem,
  FaShieldAlt,
  FaTrash,
  FaCheckCircle,
  FaPlus,
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getToken } from "../../utils/auth";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import "../Style/AssetDetail.css";

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [propCat, setPropCat] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // Track current image in slider

  useEffect(() => {
    fetchAssetDetails();
  }, [id]);

  const fetchAssetDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assets/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const res2 = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/pcat`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();
      const PropData = await res2.json();
      console.log(data);
      setFormData(data);
      setPropCat(PropData);
    } catch (err) {
      alert("Error fetching asset details");
    } finally {
      setLoading(false);
    }
  };

  // --- Image Slider Navigation ---
  const handleNext = () => {
    setActiveStep((prev) =>
      prev === formData.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrev = () => {
    setActiveStep((prev) =>
      prev === 0 ? formData.images.length - 1 : prev - 1,
    );
  };

  // --- Image Upload Logic ---
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      for (const file of files) {
        const imageFormData = new FormData();
        imageFormData.append("images", file);
        imageFormData.append(
          "image_metadata_0",
          JSON.stringify({ type: "GALLERY", is_primary: false }),
        );

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assets/${id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: imageFormData,
        });

        if (!res.ok) throw new Error("Failed to upload one or more images");
      }

      alert("Images uploaded successfully");
      fetchAssetDetails();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (
      !window.confirm("Are you sure you want to delete this photo permanently?")
    )
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/assets/images/${photoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );

      if (res.ok) {
        // If we deleted the last image, adjust activeStep
        if (activeStep >= formData.images.length - 1 && activeStep > 0) {
          setActiveStep((prev) => prev - 1);
        }
        fetchAssetDetails();
      }
    } catch (err) {
      alert("Failed to delete image");
    }
  };

  // --- Field Change Handlers ---
  const handleRootChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Temple Registry Updated Successfully");
        setIsEditing(false);
      }
    } catch (err) {
      alert("Update Failed");
    }
  };

  if (loading || !formData)
    return <div className="loading">Consulting Ledger...</div>;

  return (
    <>
      <AdminNavbar />
      <div className="detail-wrapper">
        <div className="header-nav">
          <button onClick={() => navigate(-1)} className="back-link">
            <FaArrowLeft /> Back to Directory
          </button>
          <div className="status-indicator">
            <span className={`type-badge ${formData.asset_type.toLowerCase()}`}>
              {formData.asset_type}
            </span>
          </div>
        </div>

        <div className="main-content">
          {/* PHOTO GALLERY SECTION */}
          <div className="photo-sidebar slider-focused">
            <div className="main-preview glass-frame big-slider">
              {formData.images && formData.images.length > 0 ? (
                <>
                  <img
                    src={formData.images[activeStep]?.image_url}
                    alt={`View ${activeStep + 1}`}
                    className="fade-in"
                  />

                  {formData.images.length > 1 && (
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
                    {activeStep + 1} / {formData.images.length}
                  </div>
                </>
              ) : (
                <div className="no-image-placeholder">
                  <FaCamera
                    size={40}
                    style={{ opacity: 0.3, marginBottom: "10px" }}
                  />
                  No Images Registered
                </div>
              )}

              {uploadingImage && (
                <div className="upload-overlay">Sanctifying Image...</div>
              )}
            </div>

            <div className="thumbnail-strip">
              {formData.images?.map((img, index) => (
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

          {/* FORM DETAILS SECTION */}
          <div className="details-form-area">
            <div className="glass-card">
              <div className="card-header-row">
                <h2>Registry Details</h2>
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
                      <FaSave /> Save
                    </button>
                  </div>
                )}
              </div>

              {/* GENERAL INFORMATION */}
              <div className="form-section">
                <h3>General Information</h3>
                <div className="grid-2">
                  <div className="field">
                    <label>Asset Name</label>
                    <input
                      value={formData.asset_name}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleRootChange("asset_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Asset Type</label>
                    <input value={formData.asset_type} readOnly />
                  </div>
                  <div className="field">
                    <label>Purchase Cost</label>
                    <input
                      value={formData.purchase_cost}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleRootChange("purchase_cost", e.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Current Value</label>
                    <input
                      value={formData.current_value}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleRootChange("current_value", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* PROPERTY SPECIFIC FIELDS */}
              {formData.asset_type === "PROPERTY" && (
                <div className="form-section accent-property">
                  <h3>
                    <FaBuilding /> Property Infrastructure
                  </h3>
                  <div className="grid-2">
                    <div className="field">
                      <label>Location / Survey No.</label>
                      <input
                        value={formData.details?.location || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "location",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Property Category</label>
                      <select
                        value={formData.details?.property_type || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "property_type",
                            e.target.value,
                          )
                        }
                      >
                        <option value="">select category</option>
                        {propCat.map((cat) => (
                          <option key={cat.p_id} value={cat.p_name}>
                            {cat.p_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Total Area (SqFt)</label>
                      <input
                        type="number"
                        value={formData.details?.total_area_sqft || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "total_area_sqft",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Rental Rate (₹)</label>
                      <input
                        type="number"
                        value={formData.details?.rental_rate || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "rental_rate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ORNAMENT SPECIFIC FIELDS */}
              {formData.asset_type === "ORNAMENT" && (
                <div className="form-section accent-ornament">
                  <h3>
                    <FaGem /> Material & Weight Details
                  </h3>
                  <div className="grid-2">
                    <div className="field">
                      <label>Material Type</label>
                      <input
                        value={formData.details?.material_type || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "material_type",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Purity (Karat/Grade)</label>
                      <select
                        value={formData.details?.purity || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "purity",
                            e.target.value,
                          )
                        }
                      >
                        <option value="24k">24k</option>
                        <option value="22k">22k</option>
                        <option value="18k">18k</option>
                        <option value="14k">14k</option>
                        <option value="10k">10k</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Gross Weight (g)</label>
                      <input
                        type="number"
                        value={formData.details?.gross_weight || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "gross_weight",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Net Weight (g)</label>
                      <input
                        type="number"
                        value={formData.details?.net_weight || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "net_weight",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Stone Weight (g)</label>
                      <input
                        type="number"
                        value={formData.details?.stone_weight || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "stone_weight",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Vault / Locker ID</label>
                      <input
                        value={formData.details?.locker_no || ""}
                        readOnly={!isEditing}
                        onChange={(e) =>
                          handleNestedChange(
                            "details",
                            "locker_no",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INSURANCE DATA */}
              <div className="form-section">
                <h3>
                  <FaShieldAlt /> Valuation & Insurance
                </h3>
                <div className="grid-2">
                  <div className="field">
                    <label>Insured Value (₹)</label>
                    <input
                      type="number"
                      value={formData.insurance?.insured_value || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleNestedChange(
                          "insurance",
                          "insured_value",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Policy Number</label>
                    <input
                      type="text"
                      value={formData.insurance?.policy_number || ""}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleNestedChange(
                          "insurance",
                          "policy_number",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Policy Expiry</label>
                    <input
                      type="date"
                      value={
                        formData.insurance?.expiry_date?.split("T")[0] || ""
                      }
                      readOnly={!isEditing}
                      onChange={(e) =>
                        handleNestedChange(
                          "insurance",
                          "expiry_date",
                          e.target.value,
                        )
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

export default AssetDetail;



