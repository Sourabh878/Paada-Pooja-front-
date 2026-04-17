import React, { useState } from 'react';
import AdminNavbar from '../components/Navbar/AdminNavbar';
import SevaFinance from './components/SevaFinance';
import SevaManager from './components/SevaManager';
import AddCategory from './components/AddCategory';
import { FaChartLine, FaPlusCircle, FaUsers, FaCogs, FaBars, FaTimes } from 'react-icons/fa';
import './Style/AdminDashboard.css';
import BookingManager from '../pages/BookingManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('finance');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'finance', label: 'Overview', icon: <FaChartLine /> },
    { id: 'manage', label: 'Manage Sevas', icon: <FaPlusCircle /> },
    { id: 'devotees', label: 'Devotees', icon: <FaUsers /> },
    { id: 'settings', label: 'Configuration', icon: <FaCogs /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'finance': return <SevaFinance />;
      case 'manage': return <SevaManager />;
      case 'devotees': return <BookingManager />;
      case 'settings': return <AddCategory />;
      default: return <SevaFinance />;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <AdminNavbar />
      
      {/* Tab Strip / Sidebar */}
      <div className="dashboard-control-strip">
        <div className="strip-container">
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />} Menu
          </button>

          <nav className={`tab-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="dashboard-content">
        <div className="content-inner">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;