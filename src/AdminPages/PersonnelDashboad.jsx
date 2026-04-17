import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUserShield, FaUsersCog, FaUserTie, FaFileInvoice, 
    FaFolderOpen, FaProjectDiagram, FaListAlt, FaArrowLeft,
    FaUniversity, FaLandmark // New Icons for Bank
} from 'react-icons/fa';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import './Style/PersonnelDashboard.css';

const PersonnelDashboard = () => {
    const navigate = useNavigate();

    const modules = [
        {
            title: "User Management",
            desc: "Manage admin users, roles, and system access permissions.",
            icon: <FaUsersCog />,
            path: "/admin/UserMaster",
            color: "#4a90e2"
        },
        {
            title: "Priest Master",
            desc: "Register and manage details of temple priests and staff.",
            icon: <FaUserTie />,
            path: "/admin/PriestMaster",
            color: "#e67e22"
        },
        {
            title: "Register Bank",
            desc: "Add new bank accounts and link them to temple branches.",
            icon: <FaUniversity />,
            path: "/admin/BankManager",
            color: "#d35400"
        },
        {
            title: "Bank Details",
            desc: "View account balances, statements, and transaction history.",
            icon: <FaLandmark />,
            path: "/admin/BankDetailsView",
            color: "#2c3e50"
        },
        {
            title: "Document Registry",
            desc: "Upload new scanned documents and legal records.",
            icon: <FaFileInvoice />,
            path: "/admin/DocumentMaster",
            color: "#27ae60"
        },
        {
            title: "Document Directory",
            desc: "Search, view, and download registered temple documents.",
            icon: <FaFolderOpen />,
            path: "/admin/DocumentDirectory",
            color: "#2980b9"
        },
        {
            title: "Project Registry",
            desc: "Initiate new temple infrastructure or social projects.",
            icon: <FaProjectDiagram />,
            path: "/admin/ProjectMaster",
            color: "#8e44ad"
        },
        {
            title: "Project Directory",
            desc: "Track progress and lifecycle stages of all active projects.",
            icon: <FaListAlt />,
            path: "/admin/ProjectDirectory",
            color: "#c0392b"
        }
    ];

    return (
        <div className="personnel-dashboard-wrapper">
            <AdminNavbar />
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <div className="header-text">
                        <h1><FaUserShield /> Personnel & Records</h1>
                        <p>Centralized management for staff, finances, and legal records.</p>
                    </div>
                    <button className="back-home-btn" onClick={() => navigate('/admin/')}>
                        <FaArrowLeft /> Dashboard
                    </button>
                </header>

                <div className="modules-grid">
                    {modules.map((mod, index) => (
                        <div 
                            key={index} 
                            className="module-card" 
                            onClick={() => navigate(mod.path)}
                        >
                            <div className="module-icon" style={{ color: mod.color, backgroundColor: `${mod.color}15` }}>
                                {mod.icon}
                            </div>
                            <div className="module-info">
                                <h3>{mod.title}</h3>
                                <p>{mod.desc}</p>
                            </div>
                            <div className="module-footer">
                                <span>Open Module</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonnelDashboard;