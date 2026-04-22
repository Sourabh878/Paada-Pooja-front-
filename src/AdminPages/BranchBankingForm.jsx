import React, { useState, useEffect } from "react";
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaCreditCard,
  FaGlobe,
  FaBook,
  FaPlusCircle,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/BranchBankingForm.css";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const BranchBankingForm = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    branch_id: "",
    bank_name: "",
    branch_name: "",
    ifsc_code: "",
    branch_address: "",
    account_number: "",
    has_net_banking: "false",
    has_cheque_book: "false",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${import.meta.env.base_url}/api/TempleBranches/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setBranches(await res.json());
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.base_url}/api/BankDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Banking details added successfully!");
        setFormData({
          branch_id: "",
          bank_name: "",
          branch_name: "",
          ifsc_code: "",
          branch_address: "",
          account_number: "",
          has_net_banking: "false",
          has_cheque_book: "false",
        });
      }
    } catch (err) {
      alert("Error saving details");
    }
    setLoading(false);
  };

  const navigateto = () => {
    navigate("/admin/BankDetailsView");
  };

  return (
    <div className="banking-form-container">
      <AdminNavbar />
      <header className="page-header">
        <h2>
          <FaUniversity className="bank-icon" /> Banking Details
        </h2>
        <p>Register official bank account details for temple branches</p>
      </header>
      <div className="nav-btn">
        <button className="submit-banking-btn" onClick={navigateto}>
          View Bank Details
        </button>
      </div>

      <form className="banking-card-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Branch Selection */}
          <div className="input-group full-width">
            <label>Select Temple Branch</label>
            <select
              value={formData.branch_id}
              onChange={(e) =>
                setFormData({ ...formData, branch_id: e.target.value })
              }
              required
            >
              <option value="">-- Choose a Branch --</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Bank Name</label>
            <div className="input-with-icon-branch">
              {/* <FaUniversity /> */}
              <input
                type="text"
                placeholder="e.g. State Bank of India"
                value={formData.bank_name}
                onChange={(e) =>
                  setFormData({ ...formData, bank_name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Branch Name</label>
            <div className="input-with-icon-branch">
              {/* <FaMapMarkerAlt /> */}
              <input
                type="text"
                placeholder="e.g. Sirsi Main"
                value={formData.branch_name}
                onChange={(e) =>
                  setFormData({ ...formData, branch_name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>IFSC Code</label>
            <div className="input-with-icon-branch">
              {/* <FaCreditCard /> */}
              <input
                type="text"
                maxLength="11"
                placeholder="SBIN0001234"
                value={formData.ifsc_code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ifsc_code: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Account Number</label>
            <div className="input-with-icon-branch">
              {/* <FaCreditCard /> */}
              <input
                type="text"
                placeholder="Enter Account No."
                value={formData.account_number}
                onChange={(e) =>
                  setFormData({ ...formData, account_number: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="input-group full-width">
            <label>Branch Address</label>
            <textarea
              rows="2"
              placeholder="Complete bank address..."
              value={formData.branch_address}
              onChange={(e) =>
                setFormData({ ...formData, branch_address: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>
              <FaGlobe /> Net Banking Available?
            </label>
            <select
              value={formData.has_net_banking}
              onChange={(e) =>
                setFormData({ ...formData, has_net_banking: e.target.value })
              }
            >
              <option value="false">NO</option>
              <option value="true">YES</option>
            </select>
          </div>

          <div className="input-group">
            <label>
              <FaBook /> Cheque Book Available?
            </label>
            <select
              value={formData.has_cheque_book}
              onChange={(e) =>
                setFormData({ ...formData, has_cheque_book: e.target.value })
              }
            >
              <option value="false">NO</option>
              <option value="true">YES</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-banking-btn" disabled={loading}>
          {loading ? (
            "Saving..."
          ) : (
            <>
              <FaPlusCircle /> Add Banking Details
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BranchBankingForm;
