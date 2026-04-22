import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaUserShield,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaUsers,
  FaTrash,
  FaUserEdit,
  FaOm,
  FaUserCheck,
  FaTimes,
  FaPowerOff,
} from "react-icons/fa";
import { getToken } from "../utils/auth";
import "./Style/UserManager.css";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    is_active: true, // Default to active
  });

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/ManageUser`;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const authHeaders = { Authorization: `Bearer ${getToken()}` };
      const [userRes, roleRes] = await Promise.all([
        fetch(`${API_BASE}/`, { headers: authHeaders }),
        fetch(`${API_BASE}/roles`, { headers: authHeaders }),
      ]);
      if (userRes.ok) setUsers(await userRes.json());
      if (roleRes.ok) setRoles(await roleRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditInit = (user) => {
    setIsEditing(true);
    setEditId(user.id);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
      role_id: roles.find((r) => r.role_name === user.role_name)?.id || "",
      password: "", // Keep blank for security during edit
      is_active: user.is_active, // Map from database
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role_id: "",
      is_active: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `${API_BASE}/${editId}`
      : `${API_BASE}/register`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isEditing ? "Account Updated" : "Account Created");
        resetForm();
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-manager-page">
      <AdminNavbar />
      <div className="user-manager-container">
        <header className="page-header">
          <FaOm className="om-icon" />
          <h1>User Management</h1>
        </header>

        <div className="admin-dashboard-grid">
          <section className="user-config-card user-form-section">
            <div className="card-header">
              {isEditing ? <FaUserEdit /> : <FaUserPlus />}
              <h2>{isEditing ? "Modify Account" : "Register Staff"}</h2>
              {isEditing && (
                <FaTimes className="cancel-edit" onClick={resetForm} />
              )}
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="f-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <FaUserCheck />
                  <input
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="f-row">
                <div className="f-group" style={{ flex: 1 }}>
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                    <FaPhone />
                    <input
                      name="phone"
                      type="tel"
                      pattern="[6-9]{1}[0-9]{9}"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="f-group" style={{ flex: 1 }}>
                  <label>Role</label>
                  <div className="input-with-icon">
                    <FaUserShield />
                    <select
                      name="role_id"
                      value={formData.role_id}
                      onChange={(e) =>
                        setFormData({ ...formData, role_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.role_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="f-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <FaEnvelope />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="f-group">
                <label>
                  Password {isEditing && "(Leave blank to keep current)"}
                </label>
                <div className="input-with-icon">
                  <FaLock />
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!isEditing}
                  />
                </div>
              </div>

              {/* Activation Radio Buttons */}

              {isEditing && (
                <div className="f-group status-radio-group">
                  <label>Account Status</label>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="is_active"
                        checked={formData.is_active === true}
                        onChange={() =>
                          setFormData({ ...formData, is_active: true })
                        }
                      />
                      <span className="status-text active-txt">Active</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="is_active"
                        checked={formData.is_active === false}
                        onChange={() =>
                          setFormData({ ...formData, is_active: false })
                        }
                      />
                      <span className="status-text inactive-txt">Inactive</span>
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`admin-submit-btn ${isEditing ? "update-mode" : ""}`}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isEditing
                    ? "UPDATE ACCOUNT"
                    : "CREATE ACCOUNT"}
              </button>
            </form>
          </section>

          <section className="user-config-card list-section">
            <div className="card-header">
              <FaUsers /> <h2>Active Personnel</h2>
            </div>
            <div className="user-scroll-list">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user-strip ${!user.is_active ? "deactivated" : ""}`}
                >
                  <div className="user-meta">
                    <div className="u-name">
                      {user.full_name}
                      {!user.is_active && (
                        <span className="inactive-badge">Disabled</span>
                      )}
                    </div>
                    <div className="u-email">
                      {user.email} | {user.role_name}
                    </div>
                  </div>
                  <div className="user-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => handleEditInit(user)}
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManager;



