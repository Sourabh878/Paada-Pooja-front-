import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../../utils/auth';
import { FaChevronDown, FaSignOutAlt, FaUserShield, FaBuilding, FaBoxOpen, FaCogs } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import "./Navbar.css";

function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveDropdown(null); // Close dropdowns when menu toggles
  };

  // For mobile click support
  const handleDropdownClick = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="navbar admin">
      <div className="nav-logo">
        <img src={logo} alt="Temple Logo" />
        <span>Admin Portal</span>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? '✕' : '☰'}
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
       <li onClick={() => navigate('/admin/PersonnelDashboard')}>
    <span className="nav-link-trigger">
        <FaUserShield /> Personnel
    </span>
     </li>

        <li className="nav-item dropdown" 
            onMouseEnter={() => setActiveDropdown('assets')} 
            onMouseLeave={() => setActiveDropdown(null)}
            onClick={() => handleDropdownClick('assets')}>
          <span className="nav-link-trigger">
            <FaBoxOpen /> Assets <FaChevronDown className={`arrow ${activeDropdown === 'assets' ? 'up' : ''}`} />
          </span>
          <ul className={`dropdown-menu ${activeDropdown === 'assets' ? 'show' : ''}`}>
            <li><Link to="/admin/AssetManager">Manage Assets</Link></li>
            <li><Link to="/admin/AssetDirectory">Asset Directory</Link></li>
          </ul>
        </li>

        <li className="nav-item dropdown" 
            onMouseEnter={() => setActiveDropdown('branches')} 
            onMouseLeave={() => setActiveDropdown(null)}
            onClick={() => handleDropdownClick('branches')}>
          <span className="nav-link-trigger">
            <FaBuilding /> Branches <FaChevronDown className={`arrow ${activeDropdown === 'branches' ? 'up' : ''}`} />
          </span>
          <ul className={`dropdown-menu ${activeDropdown === 'branches' ? 'show' : ''}`}>
            <li><Link to="/admin/BranchMaster">Temple Branches</Link></li>
            <li><Link to="/admin/BranchDirectory">Branch Directory</Link></li>
          </ul>
        </li>

        <li className="nav-item dropdown" 
            onMouseEnter={() => setActiveDropdown('Events')} 
            onMouseLeave={() => setActiveDropdown(null)}
            onClick={() => handleDropdownClick('Events')}>
          <span className="nav-link-trigger">
            <FaBoxOpen /> Events <FaChevronDown className={`arrow ${activeDropdown === 'Events' ? 'up' : ''}`} />
          </span>
          <ul className={`dropdown-menu ${activeDropdown === 'Events' ? 'show' : ''}`}>
            <li><Link to="/admin/EventMaster">Register Events</Link></li>
            <li><Link to="/admin/EventDirectory">Event Directory</Link></li>
          </ul>
        </li>

        <li><Link to="/admin"><FaCogs /> Manage Sevas</Link></li>
        <li><Link to="/admin/config"><FaCogs /> Configuration</Link></li>
        
        {/* Single Logout Button that adapts to both mobile and desktop */}
        <li className="logout-item">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;