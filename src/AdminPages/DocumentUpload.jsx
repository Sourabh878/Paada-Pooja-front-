import React, { useState, useEffect } from "react";
import {
  FaFileMedical,
  FaFolderOpen,
  FaCloudUploadAlt,
  FaTrash,
  FaFileAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/DocumentUpload.css";

const DocumentUpload = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Stores the actual File objects
  const [formData, setFormData] = useState({
    document_name: "",
    remarks: "",
    branch_id: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/TempleBranches/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setBranches(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Map files to include a preview URL for the UI
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    const updated = [...selectedFiles];
    URL.revokeObjectURL(updated[index].preview); // Clean up memory
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0)
      return alert("Please upload at least one document image.");

    setLoading(true);
    const data = new FormData();
    data.append("document_name", formData.document_name);
    data.append("remarks", formData.remarks);
    data.append("branch_id", formData.branch_id);

    selectedFiles.forEach((fileObj, index) => {
      data.append("images", fileObj.file);
      // Sending metadata as requested by your backend logic
      data.append(
        `image_metadata_${index}`,
        JSON.stringify({
          type: "DOCUMENT_PAGE",
          is_primary: index === 0,
        }),
      );
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: data, // No Content-Type header; browser sets it for FormData
      });

      if (res.ok) {
        alert("Documents Digitalized and Saved!");
        setFormData({ document_name: "", remarks: "", branch_id: "" });
        setSelectedFiles([]);
      }
    } catch (err) {
      alert("Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="doc-upload-wrapper">
      <AdminNavbar />
      <div className="doc-container">
        <header className="doc-header">
          <FaFolderOpen className="header-icon" />
          <div>
            <h1>Digital Document Vault</h1>
            <p>Securely upload and categorize temple records</p>
          </div>
        </header>

        <form className="doc-form-card" onSubmit={handleSubmit}>
          <div className="doc-grid">
            {/* LEFT COLUMN: Metadata */}
            <div className="doc-inputs">
              <div className="d-field">
                <label>
                  <FaMapMarkerAlt /> Temple Branch
                </label>
                <select
                  value={formData.branch_id}
                  onChange={(e) =>
                    setFormData({ ...formData, branch_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Branch --</option>
                  <option value="0">Main Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.branch_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-field">
                <label>
                  <FaFileAlt /> Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Property Deed 2024"
                  value={formData.document_name}
                  onChange={(e) =>
                    setFormData({ ...formData, document_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="d-field">
                <label>Additional Remarks</label>
                <textarea
                  placeholder="Enter details about the document..."
                  rows="4"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Multi-Image Upload */}
            <div className="doc-upload-zone">
              <label className="dropzone">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  hidden
                  accept="image/*,application/pdf"
                />
                <FaCloudUploadAlt className="upload-icon" />
                <span>Click to Upload Scanned Pages</span>
                <small>JPG, PNG or PDF (Max 5MB per file)</small>
              </label>

              <div className="file-preview-grid">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="file-thumb">
                    <img src={file.preview} alt="preview" />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="remove-btn"
                    >
                      <FaTimes />
                    </button>
                    <span className="file-name-label">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="doc-submit-btn" disabled={loading}>
            {loading ? (
              "Uploading to Vault..."
            ) : (
              <>
                <FaFileMedical /> Finalize Digitalization
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
