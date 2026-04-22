import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaFilePdf,
  FaBuilding,
  FaFolderOpen,
  FaFilter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import "./Style/DocumentDirectory.css";

const DocumentDirectory = () => {
  const [documents, setDocuments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [docRes, brRes] = await Promise.all([
        fetch(`${import.meta.env.base_url}/api/documents/all`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        fetch(`${import.meta.env.base_url}/api/TempleBranches/all`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      if (docRes.ok) setDocuments(await docRes.json());
      if (brRes.ok) setBranches(await brRes.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.document_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBranch =
      selectedBranch === "ALL" || doc.branch_id.toString() === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="doc-directory-wrapper">
      <AdminNavbar />
      <div className="directory-container doc-directory-container">
        <header className="directory-header">
          <div className="title-section">
            <h1>
              <FaFolderOpen /> Document Registry
            </h1>
            <p>Total Documents: {filteredDocs.length}</p>
          </div>

          <div className="filter-bar">
            <div className="doc-search-input">
              <FaSearch className="icon" />
              <input
                type="text"
                placeholder="Search documents..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="doc-branch-filter">
              <FaFilter />
              <select onChange={(e) => setSelectedBranch(e.target.value)}>
                <option value="ALL">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="doc-grid-view">
          {filteredDocs.map((doc) => (
            <div key={doc.doc_id} className="doc-card">
              <div className="doc-card-icon">
                <FaFilePdf />
              </div>
              <div className="doc-card-info">
                <h3>{doc.document_name}</h3>
                <span className="branch-tag">
                  <FaBuilding /> {doc.display_branch_name}
                </span>
                <p className="doc-date">
                  Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                className="view-btn"
                onClick={() => navigate(`/admin/documents/${doc.doc_id}`)}
              >
                <FaEye /> View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentDirectory;
