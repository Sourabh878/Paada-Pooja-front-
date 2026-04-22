import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaUniversity,
  FaSync,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import "./Style/BranchBankingView.css";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const BranchBankingView = () => {
  const [accounts, setAccounts] = useState([]);
  const [branches, setBranches] = useState([]); // Needed for the dropdown in popup
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/BankDetails`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setAccounts(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

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

  useEffect(() => {
    fetchAccounts();
    fetchBranches();
  }, []);

  // --- Modal Logic ---
  const openEditModal = (account) => {
    setEditingData({
      ...account,
      // Convert boolean to string for the select inputs
      has_net_banking: String(account.has_net_banking),
      has_cheque_book: String(account.has_cheque_book),
    });
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/BankDetails/${editingData.account_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(editingData),
        },
      );
      if (res.ok) {
        alert("Updated successfully!");
        closeForm();
        fetchAccounts();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/BankDetails/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setAccounts(accounts.filter((acc) => acc.account_id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.display_branch_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="banking-view-wrapper">
      <AdminNavbar />
      <div className="back-btn">
        <button onClick={goBack}>back</button>
      </div>
      <div className="view-card">
        <div className="view-header">
          <div className="header-title">
            <FaUniversity className="main-icon" />
            <div>
              <h3>Branch Banking Directory</h3>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <FaSearch />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="refresh-btn" onClick={fetchAccounts}>
              <FaSync />
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="banking-display-table">
            <thead>
              <tr>
                <th>Temple Branch</th>
                <th>Bank Details</th>
                <th>Account Number</th>
                <th className="text-center">Net Banking</th>
                <th className="text-center">Cheque Book</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr key={acc.account_id}>
                  <td className="branch-col">{acc.display_branch_name}</td>
                  <td>
                    <strong>{acc.bank_name}</strong>
                    <br />
                    <small>{acc.ifsc_code}</small>
                  </td>
                  <td className="acc-num">{acc.account_number}</td>
                  <td className="text-center">
                    {acc.has_net_banking ? (
                      <FaCheckCircle className="tick-icon" color="green" />
                    ) : (
                      <FaTimesCircle className="tick-icon" color="red" />
                    )}
                  </td>
                  <td className="text-center">
                    {acc.has_cheque_book ? (
                      <FaCheckCircle className="tick-icon" color="green" />
                    ) : (
                      <FaTimesCircle className="tick-icon" color="red" />
                    )}
                  </td>
                  <td className="actions-col">
                    <button
                      className="bank-edit-btn"
                      onClick={() => openEditModal(acc)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bank-delete-btn"
                      onClick={() => handleDelete(acc.account_id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EDIT POPUP MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Banking Details</h3>
              <button className="close-x" onClick={closeForm}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="modal-grid">
                <div className="m-input full">
                  <label>Branch</label>
                  <select
                    value={editingData.branch_id}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        branch_id: e.target.value,
                      })
                    }
                  >
                    <option value="0">Main Branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.branch_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="m-input">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    value={editingData.bank_name}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        bank_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-input">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    value={editingData.ifsc_code}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        ifsc_code: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="m-input">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={editingData.account_number}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        account_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="m-input">
                  <label>Net Banking?</label>
                  <select
                    value={editingData.has_net_banking}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        has_net_banking: e.target.value,
                      })
                    }
                  >
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="m-btn-cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="m-btn-save">
                  <FaSave /> Update Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchBankingView;
