import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaTrash, FaArrowLeft, FaTable } from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/BoardManager.css";

const BoardManager = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState(Array(15).fill({}));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [branchId]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board-members/${branchId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      const data = await res.json();

      // Map fetched data into 15 rows
      const newRows = Array(15)
        .fill(null)
        .map((_, i) => data[i] || { branch_id: branchId });
      setRows(newRows);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  const saveRow = async (index) => {
    const rowData = rows[index];
    if (!rowData.full_name || !rowData.designation)
      return alert("Name and Designation required");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/board-members/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ...rowData, branch_id: branchId }),
      });
      if (res.ok) {
        alert("Row Saved");
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRow = async (index) => {
    const id = rows[index].member_id;
    if (!id) {
      const updatedRows = [...rows];
      updatedRows[index] = { branch_id: branchId };
      setRows(updatedRows);
      return;
    }
    if (!window.confirm("Delete this member?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/board-members/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (res.ok) fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="board-manager-page">
      <header className="spreadsheet-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="d-back-btn">
            <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
              <FaArrowLeft />
              Back
            </div>
          </button>
          <div>
            <h1>Board of Directors</h1>
            {/* <p>Branch Management Grid</p> */}
          </div>
        </div>
      </header>

      <div className="spreadsheet-outer-wrapper">
        <div className="spreadsheet-scroll-area">
          <table className="excel-grid">
            <thead>
              <tr>
                <th className="sticky-col col-idx sticky-no">#</th>
                <th className="sticky-col col-name">Full Name</th>
                <th>Designation</th>
                <th>Tenure Period</th>
                <th>Mobile 1</th>
                <th>Mobile 2</th>
                <th>Email</th>
                <th>Address</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="sticky-col sticky-no">
                    <div className="sticky-no">{index + 1}</div>
                  </td>
                  <td className="sticky-col col-name">
                    <input
                      value={row.full_name || ""}
                      onChange={(e) =>
                        handleInputChange(index, "full_name", e.target.value)
                      }
                      // placeholder="Enter Name..."
                    />
                  </td>
                  <td>
                    <input
                      value={row.designation || ""}
                      onChange={(e) =>
                        handleInputChange(index, "designation", e.target.value)
                      }
                      // placeholder="e.g. Chairman"
                    />
                  </td>
                  <td>
                    <input
                      value={row.tenure_period || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "tenure_period",
                          e.target.value,
                        )
                      }
                      // placeholder="e.g. 2024-2026"
                    />
                  </td>
                  <td>
                    <input
                      value={row.mobile_1 || ""}
                      onChange={(e) =>
                        handleInputChange(index, "mobile_1", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={row.mobile_2 || ""}
                      onChange={(e) =>
                        handleInputChange(index, "mobile_2", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={row.email || ""}
                      onChange={(e) =>
                        handleInputChange(index, "email", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      value={row.address || ""}
                      onChange={(e) =>
                        handleInputChange(index, "address", e.target.value)
                      }
                    />
                  </td>
                  <td className="col-actions">
                    <button
                      onClick={() => saveRow(index)}
                      className="board-btn-save"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => deleteRow(index)}
                      className="board-btn-del"
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
    </div>
  );
};

export default BoardManager;
