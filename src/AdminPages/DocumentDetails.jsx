import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/DocumentDetails.css";

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [docData, setDocData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocDetails();
  }, [id]);

  const fetchDocDetails = async () => {
    const res = await fetch(`${process.env.base_url}/api/documents/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) setDocData(await res.json());
  };

  // --- FUNCTION TO FORCE DOWNLOAD FULL SIZE ---
  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "document_scan.jpg";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: Open in new tab if blob fails
      window.open(url, "_blank");
    }
  };

  const handleImageAdd = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const data = new FormData();
    files.forEach((file, index) => {
      data.append("images", file);
      data.append(
        `image_metadata_${index}`,
        JSON.stringify({ type: "DOCUMENT_PAGE", is_primary: false }),
      );
    });

    try {
      const res = await fetch(
        `${process.env.base_url}/api/documents/images/addImage/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: data,
        },
      );
      if (res.ok) fetchDocDetails();
    } catch (err) {
      alert("Upload failed");
    }
    setUploading(false);
  };

  const handleImageDelete = async (photoId) => {
    if (!window.confirm("Delete this scanned page permanently?")) return;
    try {
      const res = await fetch(
        `${process.env.base_url}/api/documents/images/${photoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (res.ok) {
        setDocData({
          ...docData,
          images: docData.images.filter((img) => img.photo_id !== photoId),
        });
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(`${process.env.base_url}/api/documents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(docData),
    });
    if (res.ok) {
      setIsEditing(false);
      alert("Document updated successfully");
    }
  };

  const handleDeleteRecord = async () => {
    if (
      !window.confirm(
        "Are you sure? This deletes the entire document registry.",
      )
    )
      return;
    try {
      const response = await fetch(
        `${process.env.base_url}/api/documents/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (response.ok) {
        alert("Document deleted successfully");
        navigate("/admin/DocumentDirectory");
      }
    } catch (err) {
      alert("Server connection failed");
    }
  };

  if (!docData) return <div className="loader">Loading...</div>;

  return (
    <div className="detail-wrapper">
      <AdminNavbar />
      <div className="detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Directory
        </button>

        <div className="detail-main-grid">
          <div className="info-panel">
            <div className="panel-header">
              <h2>Document Information</h2>
              <div className="panel-actions">
                <button
                  className="edit-toggle"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Info"}
                </button>
                <button
                  className="del-btn"
                  onClick={handleDeleteRecord}
                  title="Delete Entire Record"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Document Name</label>
              <input
                disabled={!isEditing}
                value={docData.document_name}
                onChange={(e) =>
                  setDocData({ ...docData, document_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                disabled={!isEditing}
                rows="5"
                value={docData.remarks}
                onChange={(e) =>
                  setDocData({ ...docData, remarks: e.target.value })
                }
              />
            </div>

            {isEditing && (
              <button className="save-btn" onClick={handleUpdate}>
                <FaSave /> Save Changes
              </button>
            )}
          </div>

          <div className="gallery-panel">
            <div className="gallery-header">
              <h3>Scanned Pages ({docData.images?.length || 0})</h3>
              {uploading && (
                <span className="upload-status">
                  <FaSpinner className="spin" /> Uploading...
                </span>
              )}
            </div>

            <div className="image-scroll-grid">
              {docData.images?.map((img, index) => (
                <div key={img.photo_id} className="gallery-item">
                  <img src={img.image_url} alt="scan" />
                  <div className="image-overlay">
                    <button
                      className="icon-action"
                      onClick={() =>
                        handleDownload(
                          img.image_url,
                          `${docData.document_name}_page_${index + 1}.jpg`,
                        )
                      }
                    >
                      <FaDownload /> Download
                    </button>
                    <button
                      className="icon-action"
                      onClick={() => window.open(img.image_url, "_blank")}
                    >
                      <FaExternalLinkAlt /> View
                    </button>
                    <button
                      className="icon-action del"
                      onClick={() => handleImageDelete(img.photo_id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}

              <label
                className={`add-image-card ${!isEditing ? "disabled" : ""}`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleImageAdd}
                  hidden
                  accept="image/*"
                  disabled={!isEditing}
                />
                <FaPlus />
                <span>Add Page</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
